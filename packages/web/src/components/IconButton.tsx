import clsx from "clsx"
import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large"
}

const IconButton = ({
  className,
  size = "medium",
  children,
  ...props
}: Props) => {
  const sizeClasses = {
    small: "p-1 text-sm",
    medium: "p-2",
    large: "p-3",
  }

  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
