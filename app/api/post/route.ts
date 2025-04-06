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

  const { userId, message, content, isRichText = false } = body

  const mentionedUsernames = [...message.matchAll(/@([^\s]+)/g)].map((match) => match[1])

  // console.log(mentionedUsernames)

  // Validate data first
  const validation = schema.safeParse(body)
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  // Find mentioned users efficiently
  const mentionedUsers = await prisma.user.findMany({
    where: {
      OR: [
        { username: { in: mentionedUsernames } },
        { name: { in: mentionedUsernames } }
      ]
    },
    select: {
      id: true,
      name: true,
      username: true
    }
  });


  if (mentionedUsernames.length > 0 && mentionedUsers.length === 0) {
    return NextResponse.json({ message: 'One or more mentioned users not found' }, { status: 400 })
  }

  // Create post and related data in a transaction
  const newpost = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        message,
        content,
        isRichText,
        userId
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: true
      }
    });

    if (mentionedUsers.length > 0) {
      // Batch create mentions
      await tx.mention.createMany({
        data: mentionedUsers.map(user => ({
          userId,
          mentionedUserId: user.id,
          postId: post.id
        }))
      });

      // Batch create notifications
      await tx.notification.createMany({
        data: mentionedUsers.map(user => ({
          userId: user.id,
          type: 'mention',
          message: `${post.user.name || post.user.username} mentioned you in a post`
        }))
      });
    }

    return post;
  });


  if (!newpost) {
    return NextResponse.json({ message: 'Error creating post' }, { status: 400 })
  }



  //return post
  return NextResponse.json(newpost,
    // Status: 201 -> an object was created
    { status: 201 })
}
