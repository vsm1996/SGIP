import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Get a specific reply
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string, replyId: string }> }
) {
  try {
    const { slug, postId, commentId, replyId } = await props.params;

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

    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        likes: {
          include: {
            user: true
          }
        },
      },
    });

    if (!reply || reply.commentId !== commentId) {
      return NextResponse.json(
        { error: 'Reply not found for this comment' },
        { status: 404 }
      );
    }

    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error fetching comment reply:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reply' },
      { status: 500 }
    );
  }
}

// Update a reply
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string, replyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId, commentId, replyId } = await props.params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: { user: true },
    });

    if (!reply || reply.commentId !== commentId) {
      return NextResponse.json(
        { error: 'Reply not found for this comment' },
        { status: 404 }
      );
    }

    // Check if the user is the reply author
    if (reply.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own replies' },
        { status: 403 }
      );
    }

    const updatedReply = await prisma.commentReply.update({
      where: { id: replyId },
      data: { message },
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

    return NextResponse.json(updatedReply);
  } catch (error) {
    console.error('Error updating comment reply:', error);
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    );
  }
}

// Delete a reply
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string, replyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId, commentId, replyId } = await props.params;

    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: { user: true },
    });

    if (!reply || reply.commentId !== commentId) {
      return NextResponse.json(
        { error: 'Reply not found for this comment' },
        { status: 404 }
      );
    }

    // Check if the user is the reply author
    if (reply.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own replies' },
        { status: 403 }
      );
    }

    const deletedReply = await prisma.commentReply.delete({
      where: { id: replyId },
    });

    return NextResponse.json(deletedReply, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment reply:', error);
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}