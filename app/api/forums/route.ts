import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from "@/prisma/client";
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET() {
  try {
    const forums = await prisma.forum.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create a URL-friendly slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        slug,
        creatorId: session.sub,
      },
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

    return NextResponse.json(forum);
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json(
      { error: 'Failed to create forum' },
      { status: 500 }
    );
  }
}