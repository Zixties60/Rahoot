"use client"

import Room from "@rahoot/web/components/game/join/Room"
import PlayerProfile from "@rahoot/web/components/game/join/PlayerProfile"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Home = () => {
  const { isConnected, connect } = useSocket()
  const { player } = usePlayerStore()
  const [theme, setThemeState] = useState("yellow-orange")

  useEffect(() => {
    fetch("/api/manager/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setThemeState(data.theme)
        }
      })
  }, [])

  useEffect(() => {
    if (theme) {
      const themeConfig = THEME_CONFIG[theme] || THEME_CONFIG["yellow-orange"]

      if (themeConfig) {
        document.documentElement.style.setProperty(
          "--color-primary",
          themeConfig.primary,
        )
      }
    }
  }, [theme])

  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
  })

  if (player) {
    return <PlayerProfile />
  }

  return <Room pin={searchParams.get("pin") ?? undefined} />
}

export default Home
