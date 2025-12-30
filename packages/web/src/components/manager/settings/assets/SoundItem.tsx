import { PlayArrow, Stop } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import Input from "@rahoot/web/components/Input"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

interface Props {
  label: string
  url: string
  onChange: (url: string) => void
}

const SoundItem = ({ label, url, onChange }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handlePlay = () => {
    if (!url) return

    // Stop currently playing if any (though logic handles one instance per component)
    handleStop()

    try {
      const audio = new Audio(url)
      audioRef.current = audio
      setIsPlaying(true)

      audio.play().catch(() => {
        toast.error("Failed to play sound")
        setIsPlaying(false)
      })

      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        toast.error("Invalid audio URL")
        setIsPlaying(false)
      }
    } catch {
      toast.error("Error creating audio")
    }
  }

  // Format label from camelCase to Title Case (e.g., "answersMusic" -> "Answers Music")
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {formattedLabel}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full"
          />
        </div>
        <Button
          onClick={isPlaying ? handleStop : handlePlay}
          className="aspect-square bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
          disabled={!url}
          title={isPlaying ? "Stop Sound" : "Preview Sound"}
        >
          {isPlaying ? <Stop /> : <PlayArrow />}
        </Button>
      </div>
    </div>
  )
}

export default SoundItem
