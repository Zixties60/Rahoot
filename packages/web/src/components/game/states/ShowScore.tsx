"use client"

import { PlayerStatusDataMap } from "@rahoot/common/types/game/status"
import CricleCheck from "@rahoot/web/components/icons/CricleCheck"
import CricleXmark from "@rahoot/web/components/icons/CricleXmark"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import clsx from "clsx"
import { useEffect } from "react"
import useSound from "use-sound"
import Avatar from "../../Avatar"

type Props = {
  data: PlayerStatusDataMap["SHOW_LEADERBOARD"]
  effectEnabled: boolean
}

const ShowScore = ({
  data: { myRank, myPoints, aheadOfMe, subject },
  effectEnabled,
}: Props) => {
  const player = usePlayerStore()
  const { getSound } = useAssets()

  const [sfxResults] = useSound(getSound("resultsResult") || "", {
    volume: 0.2,
  })

  useEffect(() => {
    player.updatePoints(myPoints ?? 0)

    if (effectEnabled) {
      sfxResults()
    }
  }, [sfxResults, effectEnabled])

  const isGold = myRank === 1
  const isSilver = myRank === 2
  const isBronze = myRank === 3

  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <div className="mt-4 flex flex-col items-center gap-4">
        <h2 className="text-center text-4xl/14 font-bold text-white drop-shadow-lg md:text-5xl/18 lg:text-6xl/22">
          {subject}
        </h2>
        {myRank && (
          <div className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                "flex aspect-square h-30 items-center justify-center rounded-full border-4 text-7xl font-bold text-white drop-shadow-lg",
                {
                  "border-amber-400 bg-amber-300": isGold,
                  "border-zinc-400 bg-zinc-500": isSilver,
                  "border-amber-800 bg-amber-700": isBronze,
                  "border-transparent": !isGold && !isSilver && !isBronze,
                },
              )}
            >
              <span className="drop-shadow-md">#{myRank}</span>
            </div>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {myRank === 1
                ? "Leading!"
                : `Behind ${aheadOfMe ? aheadOfMe : "Someone"}`}
            </p>
          </div>
        )}
      </div>

      <Avatar id={player.player?.avatarId || 0} className="mt-10 h-20 w-20" />
      <h2 className="mt-1 text-2xl font-bold text-white drop-shadow-lg">
        {player.player?.username}
      </h2>

      <div className="bg-primary text-onPrimary mt-4 rounded-sm px-3 py-1 text-2xl font-bold">
        {myPoints}
      </div>
    </section>
  )
}

export default ShowScore
