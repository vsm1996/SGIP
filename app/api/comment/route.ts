import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {
  const comment = await prisma.comment.findUnique({
    where: { id: id },
    include: {
      user: true,
      commentReplies: true,
      likes: true
    },
  })

  return NextResponse.json(comment)
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { userId, postId } = body

  const validation = schema.safeParse(body)

  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  const post = await prisma.comment.create({
    data: {
      message: body.message,
      userId,
      postId
    }
  })

  return NextResponse.json(post)
}
