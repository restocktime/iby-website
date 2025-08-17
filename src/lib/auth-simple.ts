import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Simple check for development
          if (credentials.email === "admin@isaacbenyakar.com" && credentials.password === "admin123") {
            return {
              id: "1",
              email: "admin@isaacbenyakar.com",
              name: "Isaac Benyakar",
              role: "admin"
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login"
  },
  debug: process.env.NODE_ENV === "development"
}