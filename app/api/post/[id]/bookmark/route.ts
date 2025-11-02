import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";



// Toggle bookmark status for a post
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const body = await request.json();
  const { userId } = body;

  // Check if the user has already bookmarked this post
  const existingBookmark = await prisma.bookmark.findFirst({
    where: { userId, postId: id },
  });

  if (existingBookmark) {
    // If bookmark exists, remove it (toggle off)
    const deletedBookmark = await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });
    return NextResponse.json({ bookmarked: false, bookmark: deletedBookmark }, { status: 200 });
  }

  // Create a new bookmark
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      postId: id,
    },
  });

  return NextResponse.json({ bookmarked: true, bookmark }, { status: 200 });
}

// Check if a post is bookmarked by the user
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: { userId, postId: id },
  });

  return NextResponse.json({ bookmarked: !!bookmark, bookmark }, { status: 200 });
}