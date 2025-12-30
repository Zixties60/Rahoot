import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import Avatar from "@rahoot/web/components/Avatar"
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react"
import { useEffect, useState } from "react"

type Props = {
  data: ManagerStatusDataMap["SHOW_LEADERBOARD"]
}

const AnimatedPoints = ({ from, to }: { from: number; to: number }) => {
  const spring = useSpring(from, { stiffness: 1000, damping: 30 })
  const display = useTransform(spring, (value) => Math.round(value))
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    spring.set(to)
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest)
    })

    return unsubscribe
  }, [to, spring, display])

  return <span className="drop-shadow-md">{displayValue}</span>
}

const Leaderboard = ({ data: { oldLeaderboard, leaderboard } }: Props) => {
  const [displayedLeaderboard, setDisplayedLeaderboard] =
    useState(oldLeaderboard)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setDisplayedLeaderboard(oldLeaderboard)
    setIsAnimating(false)

    const timer = setTimeout(() => {
      setIsAnimating(true)
      setDisplayedLeaderboard(leaderboard)
    }, 1600)

    return () => {
      clearTimeout(timer)
    }
  }, [oldLeaderboard, leaderboard])

  return (
    <section className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-2">
      <h2 className="mb-6 text-6xl font-bold text-white drop-shadow-md">
        Leaderboard
      </h2>
      <div className="flex w-full flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {displayedLeaderboard.map(({ id, username, points, avatarId }) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 50,
                transition: { duration: 0.2 },
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                },
              }}
              className="bg-primary flex w-full items-center justify-between rounded-md p-3 text-2xl font-bold text-white"
            >
              <div className="flex flex-row items-center gap-4">
                <Avatar id={avatarId} className="h-16 w-16" />
                <span className="drop-shadow-md">{username}</span>
              </div>
              <div className="text-primary flex items-center rounded-md bg-white px-4 py-2">
                {isAnimating ? (
                  <AnimatedPoints
                    from={oldLeaderboard.find((u) => u.id === id)?.points || 0}
                    to={leaderboard.find((u) => u.id === id)?.points || 0}
                  />
                ) : (
                  <span className="drop-shadow-md">{points}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Leaderboard
