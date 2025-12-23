"use client"

import { Add, Settings } from "@mui/icons-material"

import { QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import SelectQuizz from "@rahoot/web/components/game/create/SelectQuizz"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Manager = () => {
  const {
    setGameId,
    setStatus,
    setBackground,
    setTypeface,
    setTheme,
    setManagerEffect,
    setManagerMusic,
  } = useManagerStore()
  const router = useRouter()
  const { socket } = useSocket()

  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])

  useEffect(() => {
    fetch("/api/manager/quizz", { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error("Failed to fetch quizzes")
      })
      .then((data) => setQuizzList(data))
      .catch(() => toast.error("Failed to load quizzes"))
  }, [])

  useEvent("manager:gameCreated", (data) => {
    setGameId(data.gameId)
    setStatus(STATUS.SHOW_ROOM, {
      text: "Waiting for the players",
      inviteCode: data.inviteCode,
    })
    setBackground(data.background)
    setTypeface(data.typeface)
    setTypeface(data.typeface)
    setTheme(data.theme)
    setManagerEffect(data.managerEffect)
    setManagerMusic(data.managerMusic)
    router.push(`/game/manager/${data.gameId}`)
  })

  // We rely on NextAuth middleware for authentication now.
  // Socket "manager:auth" is no longer needed if we fetch list via API.
  // Ideally, socket connection should be authenticated too, but for creation
  // we just need the list. The "game:create" event might need check on server.

  const handleCreate = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  const handleEdit = (quizzId: string) => {
    router.push(`/manager/quizz/${quizzId}`)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex justify-between gap-2">
        <Button
          className="w-fit bg-gray-500"
          onClick={() => router.push("/manager/settings")}
          startIcon={<Settings />}
        >
          Settings
        </Button>
        <Button
          className="bg-primary w-fit"
          onClick={() => router.push("/manager/quizz/create")}
          startIcon={<Add />}
        >
          Create Quiz
        </Button>
      </div>
      <SelectQuizz
        quizzList={quizzList}
        onSelect={handleCreate}
        onEdit={handleEdit}
      />
    </div>
  )
}

export default Manager
