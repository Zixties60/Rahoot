import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/manager/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnManager = nextUrl.pathname.startsWith("/manager")
      const isOnLogin = nextUrl.pathname.startsWith("/manager/login")

      if (isOnManager) {
        if (isOnLogin) {
          // If already logged in, redirect to manager dashboard
          if (isLoggedIn) {
            return Response.redirect(new URL("/manager", nextUrl))
          }
          return true // Allow access to login page
        }

        if (isLoggedIn) return true
        return Response.redirect(new URL("/manager/login", nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      return session
    },
  },
  providers: [], // Providers with Node.js dependencies will be added in auth.ts
} satisfies NextAuthConfig
