import clsx from "clsx"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    startIcon?: React.ReactNode
  }

const Button = ({ children, className, startIcon, ...otherProps }: Props) => (
  <button
    className={clsx(
      "btn-shadow bg-primary flex items-center justify-center gap-2 rounded-md p-2 text-lg font-semibold text-white",
      className,
    )}
    {...otherProps}
  >
    {startIcon && <span>{startIcon}</span>}
    {children && <span>{children}</span>}
  </button>
)

export default Button
