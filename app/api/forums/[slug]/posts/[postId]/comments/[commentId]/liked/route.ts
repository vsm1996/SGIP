import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const revalidate = 0;

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
      return NextResponse.json(
        { error: 'You have already liked this comment' },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: session.sub,
        commentId,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error liking forum post comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}