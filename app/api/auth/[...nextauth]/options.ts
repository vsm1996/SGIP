import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt'


const authOptions: NextAuthOptions = {
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

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)

        return passwordsMatch ? user : null;
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
          where: { email: session.user.email }
        })

        session.user.firstName = user?.firstName!
        session.user.lastName = user?.lastName!
      }

      return { ...session, ...token }
    },
    async redirect({ url, baseUrl }) {
      return Promise.resolve('/dashboard')
    }
  }
}

export default authOptions