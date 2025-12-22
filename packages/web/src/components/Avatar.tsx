import { AVATARS } from "@rahoot/web/utils/constants"
import clsx from "clsx"
import Image from "next/image"

type Props = {
  id: number
  className?: string
}

const Avatar = ({ id, className }: Props) => {
  const avatar = AVATARS[id]

  if (!avatar) {
    return null
  }

  return (
    <div
      className={clsx(
        "flex aspect-square items-center justify-center rounded-xl border-2 border-white/20 p-1 shadow-md",
        className,
      )}
      style={{
        backgroundColor: avatar.background,
      }}
    >
      <Image
        src={avatar.image}
        alt="Avatar"
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export default Avatar
