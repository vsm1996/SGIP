import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      comments: true,
      likes: true,
    },
  })
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { userId, message } = body

  const mentionedUsernames = [...message.matchAll(/@(\w+)/g)].map((match) => match[1])

  const mentionedUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: { in: mentionedUsernames }
        },
        {
          name: { in: mentionedUsernames }
        }
      ]
    }
  });

  // Validate data
  const validation = schema.safeParse(body)
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  // else, add post to db
  const newpost = await prisma.post.create({
    data: {
      message,
      userId,
      mentions: {
        connect: mentionedUsers.map(user => ({ id: user.id })),
      },
    },
  });


  if (!newpost) {
    return NextResponse.json({ message: 'Error creating post' }, { status: 400 })
  }



  //return post
  return NextResponse.json(newpost,
    // Status: 201 -> an object was created
    { status: 201 })
}
