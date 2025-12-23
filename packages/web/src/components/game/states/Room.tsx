"use client"

import Avatar from "@rahoot/web/components/Avatar"

import { Player } from "@rahoot/common/types/game"
import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import useSound from "use-sound"
import { useAssets } from "@rahoot/web/contexts/assetsProvider"

type Props = {
  data: ManagerStatusDataMap["SHOW_ROOM"]
  musicEnabled: boolean
}

const Room = ({ data: { text, inviteCode }, musicEnabled }: Props) => {
  const { gameId } = useManagerStore()
  const { socket } = useSocket()
  const { players } = useManagerStore()
  const [playerList, setPlayerList] = useState<Player[]>(players)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [hideRoomId, setHideRoomId] = useState<Boolean>(true)

  const { getSound } = useAssets()

  const [playMusic, { stop: stopMusic }] = useSound(
    getSound("waitingRoomMusic") || "",
    {
      volume: 0.2,
      interrupt: true,
      loop: true,
      html5: true,
    },
  )

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const joinUrl = `${origin}?pin=${inviteCode}`

  useEffect(() => {
    if (musicEnabled) {
      playMusic()
    } else {
      stopMusic()
    }

    return () => {
      stopMusic()
    }
  }, [playMusic, musicEnabled, stopMusic])

  useEvent("manager:newPlayer", (player) => {
    setPlayerList([...playerList, player])
  })

  useEvent("manager:removePlayer", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("manager:playerKicked", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("game:totalPlayers", (total) => {
    setTotalPlayers(total)
  })

  const handleKick = (playerId: string) => () => {
    if (!gameId) {
      return
    }

    if (!confirm("Are you sure you want to kick this player?")) {
      return
    }

    socket?.emit("manager:kickPlayer", {
      gameId,
      playerId,
    })
  }

  const handleHide = () => {
    setHideRoomId((prev) => !prev)
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-2">
      <div
        className="flex w-fit cursor-pointer flex-row items-center justify-center gap-10"
        onClick={handleHide}
      >
        <div className="mb-10 rounded-md bg-white p-4 shadow-lg">
          <QRCode value={joinUrl} level="H" size={384} />
        </div>

        {!hideRoomId ? (
          <div className="mb-10 rotate-3 rounded-md bg-white px-6 py-4 text-6xl font-extrabold">
            {inviteCode}
          </div>
        ) : null}
      </div>

      <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>

      <div className="mb-6 flex items-center justify-center rounded-full bg-black/40 px-6 py-3">
        <span className="text-2xl font-bold text-white drop-shadow-md">
          Players Joined: {totalPlayers}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player, index) => (
          <div
            key={player.id}
            className={`shadow-inset flex flex-row items-center gap-2 rounded-md px-4 py-3 font-bold ${index % 2 === 0 ? "bg-primary text-onPrimary" : "bg-secondary text-onSecondary"} `}
            onClick={handleKick(player.id)}
          >
            <Avatar id={player.avatarId} className="h-8 w-8" />
            <span className="cursor-pointer text-xl drop-shadow-md hover:line-through">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Room
