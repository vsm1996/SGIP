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
