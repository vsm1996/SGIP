import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {
  const body = await request.json()

  const { userId } = body

  const deletedLike = await prisma.like.deleteMany({
    where: {
      userId: userId,
      postId: id,
    },
  });

  return NextResponse.json(deletedLike, { status: 200 })
}