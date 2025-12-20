import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { KeyboardEvent, useEffect, useState } from "react"

interface Props {
  pin?: string
}

const Room = ({ pin }: Props) => {
  const { socket } = useSocket()
  const { join } = usePlayerStore()
  const [invitation, setInvitation] = useState(pin ?? "")

  const handleJoin = () => {
    socket?.emit("player:join", invitation)
  }

  useEffect(() => {
    if (pin) {
      handleJoin()
    }
  }, [pin, handleJoin])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setInvitation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
      />
      <Button onClick={handleJoin}>Submit</Button>
    </Form>
  )
}

export default Room
