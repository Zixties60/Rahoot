"use client"

import { Check } from "@mui/icons-material"
import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus, setBackground, setTypeface, setTheme } =
    usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    if (!username.trim()) {
      toast.error("Please enter a username")

      return
    }

    socket?.emit("player:login", { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", ({ gameId, background, typeface, theme }) => {
    setStatus(STATUS.WAIT, { text: "Waiting for the players" })
    login(username)
    setBackground(background || null)
    setTypeface(typeface || null)
    setTheme(theme || null)

    router.replace(`/game/${gameId}`)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your name here"
        autoComplete="off"
      />
      <Button onClick={handleLogin} startIcon={<Check />}>
        I'm ready!
      </Button>
    </Form>
  )
}

export default Username
