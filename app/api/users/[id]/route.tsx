import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from '@/prisma/client'

//Defined the shape of propert inline below
// interface Props {
//   params: { id: number }
// }

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  // Fetch data from a db
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      posts: true
    }
  })

  // If not found, return 404 error
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Else return data
  return NextResponse.json(user)
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const body = await request.json()
  // Validate request body
  // If invalid, return 400
  const validation = schema.safeParse(body)
  // if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 })

  // Fetch the user with given id
  const existingUser = await prisma.user.findUnique({
    where: { id: id }
  })
  // IF user doesn't exist, return 404 not found
  if (!existingUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Else, update the user
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: body.name,
      email: body.email
    }
  })
  // Return the update user
  return NextResponse.json(updatedUser)
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  // Fetch user from db
  const user = await prisma.user.findUnique({
    where: { id: id }
  })
  // If not found, return 404
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  // Else delete user from db
  const deletedUser = await prisma.user.delete({
    where: { id: id }
  })
  // Return 200
  return NextResponse.json(deletedUser, { status: 200 })
}