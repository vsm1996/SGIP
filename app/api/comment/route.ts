import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

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

  const { userId, postId, message } = body

  const mentionedUsernames = [...message.matchAll(/@([^\s]+)/g)].map((match) => match[1])

  const validation = schema.safeParse(body)

  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

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

  const newcomment = await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        message,
        userId,
        postId
      },
      include: {
        user: true,
        commentReplies: true,
        likes: true
      }
    });

    if (mentionedUsers.length > 0) {
      await tx.mention.createMany({
        data: mentionedUsers.map(user => ({
          userId,
          mentionedUserId: user.id,
          commentId: comment.id
        }))
      });

      await tx.notification.createMany({
        data: mentionedUsers.map(user => ({
          userId: user.id,
          type: 'mention',
          message: `${comment.user.name || comment.user.username} mentioned you in a comment`
        }))
      });
    }

    return comment;
  });

  if (!newcomment) {
    return NextResponse.json({ message: 'Error creating comment' }, { status: 400 })
  }

  return NextResponse.json(newcomment)
}