import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return NextResponse.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking forum post:', error);
    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    );
  }
}