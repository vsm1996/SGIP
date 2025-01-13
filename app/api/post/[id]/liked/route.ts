import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {
  const body = await request.json()

  const { userId } = body

  // Check if the user has already liked this comment
  const existingLike = await prisma.like.findFirst({
    where: { userId, postId: id },
  });

  if (existingLike) {
    return NextResponse.json({ message: "Already liked" }, { status: 400 });
  }

  const like = await prisma.like.create({
    data: {
      userId,
      postId: id,
    },
  })

  return NextResponse.json(like, { status: 200 })
}