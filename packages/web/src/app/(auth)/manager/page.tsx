"use client"

import { Add, Settings } from "@mui/icons-material"

import { QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import ManagerPassword from "@rahoot/web/components/game/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/components/game/create/SelectQuizz"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Manager = () => {
  const { setGameId, setStatus, setBackground, setTypeface } = useManagerStore()
  const router = useRouter()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:gameCreated", (data) => {
    setGameId(data.gameId)
    setStatus(STATUS.SHOW_ROOM, {
      text: "Waiting for the players",
      inviteCode: data.inviteCode,
    })
    setBackground(data.background)
    setTypeface(data.typeface)
    router.push(`/game/manager/${data.gameId}`)
  })

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }
  const handleCreate = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  const handleEdit = (quizzId: string) => {
    router.push(`/manager/quizz/${quizzId}`)
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
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
