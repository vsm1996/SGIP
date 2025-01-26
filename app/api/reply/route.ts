import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const reply = await prisma.commentReply.findUnique({
    where: { id: id },
    include: {
      user: true,
      likes: true
    },
  })

  return NextResponse.json(reply)
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { userId, commentId } = body

  const validation = schema.safeParse(body)

  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  const post = await prisma.commentReply.create({
    data: {
      message: body.message,
      userId: userId,
      commentId: commentId
    }
  })

  return NextResponse.json(post)
}