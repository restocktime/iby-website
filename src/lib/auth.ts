import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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

          // For demo purposes, using hardcoded admin credentials
          // In production, this would check against a database
          const adminEmail = process.env.ADMIN_EMAIL || "admin@isaacbenyakar.com"
          // Pre-hashed password for "admin123"
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJW.LKUhO"

          if (credentials.email === adminEmail) {
            const isValidPassword = await bcrypt.compare(credentials.password, adminPasswordHash)
            
            if (isValidPassword) {
              return {
                id: "1",
                email: adminEmail,
                name: "Isaac Benyakar",
                role: "admin"
              }
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
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login"
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth Warning:", code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata)
      }
    }
  }
}