import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";

export const revalidate = 0

export async function POST(request: NextRequest,
  { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();

  const validation = schema.safeParse(body)
  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 })

  // Verify post exists
  const post = await prisma.post.findUnique({
    where: { id: id }
  })

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 })
  }

  // Get user from session
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const comment = await prisma.comment.create({
    data: {
      message: body.message,
      userId: session.user.id,
      postId: id
    },
    include: {
      user: true,
      commentReplies: {
        include: {
          user: true,
          likes: true
        }
      },
      likes: true
    }
  })

  return NextResponse.json(comment)
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      user: true,
      comments: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  })

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post.comments)
}
