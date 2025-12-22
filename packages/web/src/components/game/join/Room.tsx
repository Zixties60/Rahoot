import { Login } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react"

interface Props {
  pin?: string
}

const Room = ({ pin }: Props) => {
  const { socket } = useSocket()
  const { join } = usePlayerStore()
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array(6).fill("")
    if (pin) {
      const chars = pin.slice(0, 6).split("")
      chars.forEach((c, i) => (arr[i] = c))
    }
    return arr
  })
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleJoin = () => {
    const invitation = digits.join("")
    socket?.emit("player:join", invitation)
  }

  useEffect(() => {
    if (pin) {
      handleJoin()
    }
  }, [pin])

  const handleChange = (index: number, val: string) => {
    const value = val.slice(-1)
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const text = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
    const newDigits = [...digits]
    text.split("").forEach((char, i) => {
      if (i < 6) newDigits[i] = char
    })
    setDigits(newDigits)
    if (text.length > 0) {
      const nextFocusIndex = Math.min(text.length, 5)
      inputRefs.current[nextFocusIndex]?.focus()
    }
  }

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  return (
    <Form>
      <div className="flex justify-between gap-1">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-12 w-10 p-0 text-center text-xl"
            placeholder=""
            maxLength={1}
            inputMode="numeric"
          />
        ))}
      </div>
      <Button onClick={handleJoin} startIcon={<Login />}>
        Join Room
      </Button>
    </Form>
  )
}

export default Room
