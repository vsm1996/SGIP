import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt'


export const authOptions: NextAuthOptions = {
  //when using an adapter, NextAuth changes the session strategy from JWT to database
  // At the time of 2/9/24, you can't use db sessions with OAuth providers / Social Logins
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.email) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)

        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name || user.firstName || user.username || user.email.split('@')[0],
          email: user.email,
          image: user.image || null,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          username: user.username || undefined
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  // Use the below to reinstate the JWT strategy
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            firstName: true,
            lastName: true,
            username: true
          }
        })

        if (user) {
          // Generate username if it doesn't exist
          if (!user.username) {
            let username = session.user.email.split('@')[0]
            let tempUsername = username
            let counter = 1

            // Ensure username uniqueness
            while (await prisma.user.findUnique({ where: { username: tempUsername } })) {
              tempUsername = `${username}${counter}`
              counter++
            }

            // Update user with new username
            await prisma.user.update({
              where: { id: user.id },
              data: { username: tempUsername }
            })

            user.username = tempUsername
          }

          // Ensure all required fields are present
          session.user = {
            name: user.name || user.firstName || user.username || session.user.email.split('@')[0],
            email: user.email || session.user.email,
            image: user.image || '/default-avatar.png',
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            username: user.username
          }
          session.sub = user.id
        }
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      return Promise.resolve('/dashboard')
    }
  }
}

export default authOptions