import { PropsWithChildren } from "react"

import clsx from "clsx"

type Props = PropsWithChildren & {
  className?: string
}

const Form = ({ children, className }: Props) => (
  <div
    className={clsx(
      "z-10 flex w-full max-w-80 flex-col gap-4 rounded-md bg-white p-4 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
)

export default Form
