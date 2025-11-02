import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";



export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

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