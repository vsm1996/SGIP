import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Check if the current user has liked a post
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.sub) {
      return NextResponse.json({ liked: false });
    }

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

    const like = await prisma.like.findFirst({
      where: {
        userId: session.sub,
        postId
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking forum post like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}

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

    // Check if the user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.sub,
        postId
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'You have already liked this post' },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: session.sub,
        postId,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error liking forum post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}