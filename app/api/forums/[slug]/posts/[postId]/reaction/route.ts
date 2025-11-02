import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

;

// Add or update a reaction to a forum post
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug, postId } = await props.params;
    const body = await request.json();
    const { type = 'LIKE' } = body;

    const forum = await prisma.forum.findUnique({
      where: { slug },
    });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.forumId !== forum.id) {
      return NextResponse.json(
        { error: 'Post not found in this forum' },
        { status: 404 }
      );
    }

    // Check if the user has already reacted to this post
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        userId: session.sub,
        postId
      },
    });

    if (existingReaction) {
      // If the reaction type is the same, remove it (toggle off)
      if (existingReaction.type === type) {
        const deletedReaction = await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
        return NextResponse.json(deletedReaction);
      } else {
        // If the reaction type is different, update it
        const updatedReaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return NextResponse.json(updatedReaction);
      }
    }

    // Create a new reaction
    const reaction = await prisma.reaction.create({
      data: {
        type,
        userId: session.sub,
        postId,
      },
    });

    return NextResponse.json(reaction);
  } catch (error) {
    console.error('Error reacting to forum post:', error);
    return NextResponse.json(
      { error: 'Failed to react to post' },
      { status: 500 }
    );
  }
}

// Get all reactions for a forum post
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string, postId: string }> }
) {
  try {
    const { slug, postId } = await props.params;

    const forum = await prisma.forum.findUnique({
      where: { slug },
    });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.forumId !== forum.id) {
      return NextResponse.json(
        { error: 'Post not found in this forum' },
        { status: 404 }
      );
    }

    const reactions = await prisma.reaction.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          }
        }
      },
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
    });
  } catch (error) {
    console.error('Error fetching forum post reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}