"use client"

import Avatar from "@rahoot/web/components/Avatar"

import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import AllPlayersModal from "@rahoot/web/components/game/modals/AllPlayersModal"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import useScreenSize from "@rahoot/web/hooks/useScreenSize"
import { useManagerStore } from "@rahoot/web/stores/manager"
import {
  SFX_PODIUM_FIRST,
  SFX_PODIUM_SECOND,
  SFX_PODIUM_THREE,
  SFX_SNEAR_ROOL,
} from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import useSound from "use-sound"

type Props = {
  data: ManagerStatusDataMap["FINISHED"] | ManagerStatusDataMap["GAME_FINISHED"]
  effectEnabled: boolean
}

const Podium = ({ data, effectEnabled }: Props) => {
  const { subject, top } = data
  const allPlayers = "allPlayers" in data ? data.allPlayers : undefined
  const [apparition, setApparition] = useState(0)
  const [showAllPlayers, setShowAllPlayers] = useState(false)
  const router = useRouter()
  const { players, gameId } = useManagerStore()
  const { socket } = useSocket()

  const { width, height } = useScreenSize()

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, {
    volume: 0.2,
  })

  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, {
    volume: 0.2,
  })

  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, {
    volume: 0.2,
  })

  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, {
    volume: 0.2,
  })

  useEffect(() => {
    switch (apparition) {
      case 5:
        sfxRoolStop()
        if (effectEnabled) {
          sfxFirst()
        }

        if (gameId) {
          socket?.emit("manager:gameFinished", { gameId })
        }

        break

      case 3:
        if (effectEnabled) {
          sfxRool()
        }

        break

      case 2:
        if (effectEnabled) {
          sfxSecond()
        }

        break

      case 1:
        if (effectEnabled) {
          sfxtThree()
        }

        break
    }
  }, [
    apparition,
    sfxFirst,
    sfxSecond,
    sfxtThree,
    sfxRool,
    sfxRoolStop,
    effectEnabled,
  ])

  useEffect(() => {
    if (top.length < 3) {
      setApparition(5)

      return
    }

    const interval = setInterval(() => {
      if (apparition > 5) {
        clearInterval(interval)

        return
      }

      setApparition((value) => value + 1)
    }, 3000)

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval)
  }, [apparition, top.length])

  return (
    <>
      {apparition >= 5 && (
        <ReactConfetti
          width={width}
          height={height}
          className="h-full w-full"
        />
      )}

      {apparition >= 3 && top.length >= 3 && (
        <div className="pointer-events-none absolute min-h-screen w-full overflow-hidden">
          <div className="spotlight"></div>
        </div>
      )}
      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-between">
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>

        <div
          style={{ gridTemplateColumns: `repeat(${top.length}, 1fr)` }}
          className={`grid w-full max-w-[800px] flex-1 items-end justify-center justify-self-end overflow-x-visible overflow-y-hidden`}
        >
          {top[1] && (
            <div
              className={clsx(
                "z-20 flex h-[50%] w-full translate-y-full flex-col items-center justify-center gap-3 opacity-0 transition-all",
                { "translate-y-0! opacity-100": apparition >= 2 },
              )}
            >
              <div
                className={clsx(
                  "flex flex-col items-center justify-center gap-2 overflow-visible text-center text-2xl font-bold whitespace-nowrap text-white drop-shadow-lg md:text-4xl",
                  {
                    "anim-balanced": apparition >= 5,
                  },
                )}
              >
                <Avatar
                  id={top[1].avatarId}
                  className="h-16 w-16 md:h-20 md:w-20"
                />
                {top[1].username}
              </div>
              <div className="bg-primary flex h-full w-full flex-col items-center gap-4 rounded-t-md pt-6 text-center shadow-2xl">
                <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-zinc-400 bg-zinc-500 text-3xl font-bold text-white drop-shadow-lg">
                  <span className="drop-shadow-md">2</span>
                </p>
                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {top[1].points}
                </p>
              </div>
            </div>
          )}

          <div
            className={clsx(
              "z-30 flex h-[60%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
              {
                "translate-y-0! opacity-100": apparition >= 3,
              },
              {
                "md:min-w-64": top.length < 2,
              },
            )}
          >
            <div
              className={clsx(
                "flex flex-col items-center justify-center gap-2 overflow-visible text-center text-2xl font-bold whitespace-nowrap text-white opacity-0 drop-shadow-lg md:text-4xl",
                { "anim-balanced opacity-100": apparition >= 5 },
              )}
            >
              <Avatar
                id={top[0].avatarId}
                className="h-20 w-20 md:h-24 md:w-24"
              />
              {top[0].username}
            </div>
            <div className="bg-primary flex h-full w-full flex-col items-center gap-4 rounded-t-md pt-6 text-center shadow-2xl">
              <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-300 text-3xl font-bold text-white drop-shadow-lg">
                <span className="drop-shadow-md">1</span>
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[0].points}
              </p>
            </div>
          </div>

          {top[2] && (
            <div
              className={clsx(
                "z-10 flex h-[40%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
                {
                  "translate-y-0! opacity-100": apparition >= 1,
                },
              )}
            >
              <div
                className={clsx(
                  "flex flex-col items-center justify-center gap-2 overflow-visible text-2xl font-bold whitespace-nowrap text-white drop-shadow-lg md:text-4xl",
                  {
                    "anim-balanced": apparition >= 5,
                  },
                )}
              >
                <Avatar
                  id={top[2].avatarId}
                  className="h-14 w-14 md:h-16 md:w-16"
                />
                {top[2].username}
              </div>
              <div className="bg-primary flex h-full w-full flex-col items-center gap-4 rounded-t-md pt-6 text-center shadow-2xl">
                <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-800 bg-amber-700 text-3xl font-bold text-white drop-shadow-lg">
                  <span className="drop-shadow-md">3</span>
                </p>

                <p className="text-2xl font-bold text-white drop-shadow-lg">
                  {top[2].points}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Buttons */}
      <div className="absolute bottom-4 left-4 z-40 flex gap-4">
        <Button
          onClick={() => router.push("/manager")}
          className="bg-white px-4 py-2 text-black!"
        >
          Back to Manager
        </Button>
        {/* <Button
          onClick={() => setApparition(0)}
          className="bg-white px-4 py-2 text-black!"
        >
          Re-animate
        </Button> */}
      </div>

      <div className="absolute right-4 bottom-4 z-40 flex gap-4">
        <Button
          onClick={() => setShowAllPlayers(true)}
          className="bg-white px-4 py-2 text-black!"
        >
          Show All Players
        </Button>
      </div>

      {showAllPlayers && (
        <AllPlayersModal
          players={allPlayers || players}
          onClose={() => setShowAllPlayers(false)}
        />
      )}
    </>
  )
}

export default Podium
