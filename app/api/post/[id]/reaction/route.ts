import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const revalidate = 0

// Add or update a reaction to a post
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const body = await request.json();
  const { userId, type = 'LIKE' } = body;

  // Check if the user has already reacted to this post
  const existingReaction = await prisma.reaction.findFirst({
    where: { userId, postId: id },
  });

  if (existingReaction) {
    // If the reaction type is the same, remove it (toggle off)
    if (existingReaction.type === type) {
      const deletedReaction = await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
      return NextResponse.json(deletedReaction, { status: 200 });
    } else {
      // If the reaction type is different, update it
      const updatedReaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type },
      });
      return NextResponse.json(updatedReaction, { status: 200 });
    }
  }

  // Create a new reaction
  const reaction = await prisma.reaction.create({
    data: {
      type,
      userId,
      postId: id,
    },
  });

  return NextResponse.json(reaction, { status: 200 });
}

// Get all reactions for a post
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const reactions = await prisma.reaction.findMany({
    where: { postId: id },
    include: { user: true },
  });

  // Group reactions by type for easier frontend processing
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.type]) {
      acc[reaction.type] = [];
    }
    acc[reaction.type].push(reaction);
    return acc;
  }, {} as Record<string, typeof reactions>);

  return NextResponse.json({
    reactions,
    groupedReactions,
    counts: Object.entries(groupedReactions).reduce((acc, [type, reactions]) => {
      acc[type] = reactions.length;
      return acc;
    }, {} as Record<string, number>),
    total: reactions.length
  }, { status: 200 });
}