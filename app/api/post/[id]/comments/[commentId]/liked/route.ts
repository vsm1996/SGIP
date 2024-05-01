import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { commentId } }: { params: { commentId: string } }) {
  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      likes: { increment: 1 },
    },
  })

  return NextResponse.json(comment)
}