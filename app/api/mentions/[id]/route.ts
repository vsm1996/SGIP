import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const body = await request.json()

  const { userId } = body

  const mentions = await prisma?.mention.findMany({
    select: {
      userId
    }
  })

  if (!mentions) return NextResponse.json({ message: "No mentions found" }, { status: 404 })

  return NextResponse.json(mentions, { status: 200 })
}