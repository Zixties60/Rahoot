"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/components/AnswerButton"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { ANSWERS_COLORS, ANSWERS_ICONS } from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSound from "use-sound"
import Image from "next/image"

type Props = {
  data: CommonStatusDataMap["SELECT_ANSWER"]
  manager: boolean
  effectEnabled: boolean
  musicEnabled: boolean
}

const Answers = ({
  data: { question, answers, image, time, totalPlayer },
  manager,
  effectEnabled,
  musicEnabled,
}: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { player } = usePlayerStore()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)

  const { getSound } = useAssets()

  const [sfxPop] = useSound(getSound("answersSound") || "", {
    volume: 0.1,
  })

  const [playMusic, { stop: stopMusic }] = useSound(
    getSound("answersMusic") || "",
    {
      volume: 0.2,
      interrupt: true,
      loop: true,
      html5: true,
    },
  )

  const handleAnswer = (answerKey: number) => () => {
    if (!player) {
      return
    }

    socket?.emit("player:selectedAnswer", {
      gameId,
      data: {
        answerKey,
      },
    })
    if (effectEnabled) {
      sfxPop()
    }
  }

  useEffect(() => {
    if (musicEnabled) {
      playMusic()
    } else {
      stopMusic()
    }

    return () => {
      stopMusic()
    }
  }, [playMusic, musicEnabled, stopMusic])

  useEvent("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  useEvent("game:playerAnswer", (count) => {
    setTotalAnswer(count)
    if (effectEnabled) {
      sfxPop()
    }
  })

  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        <div className="px-4">
          <h2 className="text-center text-3xl/12 font-bold text-white drop-shadow-lg sm:text-4xl/14 md:text-5xl/18 lg:text-6xl/22">
            {question}
          </h2>
        </div>

        {image && (
          <Image
            alt={question}
            src={image}
            className="h-full max-h-[600px] w-full rounded-md p-4 sm:w-auto"
            width={600}
            height={600}
          />
        )}
      </div>

      <div className="flex h-fit flex-col items-center justify-center gap-2">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 px-2">
          <div className="flex h-fit w-full items-center justify-start gap-2">
            <div className="flex flex-col items-center gap-0">
              <span className="text-lg font-bold text-white">Time</span>
              <div className="bg-secondary text-onSecondary flex items-center justify-center rounded-full px-4 py-2 text-2xl font-bold">
                <span>{cooldown}</span>
              </div>
            </div>
            <div className="w-full pl-2">
              <div
                className="bg-secondary mt-8 h-4 self-start rounded-full"
                style={{
                  animation: `countdownBar ${time}s linear forwards`,
                }}
              />
            </div>
            {manager && (
              <div className="flex flex-col items-center gap-0">
                <span className="text-lg font-bold text-white">Answers</span>
                <div className="bg-secondary text-onSecondary flex items-center justify-center rounded-full px-4 py-2 text-2xl font-bold">
                  <span>{totalAnswer}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mx-auto grid w-full grid-cols-2 gap-1 rounded-full text-xl font-bold text-white sm:mb-4 md:text-2xl">
            {answers.map((answer, key) => (
              <AnswerButton
                key={key}
                className={clsx(ANSWERS_COLORS[key])}
                icon={ANSWERS_ICONS[key]}
                onClick={handleAnswer(key)}
              >
                {answer}
              </AnswerButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Answers
