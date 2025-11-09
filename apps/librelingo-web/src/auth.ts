import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" }
      },
      async authorize(credentials) {
        // Simple authentication - just accept any email/name combination
        // In production, you'd verify against a database
        if (credentials?.email && credentials?.name) {
          return {
            id: credentials.email as string,
            email: credentials.email as string,
            name: credentials.name as string,
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

