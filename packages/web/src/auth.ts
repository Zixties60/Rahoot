import env from "@rahoot/web/env"
import { getGameConfigPath, readConfig } from "@rahoot/web/utils/config"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

// Use WEB_ORIGIN as AUTH_URL if not explicitly set
if (!process.env.AUTH_URL && env.WEB_ORIGIN) {
  process.env.AUTH_URL = env.WEB_ORIGIN
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Manager Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.password) {
          return null
        }

        const configPath = getGameConfigPath()
        const config = readConfig(configPath)
        const managerPassword = config.managerPassword

        if (credentials.password === managerPassword) {
          return { id: "manager", name: "Manager" }
        }

        return null
      },
    }),
  ],
})
