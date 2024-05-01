import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {
  const comment = await prisma.comment.update({
    where: { id: id },
    data: {
      likes: { decrement: 1 },
    },
  })

  return NextResponse.json(comment)
}