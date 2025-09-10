import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // For OAuth providers, create username from profile if not exists
        if (!user.username) {
          user.username = profile?.login || profile?.preferred_username || user.name?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0] || 'user'
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.username || user.name?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0] || 'user'
        token.avatar = user.avatar || user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}

declare module "next-auth" {
  interface User {
    username: string
    avatar?: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      username: string
      avatar?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
    avatar?: string
  }
}
