import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { replyId } }: { params: { replyId: string } }) {
  const body = await request.json()

  const { userId } = body

  const deletedLike = await prisma.like.deleteMany({
    where: {
      userId,
      commentReplyId: replyId,
    },
  });

  return NextResponse.json(deletedLike, { status: 200 })
}