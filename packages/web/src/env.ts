import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const env = createEnv({
  server: {
    SOCKET_URL: z.string().default("http://localhost:3001"),
    WEB_ORIGIN: z.string().default("http://localhost:3000"),
  },

  runtimeEnv: {
    SOCKET_URL: process.env.SOCKET_URL,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
  },
})

export default env
