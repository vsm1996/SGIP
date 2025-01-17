import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function DELETE(request: NextRequest,
  { params: { replyId } }: { params: { replyId: string } }) {

  // delete from db
  const deletedComment = await prisma.commentReply.delete({
    where: {
      id: replyId,
    }
  })

  //return comment
  return NextResponse.json(deletedComment,
    // Status: 200 or 204 -> an object was deleted
    { status: 200 })
}

export async function GET(request: NextRequest,
  { params: { replyId } }: { params: { replyId: string } }) {
  const comment = await prisma.commentReply.findUnique({
    where: { id: replyId },
    include: {
      user: true,
      likes: true,
    },
  })

  return NextResponse.json(comment)
}

export async function PATCH(request: NextRequest,
  { params: { replyId } }: { params: { replyId: string } }) {

  const body = await request.json();

  // Validate data
  const validation = schema.safeParse(body)


  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  // else, update post
  const updatedComment = await prisma.commentReply.update({
    where: {
      id: replyId,
    },
    data: {
      message: body.message
    }
  })

  if (!updatedComment) return NextResponse.json({ message: "Error updating comment." }, { status: 400 })

  //return comment
  return NextResponse.json(updatedComment,
    // Status: 200 or 204 -> an object was deleted
    { status: 200 })
}

export async function POST(request: NextRequest,
  { params: { id, replyId } }: { params: { id: string, replyId: string } }) {
  const body = await request.json();

  const validation = schema.safeParse(body)
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }
  const post = await prisma.commentReply.create({
    data: {
      message: body.message,
      userId: id,
      commentId: replyId
    }
  })

  return NextResponse.json(post)
}

