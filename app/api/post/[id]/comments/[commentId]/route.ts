import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest,
  { params: { commentId } }: { params: { commentId: string } }) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: true,
    },
  })

  return NextResponse.json(comment)
}

export async function POST(request: NextRequest,
  { params: { id, commentId } }: { params: { id: string, commentId: string } }) {
  const body = await request.json();

  const validation = schema.safeParse(body)
  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 })

  const post = await prisma.comment.create({
    data: {
      message: body.message,
      likes: 0,
      // likes: { userId: id, commentId: commentId }
      userId: id,
      postId: commentId
    }
  })

  return NextResponse.json(post)
}

