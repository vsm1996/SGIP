import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Add or remove a like from a comment
export async function POST(
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

    // Check if the user has already liked this comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.sub,
        commentId
      },
    });

    if (existingLike) {
      // If like exists, remove it (unlike)
      const deletedLike = await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json(deletedLike);
    }

    // Create a new like
    const like = await prisma.like.create({
      data: {
        userId: session.sub,
        commentId,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}

// Get all likes for a comment
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

    const likes = await prisma.like.findMany({
      where: { commentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          }
        }
      },
    });

    return NextResponse.json({
      likes,
      total: likes.length
    });
  } catch (error) {
    console.error('Error fetching comment likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}