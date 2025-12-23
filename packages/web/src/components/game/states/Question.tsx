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
          <h2 className="text-center text-3xl/16 font-bold text-white drop-shadow-lg md:text-4xl/24 lg:text-6xl/24">
            {question}
          </h2>
        </div>

        {image && (
          <Image
            alt={question}
            src={image}
            width={400}
            height={400}
            className="m-4 h-full max-h-[400px] min-h-[200px] w-auto rounded-md object-cover"
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
