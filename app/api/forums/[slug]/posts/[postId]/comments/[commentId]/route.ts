import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Get a specific comment
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
      include: {
        user: {
          select: {
            username: true,
            name: true,
            image: true,
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
        likes: {
          include: {
            user: true
          }
        },
      },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found for this post' },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error fetching forum post comment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

// Update a comment
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId, commentId } = await props.params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Comment message is required' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found for this post' },
        { status: 404 }
      );
    }

    // Check if the user is the comment author
    if (comment.userId !== session.sub) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating forum post comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string, commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId, commentId } = await props.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment || comment.postId !== postId) {
      return NextResponse.json(
        { error: 'Comment not found for this post' },
        { status: 404 }
      );
    }

    // Check if the user is the comment author
    if (comment.userId !== session.sub) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      );
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error) {
    console.error('Error deleting forum post comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}