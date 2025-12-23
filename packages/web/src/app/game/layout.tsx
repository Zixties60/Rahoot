"use client"

import { useSocket } from "@rahoot/web/contexts/socketProvider"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import { PropsWithChildren, useEffect, useState } from "react"

const GameLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  const [theme, setThemeState] = useState("orange")
  const [typeface, setTypefaceState] = useState("itim")

  useEffect(() => {
    fetch("/api/settings/theme", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setThemeState(data.theme)
        }
        if (data.typeface) {
          setTypefaceState(data.typeface)
        }
      })
  }, [])

  useEffect(() => {
    if (theme) {
      const themeConfig = THEME_CONFIG[theme] || THEME_CONFIG["orange"]

      if (themeConfig) {
        document.documentElement.style.setProperty(
          "--color-primary",
          themeConfig.primary,
        )
        document.documentElement.style.setProperty(
          "--color-secondary",
          themeConfig.secondary,
        )
        document.documentElement.style.setProperty(
          "--color-onPrimary",
          themeConfig.onPrimary,
        )
        document.documentElement.style.setProperty(
          "--color-onSecondary",
          themeConfig.onSecondary,
        )
      }
    }

    if (typeface) {
      document.documentElement.style.setProperty("--font-typeface", typeface)
    }
  }, [theme, typeface])

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  return children
}

export default GameLayout
