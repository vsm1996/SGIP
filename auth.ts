import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import bcrypt from 'bcrypt'
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    sub: string;
    user: {
      firstName: string | undefined;
      lastName: string | undefined;
      username: string | undefined;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        if (!credentials || typeof credentials.email !== "string" || typeof credentials.password !== "string") {
          throw new Error("Invalid credentials");
        }


        const user = await prisma.user.findFirst({
          where: { email: credentials.email }
        });


        if (!user) {
          throw new Error("The email or password you entered is incorrect.");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!);

        return passwordsMatch ? user : null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });

        if (user) {
          session.user.firstName = user.firstName!;
          session.user.lastName = user.lastName!;
        }
      }

      return { ...session, ...token };
    },
    async redirect({ url, baseUrl }) {
      return '/dashboard';  // Always redirect to the dashboard after login
    }
  }
});
