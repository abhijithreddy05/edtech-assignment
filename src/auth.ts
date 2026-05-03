import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          console.log("Authorizing email:", credentials.email);
          // Find user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          console.log("User found:", user?.id);

          // If user doesn't exist, create them
          if (!user) {
            console.log("Creating new user...");
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                name: (credentials.email as string).split('@')[0],
              }
            })
            console.log("User created:", user.id);
          }

          // Return user object
          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          console.error("AUTHORIZE ERROR:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
