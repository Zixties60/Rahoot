"use client"

import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/components/AnswerButton"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import { ANSWERS_COLORS, ANSWERS_ICONS } from "@rahoot/web/utils/constants"
import { calculatePercentages } from "@rahoot/web/utils/score"
import clsx from "clsx"
import { useEffect, useState } from "react"
import useSound from "use-sound"

type Props = {
  data: ManagerStatusDataMap["SHOW_RESPONSES"]
  effectEnabled: boolean
  musicEnabled: boolean
}

const Responses = ({
  data: { question, answers, responses, correct },
  effectEnabled,
  musicEnabled,
}: Props) => {
  const [percentages, setPercentages] = useState<Record<string, string>>({})

  const { getSound } = useAssets()

  const [sfxResults] = useSound(getSound("resultsResult") || "", {
    volume: 0.2,
  })

  useEffect(() => {
    if (effectEnabled) {
      sfxResults()
    }

    setPercentages(calculatePercentages(responses))
  }, [responses, sfxResults, effectEnabled])

  return (
    <div className="flex h-full flex-1 flex-col justify-between pb-14">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        <div className="px-4">
          <h2 className="text-center text-3xl/16 font-bold text-white drop-shadow-lg md:text-4xl/24 lg:text-6xl/24">
            {question}
          </h2>
        </div>

        <div
          className={`mt-8 grid h-40 w-full max-w-3xl gap-4 px-2`}
          style={{ gridTemplateColumns: `repeat(${answers.length}, 1fr)` }}
        >
          {answers.map((_, key) => (
            <div
              key={key}
              className={clsx(
                "flex flex-col justify-end self-end overflow-hidden rounded-md",
                ANSWERS_COLORS[key],
                {
                  "opacity-65": responses && correct !== key,
                  "grayscale-50": responses && correct !== key,
                },
              )}
              style={{ height: percentages[key] }}
            >
              <span className="w-full bg-black/10 text-center text-lg font-bold text-white drop-shadow-md">
                {responses[key] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-xl font-bold text-white md:text-2xl">
          {answers.map((answer, key) => (
            <AnswerButton
              key={key}
              className={clsx(ANSWERS_COLORS[key], {
                "opacity-65": responses && correct !== key,
                "grayscale-50": responses && correct !== key,
              })}
              icon={ANSWERS_ICONS[key]}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Responses
