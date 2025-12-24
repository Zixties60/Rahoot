"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import Image from "next/image"
import { useEffect } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_QUESTION"]
  effectEnabled: boolean
}

const Question = ({
  data: { question, image, cooldown },
  effectEnabled,
}: Props) => {
  const { getSound } = useAssets()
  const [sfxShow] = useSound(getSound("showSound") || "", { volume: 0.5 })

  useEffect(() => {
    if (effectEnabled) {
      sfxShow()
    }
  }, [sfxShow, effectEnabled])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center px-4">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="anim-show px-4">
          <h2 className="text-center text-3xl/12 font-bold text-white drop-shadow-lg sm:text-4xl/14 md:text-5xl/18 lg:text-6xl/22">
            {question}
          </h2>
        </div>

        {image && (
          <Image
            alt={question}
            src={image}
            className="max-h-[400px] w-full rounded-md p-4 sm:h-full sm:w-auto"
            width={400}
            height={400}
          />
        )}
      </div>
      <div
        className="bg-primary mb-20 h-4 self-start justify-self-end rounded-full"
        style={{ animation: `progressBar ${cooldown}s linear forwards` }}
      ></div>
    </section>
  )
}

export default Question
