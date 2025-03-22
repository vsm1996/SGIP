import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";

export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  const { id, commentId } = params;
  const body = await request.json();

  // Verify comment exists
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
  }

  if (comment.postId !== id) {
    return NextResponse.json(
      { message: 'Comment does not belong to this post' },
      { status: 400 }
    );
  }

  // Get user from session
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const reply = await prisma.commentReply.create({
    data: {
      message: body.message,
      userId: session.user.id,
      commentId: commentId,
    },
    include: {
      user: true,
      likes: true,
    },
  });

  return NextResponse.json(reply);
}