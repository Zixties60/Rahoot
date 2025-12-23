import { useAssets } from "@rahoot/web/contexts/assetsProvider"
import clsx from "clsx"
import Image from "next/image"

type Props = {
  id?: number
  url?: string
  background?: string
  className?: string
}

const Avatar = ({ id, url, background, className }: Props) => {
  const { getAvatar } = useAssets()

  let avatarUrl = url
  let avatarBg = background

  if (id !== undefined && (!avatarUrl || !avatarBg)) {
    const asset = getAvatar(id) // id here is treated as index
    if (asset) {
      avatarUrl = asset.url
      avatarBg = asset.background
    }
  }

  if (!avatarUrl || !avatarBg) {
    return null
  }

  return (
    <div
      className={clsx(
        "flex aspect-square items-center justify-center rounded-xl border-2 border-gray-300 p-1 shadow-md",
        className,
      )}
      style={{
        backgroundColor: avatarBg,
      }}
    >
      <Image
        src={avatarUrl}
        alt="Avatar"
        className="h-full w-full object-contain"
        width={100}
        height={100}
      />
    </div>
  )
}

export default Avatar
