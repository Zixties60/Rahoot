"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import GameWrapper from "@rahoot/web/components/game/GameWrapper"
import Answers from "@rahoot/web/components/game/states/Answers"
import PlayerResult from "@rahoot/web/components/game/states/PlayerResult"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Result from "@rahoot/web/components/game/states/Result"
import ShowScore from "@rahoot/web/components/game/states/ShowScore"
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
    setPlayerEffect,
    setPlayerMusic,
    reset,
    playerEffect,
    playerMusic,
  } = usePlayerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("player:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent("player:successReconnect", (data) => {
    const { gameId, status, player, currentQuestion, theme } = data
    setGameId(gameId)
    setStatus(status.name, status.data)
    setPlayer(player)
    setQuestionStates(currentQuestion)
    setBackground(currentQuestion.background || null)
    setTypeface(currentQuestion.typeface || null)
    setTheme(theme || null)
    setPlayerEffect(data.playerEffect)
    setPlayerMusic(data.playerMusic)
  })

  useEvent("game:updateConfig", (data) => {
    setBackground(data.background || null)
    setTypeface(data.typeface || null)
    setTheme(data.theme || null)
    setPlayerEffect(data.playerEffect)
    setPlayerMusic(data.playerMusic)
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
      component = <Start data={status.data} effectEnabled={playerEffect} />

      break

    case STATUS.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case STATUS.SHOW_QUESTION:
      component = <Question data={status.data} effectEnabled={playerEffect} />

      break

    case STATUS.SHOW_RESULT:
      component = <Result data={status.data} effectEnabled={playerEffect} />

      break

    case STATUS.SELECT_ANSWER:
      component = (
        <Answers
          manager={false}
          data={status.data}
          effectEnabled={playerEffect}
          musicEnabled={playerMusic}
        />
      )

      break

    case STATUS.SHOW_LEADERBOARD:
      component = <ShowScore data={status.data} effectEnabled={playerEffect} />

      break

    case STATUS.FINISHED:
      component = <ShowScore data={status.data} effectEnabled={playerEffect} />

      break

    case STATUS.GAME_FINISHED:
      component = (
        <PlayerResult
          data={status.data}
          message="Game Finished"
          effectEnabled={playerEffect}
        />
      )

      break
  }

  return <GameWrapper statusName={status?.name}>{component}</GameWrapper>
}

export default Game
