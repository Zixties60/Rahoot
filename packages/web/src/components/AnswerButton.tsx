import clsx from "clsx"
import { motion } from "motion/react"
import { ElementType, ReactNode } from "react"

type Props = {
  className?: string
  icon: ElementType
  children: ReactNode
  onClick?: () => void
}

const AnswerButton = ({ className, icon: Icon, children, onClick }: Props) => (
  <motion.button
    initial={{ scale: 1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "shadow-inset flex items-center gap-3 rounded px-4 py-6 text-left",
      className,
    )}
  >
    <Icon className="h-6 w-6 md:h-10 md:w-10" />
    <span className="drop-shadow-md">{children}</span>
  </motion.button>
)

export default AnswerButton
