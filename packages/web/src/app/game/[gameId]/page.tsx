"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import GameWrapper from "@rahoot/web/components/game/GameWrapper"
import Answers from "@rahoot/web/components/game/states/Answers"
import Attention from "@rahoot/web/components/game/states/Attention"
import PlayerResult from "@rahoot/web/components/game/states/PlayerResult"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Result from "@rahoot/web/components/game/states/Result"
import Start from "@rahoot/web/components/game/states/Start"
import Wait from "@rahoot/web/components/game/states/Wait"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useQuestionStore } from "@rahoot/web/stores/question"
import { GAME_STATE_COMPONENTS } from "@rahoot/web/utils/constants"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

const Game = () => {
  const router = useRouter()
  const { socket } = useSocket()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const {
    status,
    setPlayer,
    setGameId,
    setStatus,
    setBackground,
    setTypeface,
    setTheme,
    reset,
  } = usePlayerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("player:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent(
    "player:successReconnect",
    ({ gameId, status, player, currentQuestion, theme }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayer(player)
      setQuestionStates(currentQuestion)
      setBackground(currentQuestion.background || null)
      setTypeface(currentQuestion.typeface || null)
      setTheme(theme || null)
    },
  )

  useEvent("game:updateConfig", (data) => {
    setBackground(data.background || null)
    setTypeface(data.typeface || null)
    setTheme(data.theme || null)
  })

  useEvent("game:updateQuestion", (data) => {
    // Background and typeface are handled by game:updateConfig
  })

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS) {
      setStatus(name, data)
    }
  })

  useEvent("game:reset", (message) => {
    router.replace("/")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  if (!gameIdParam) {
    return null
  }

  let component = null

  switch (status?.name) {
    case STATUS.WAIT:
      component = <Wait data={status.data} />

      break

    case STATUS.SHOW_START:
      component = <Start data={status.data} />

      break

    case STATUS.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case STATUS.SHOW_QUESTION:
      component = <Question data={status.data} />

      break

    case STATUS.SHOW_RESULT:
      component = <Result data={status.data} />

      break

    case STATUS.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break

    case STATUS.FINISHED:
      component = <Attention data={{ text: "Look at the screen" }} />

      break

    case STATUS.GAME_FINISHED:
      component = <PlayerResult data={status.data} message="Game Finished" />

      break

    case STATUS.SHOW_LEADERBOARD:
      component = <Attention data={{ text: "Look at the screen" }} />

      break
  }

  return <GameWrapper statusName={status?.name}>{component}</GameWrapper>
}

export default Game
