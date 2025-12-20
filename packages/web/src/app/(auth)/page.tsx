"use client"

import Room from "@rahoot/web/components/game/join/Room"
import Username from "@rahoot/web/components/game/join/Username"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

const Home = () => {
  const { isConnected, connect } = useSocket()
  const { player } = usePlayerStore()

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
    return <Username />
  }

  return <Room pin={searchParams.get("pin") ?? undefined} />
}

export default Home
