import { PlayerStatusDataMap } from "@rahoot/common/types/game/status"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import useScreenSize from "@rahoot/web/hooks/useScreenSize"
import { usePlayerStore } from "@rahoot/web/stores/player"
import clsx from "clsx"
import { useEffect } from "react"
import ReactConfetti from "react-confetti"
import useSound from "use-sound"

type Props = {
  data:
    | PlayerStatusDataMap["FINISHED"]
    | PlayerStatusDataMap["GAME_FINISHED"]
    | PlayerStatusDataMap["SHOW_LEADERBOARD"]
  message?: string
  effectEnabled: boolean
}

const PlayerResult = ({
  data,
  message = "Game Over",
  effectEnabled,
}: Props) => {
  const player = usePlayerStore()
  const { width, height } = useScreenSize()
  const { myPoints, myRank } = data
  const { getSound } = useAssets()

  const soundUrl =
    myRank === 1
      ? getSound("podiumFirst")
      : myRank === 2
        ? getSound("podiumSecond")
        : myRank === 3
          ? getSound("podiumThree")
          : getSound("resultsResult")

  const [sfxResults] = useSound(soundUrl || "", {
    volume: 0.2,
    soundEnabled: effectEnabled,
  })

  useEffect(() => {
    if (myPoints !== undefined) {
      player.updatePoints(myPoints)
    }

    if (effectEnabled) {
      sfxResults()
    }
  }, [sfxResults, myPoints, effectEnabled])

  const isGold = myRank === 1
  const isSilver = myRank === 2
  const isBronze = myRank === 3
  const isWinner = isGold || isSilver || isBronze

  return (
    <>
      {isWinner && (
        <ReactConfetti
          width={width}
          height={height}
          className="h-full w-full"
        />
      )}
      <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            {message}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className={clsx(
              "flex aspect-square h-40 items-center justify-center rounded-full border-8 text-6xl font-bold text-white shadow-2xl drop-shadow-xl",
              {
                "border-amber-400 bg-amber-300": isGold,
                "border-zinc-400 bg-zinc-500": isSilver,
                "border-amber-800 bg-amber-700": isBronze,
                "border-white/20 bg-white/10 px-4":
                  !isGold && !isSilver && !isBronze,
              },
            )}
          >
            <span className="text-7xl drop-shadow-md">#{myRank || " -"}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {isGold
                ? "Champion!"
                : isSilver
                  ? "Runner up!"
                  : isBronze
                    ? "Podium Finish!"
                    : "Well Played!"}
            </p>
            <p className="text-xl font-medium text-white/90 drop-shadow-md">
              {myPoints} Points
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default PlayerResult
