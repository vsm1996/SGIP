import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest, props: { params: { id: string } }) {
  const params = await props.params;

  const { id } = params

  const mentions = await prisma.mention.findMany({
    where: {
      userId: id
    },
    include: {
      user: true,
      post: {
        include: {
          user: true,
          comments: {
            include: {
              user: true,
              likes: true,
              commentReplies: {
                include: {
                  user: true,
                  likes: true
                }
              }
            }
          },
          likes: {
            include: {
              user: true
            }
          }
        }
      }
    }
  })

  if (!mentions) return NextResponse.json({ message: "No mentions found" }, { status: 404 })

  return NextResponse.json(mentions, { status: 200 })
}