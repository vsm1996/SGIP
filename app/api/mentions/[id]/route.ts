import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

export async function GET(request: NextRequest, props: { params: { id: string } }) {
  const params = await props.params;
  const { id } = params;
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // First check if user exists
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Get total count for pagination
  const totalCount = await prisma.mention.count({
    where: { mentionedUserId: id }
  });

  const mentions = await prisma.mention.findMany({
    where: { mentionedUserId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      post: {
        select: {
          id: true,
          userId: true,
          createdAt: true,
          message: true,
          sessionId: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          likes: {
            select: {
              id: true,
              userId: true
            }
          },
          comments: true
        }
      },
      comment: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          likes: {
            select: {
              id: true,
              userId: true
            }
          },
          commentReplies: true,
          post: {
            select: {
              id: true,
              userId: true,
              createdAt: true,
              message: true,
              sessionId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true
                }
              }
            }
          }
        }
      },
      commentReply: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          },
          likes: {
            select: {
              id: true,
              userId: true
            }
          },
          comment: {
            include: {
              post: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      username: true,
                      image: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit
  });

  // Update unread status
  if (mentions.length > 0) {
    await prisma.mention.updateMany({
      where: {
        mentionedUserId: id,
        unread: true
      },
      data: { unread: false }
    });
  }

  return NextResponse.json({
    mentions,
    pagination: {
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit
    }
  }, { status: 200 })
}