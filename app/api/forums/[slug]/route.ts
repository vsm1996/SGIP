import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const forum = await prisma.forum.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            username: true,
            name: true,
          },
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(forum);
  } catch (error) {
    console.error('Error fetching forum:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum' },
      { status: 500 }
    );
  }
}