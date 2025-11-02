import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";



export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  // delete from db
  const deletedComment = await prisma.comment.delete({
    where: {
      id: id,
    }
  })

  //return comment
  return NextResponse.json(deletedComment,
    // Status: 200 or 204 -> an object was deleted
    { status: 200 })
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const comment = await prisma.comment.findUnique({
    where: { id: id },
    include: {
      user: true,
      commentReplies: {
        include: {
          user: true,
          likes: true,
          comment: true,
        }
      },
      likes: {
        include: {
          user: true
        }
      }
    },
  })

  return NextResponse.json(comment)
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const body = await request.json();

  // Validate data
  const validation = schema.safeParse(body)


  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  // else, update post
  const updatedComment = await prisma.comment.update({
    where: {
      id: id,
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

