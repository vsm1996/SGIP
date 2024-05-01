import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {
  const post = await prisma.post.update({
    where: { id: id },
    data: {
      likes: { increment: 1 },
    },
  })

  return NextResponse.json(post)
}