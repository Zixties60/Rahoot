"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import { useEvent } from "@rahoot/web/contexts/socketProvider"
import clsx from "clsx"
import { useState } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_START"]
  effectEnabled: boolean
}

const Start = ({ data: { time, subject }, effectEnabled }: Props) => {
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)

  const { getSound } = useAssets()
  const [sfxBoump] = useSound(getSound("boumpSound") || "", {
    volume: 0.2,
  })

  useEvent("game:startCooldown", () => {
    if (effectEnabled) {
      sfxBoump()
    }
    setShowTitle(false)
  })

  useEvent("game:cooldown", (sec) => {
    if (effectEnabled) {
      sfxBoump()
    }
    setCooldown(sec)
  })

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      {showTitle ? (
        <h2 className="anim-show text-center text-4xl/14 font-bold text-white drop-shadow-lg sm:text-5xl/18 md:text-6xl/22 lg:text-7xl/26">
          {subject}
        </h2>
      ) : (
        <>
          <div
            className={clsx(
              `anim-show bg-primary aspect-square h-32 transition-all md:h-60`,
            )}
            style={{
              transform: `rotate(${45 * (time - cooldown)}deg)`,
            }}
          ></div>
          <span className="absolute text-6xl font-bold text-white drop-shadow-md md:text-8xl">
            {cooldown}
          </span>
        </>
      )}
    </section>
  )
}

export default Start
