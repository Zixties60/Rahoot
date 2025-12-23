"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import CricleCheck from "@rahoot/web/components/icons/CricleCheck"
import CricleXmark from "@rahoot/web/components/icons/CricleXmark"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import clsx from "clsx"
import { useEffect } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_RESULT"]
  effectEnabled: boolean
}

const Result = ({
  data: { correct, message, points, myPoints, rank, aheadOfMe },
  effectEnabled,
}: Props) => {
  const player = usePlayerStore()
  const { getSound } = useAssets()

  const [sfxResults] = useSound(getSound("resultsResult") || "", {
    volume: 0.2,
  })

  useEffect(() => {
    player.updatePoints(myPoints)

    if (effectEnabled) {
      sfxResults()
    }
  }, [sfxResults, effectEnabled])

  const isGold = rank === 1
  const isSilver = rank === 2
  const isBronze = rank === 3

  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      {correct ? (
        <CricleCheck className="aspect-square max-h-60 w-full" />
      ) : (
        <CricleXmark className="aspect-square max-h-60 w-full" />
      )}
      <h2 className="mt-1 text-4xl font-bold text-white drop-shadow-lg">
        {message}
      </h2>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          className={clsx(
            "flex aspect-square h-20 items-center justify-center rounded-full border-4 text-3xl font-bold text-white drop-shadow-lg",
            {
              "border-amber-400 bg-amber-300": isGold,
              "border-zinc-400 bg-zinc-500": isSilver,
              "border-amber-800 bg-amber-700": isBronze,
              "border-transparent": !isGold && !isSilver && !isBronze,
            },
          )}
        >
          <span className="drop-shadow-md">#{rank}</span>
        </div>
        <p className="text-xl font-bold text-white drop-shadow-lg">
          {aheadOfMe ? `Behind ${aheadOfMe}` : "Leading!"}
        </p>
      </div>

      {correct && (
        <span className="mt-2 rounded bg-black/40 px-4 py-2 text-2xl font-bold text-white drop-shadow-lg">
          +{points}
        </span>
      )}
    </section>
  )
}

export default Result
