import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Get all replies for a comment on a forum post
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string }> }
) {
  try {
    const { slug, postId, commentId } = await props.params;

    const forum = await prisma.forum.findUnique({
      where: { slug },
    });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.forumId !== forum.id) {
      return NextResponse.json(
        { error: 'Post not found in this forum' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found for this post' },
        { status: 404 }
      );
    }

    const replies = await prisma.commentReply.findMany({
      where: { commentId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        likes: true,
      },
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching comment replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

// Create a new reply for a comment on a forum post
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId, commentId } = await props.params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    const forum = await prisma.forum.findUnique({
      where: { slug },
    });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.forumId !== forum.id) {
      return NextResponse.json(
        { error: 'Post not found in this forum' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found for this post' },
        { status: 404 }
      );
    }

    // Extract mentioned usernames from the message
    const mentionedUsernames = [...message.matchAll(/@([^\s]+)/g)].map((match) => match[1]);

    // Find mentioned users
    const mentionedUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: { in: mentionedUsernames } },
          { name: { in: mentionedUsernames } }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true
      }
    });

    const reply = await prisma.$transaction(async (tx) => {
      // Create the reply
      const newReply = await tx.commentReply.create({
        data: {
          message,
          userId: session.user.id,
          commentId,
        },
        include: {
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
          likes: true,
        },
      });

      // Create mentions if any
      if (mentionedUsers.length > 0) {
        await tx.mention.createMany({
          data: mentionedUsers.map(user => ({
            userId: session.user.id,
            mentionedUserId: user.id,
            commentReplyId: newReply.id
          }))
        });

        // Create notifications for mentions
        await tx.notification.createMany({
          data: mentionedUsers.map(user => ({
            userId: user.id,
            type: 'mention',
            message: `${newReply.user.name || newReply.user.username} mentioned you in a reply`
          }))
        });
      }

      return newReply;
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error creating comment reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}