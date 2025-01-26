import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function DELETE(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {

  // delete from db
  const deletedPost = await prisma.post.delete({
    where: {
      id: id,
    }
  })

  if (!deletedPost) return NextResponse.json({ message: "Error deleting message." }, { status: 400 })

  //return post
  return NextResponse.json(deletedPost,
    // Status: 200 or 204 -> an object was deleted
    { status: 200 })
}

export async function PATCH(request: NextRequest,
  { params: { id } }: { params: { id: string } }) {

  const body = await request.json();

  // Validate data
  const validation = schema.safeParse(body)
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  // else, update post
  const updatedPost = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      message: body.message
    }
  })

  if (!updatedPost) return NextResponse.json({ message: "Error updating post." }, { status: 400 })

  //return post
  return NextResponse.json(updatedPost,
    // Status: 200 or 204 -> an object was deleted
    { status: 200 })
}

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // Fetch data from a db
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
          likes: true,
          commentReplies: true,
        }
      },
      likes: {
        include: {
          user: true
        }
      }
    },
  })

  // If not found, return 404 error
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  // Else return data
  return NextResponse.json(post)
}