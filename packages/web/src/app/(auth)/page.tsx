"use client"

import Room from "@rahoot/web/components/game/join/Room"
import PlayerProfile from "@rahoot/web/components/game/join/PlayerProfile"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
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
    return <PlayerProfile />
  }

  return <Room pin={searchParams.get("pin") ?? undefined} />
}

export default Home
