import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const body = await request.json()

  const { userId } = body

  // Check if the user has already liked this reply
  const existingLike = await prisma.like.findFirst({
    where: { userId, commentReplyId: id },
  });

  if (existingLike) {
    return NextResponse.json({ message: "Already liked" }, { status: 400 });
  }

  const like = await prisma.like.create({
    data: {
      userId,
      commentReplyId: id
    },
  })

  return NextResponse.json(like, { status: 200 })
}