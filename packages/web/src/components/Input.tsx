import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...otherProps }, ref) => (
    <input
      ref={ref}
      type={type}
      className={clsx(
        "rounded-sm p-2 text-lg font-semibold outline-2 outline-gray-300",
        className,
      )}
      {...otherProps}
    />
  ),
)

Input.displayName = "Input"

export default Input
