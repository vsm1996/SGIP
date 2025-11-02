import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Get all comments for a forum post
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const { slug, postId } = await props.params;

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

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
            id: true,
          },
        },
        commentReplies: {
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
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
        _count: {
          select: {
            likes: true,
            commentReplies: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching forum post comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Create a new comment for a forum post
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId } = await props.params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Comment message is required' },
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

    const comment = await prisma.$transaction(async (tx) => {
      // Create the comment
      const newComment = await tx.comment.create({
        data: {
          message,
          userId: session.sub,
          postId,
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
          _count: {
            select: {
              likes: true,
              commentReplies: true,
            },
          },
        },
      });

      // Create mentions if any
      if (mentionedUsers.length > 0) {
        await tx.mention.createMany({
          data: mentionedUsers.map(user => ({
            userId: session.sub,
            mentionedUserId: user.id,
            commentId: newComment.id
          }))
        });

        // Create notifications for mentions
        await tx.notification.createMany({
          data: mentionedUsers.map(user => ({
            userId: session.sub,
            type: 'mention',
            message: `${newComment.user.name || newComment.user.username} mentioned you in a comment`
          }))
        });
      }

      return newComment;
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating forum post comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}