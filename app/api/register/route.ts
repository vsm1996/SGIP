import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import schema from "./schema";

import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = schema.safeParse(body)

  if (!validation.success) {
    const errorMessages = validation.error.errors.map(error => error.message)
    return NextResponse.json(errorMessages, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } })

  if (user) return NextResponse.json({ error: 'User already exists' }, { status: 400 })

  const hashedPassword = await bcrypt.hash(body.password, 10)

  // Generate username from email if not provided
  let username = body.username
  if (!username) {
    username = body.email.split('@')[0]
    // Check if username exists
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      // Append numbers until we find a unique username
      let counter = 1
      let tempUsername = username
      while (await prisma.user.findUnique({ where: { username: tempUsername } })) {
        tempUsername = `${username}${counter}`
        counter++
      }
      username = tempUsername
    }
  }

  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      username,
      hashedPassword
    }
  })

  return NextResponse.json({ email: newUser.email }, { status: 201 })
}