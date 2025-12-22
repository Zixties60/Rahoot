"use client"

import { Check } from "@mui/icons-material"
import { STATUS } from "@rahoot/common/types/game/status"
import Avatar from "@rahoot/web/components/Avatar"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { AVATARS } from "@rahoot/web/utils/constants"
import clsx from "clsx"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"

const PlayerProfile = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus, setBackground, setTypeface, setTheme } =
    usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    Math.floor(Math.random() * 8),
  )

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    if (!username.trim()) {
      toast.error("Please enter a username")

      return
    }

    socket?.emit("player:login", {
      gameId,
      data: { username, avatarId: selectedAvatarId },
    })
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
    <Form className="gap-6!">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-600 uppercase">
          Avatar
        </label>
        <div className="grid grid-cols-4 gap-2">
          {AVATARS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={clsx(
                "relative rounded-xl transition-all",
                selectedAvatarId === i
                  ? "scale-115 ring-4 ring-white"
                  : "opacity-50 hover:opacity-100",
              )}
              onClick={() => setSelectedAvatarId(i)}
            >
              <Avatar id={i} className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <label className="text-sm font-bold text-gray-600 uppercase">
          Player Name
        </label>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your name here"
          autoComplete="off"
        />
      </div>

      <Button onClick={handleLogin} startIcon={<Check />}>
        I'm ready!
      </Button>
    </Form>
  )
}

export default PlayerProfile
