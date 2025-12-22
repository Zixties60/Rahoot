"use client"

import {
  ArrowBack,
  ArrowForward,
  PlayArrow,
  SkipNext,
} from "@mui/icons-material"
import { STATUS, Status } from "@rahoot/common/types/game/status"
import background from "@rahoot/web/assets/background.webp"
import Button from "@rahoot/web/components/Button"
import Loader from "@rahoot/web/components/Loader"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useQuestionStore } from "@rahoot/web/stores/question"
import { MANAGER_SKIP_BTN, THEME_CONFIG } from "@rahoot/web/utils/constants"
import clsx from "clsx"
import Image from "next/image"
import { PropsWithChildren, useEffect, useState } from "react"
import Avatar from "../Avatar"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  onBack?: () => void
  manager?: boolean
}

const GameWrapper = ({
  children,
  statusName,
  onNext,
  onBack,
  manager,
}: Props) => {
  const { isConnected } = useSocket()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  const {
    background: playerBackground,
    typeface: playerTypeface,
    theme: playerTheme,
  } = usePlayerStore()
  const {
    background: managerBackground,
    typeface: managerTypeface,
    theme: managerTheme,
  } = useManagerStore()
  const backgroundUrl = manager ? managerBackground : playerBackground
  const typeface = manager ? managerTypeface : playerTypeface
  const theme = manager ? managerTheme : playerTheme

  const themeConfig =
    THEME_CONFIG[theme || "yellow-orange"] || THEME_CONFIG["yellow-orange"]

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-primary",
      themeConfig.primary,
    )
  }, [themeConfig])

  return (
    <section
      className="relative flex min-h-screen w-full flex-col justify-between"
      style={{ fontFamily: typeface ? `var(--font-${typeface})` : undefined }}
    >
      <div
        className="fixed top-0 left-0 -z-10 h-full w-full opacity-70"
        style={{ backgroundColor: themeConfig.background }}
      >
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-60"
          src={backgroundUrl || background}
          alt="background"
          fill
        />
      </div>

      {!isConnected && !statusName ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader />
          <h1 className="text-4xl font-bold text-white">Connecting...</h1>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between p-4">
            {onBack && (
              <Button
                className="self-start bg-white px-4 text-black!"
                onClick={onBack}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
            )}

            {questionStates && (
              <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
                {`${questionStates.current} / ${questionStates.total}`}
              </div>
            )}

            {manager && next && (
              <Button
                className={clsx("", {
                  "pointer-events-none": isDisabled,
                })}
                onClick={handleNext}
                startIcon={
                  statusName === STATUS.SHOW_ROOM ? (
                    <PlayArrow />
                  ) : statusName === STATUS.SELECT_ANSWER ? (
                    <SkipNext />
                  ) : (
                    <ArrowForward />
                  )
                }
              >
                {next}
              </Button>
            )}
          </div>

          {children}

          {!manager && (
            <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
              <div className="flex items-center gap-2">
                <Avatar id={player?.avatarId || 0} className="h-8 w-8" />
                <p className="text-gray-800">{player?.username}</p>
              </div>
              <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
                {player?.points}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default GameWrapper
