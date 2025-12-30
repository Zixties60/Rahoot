"use client"

import logo from "@rahoot/web/assets/logo.svg"
import Loader from "@rahoot/web/components/Loader"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import Image from "next/image"
import { PropsWithChildren, useEffect, useState } from "react"

const AuthLayout = ({ children }: PropsWithChildren) => {
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

  if (!isConnected) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="absolute h-full w-full overflow-hidden">
          <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
          <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
        </div>

        <Image src={logo} className="mb-6 h-32" alt="logo" />
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          Loading...
        </h2>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />
      {children}
    </section>
  )
}

export default AuthLayout
