import { Player } from "@rahoot/common/types/game"
import { StatusDataMap } from "@rahoot/common/types/game/status"
import { createStatus, Status } from "@rahoot/web/utils/createStatus"
import { create } from "zustand"

type ManagerStore<T> = {
  gameId: string | null
  background: string | null
  typeface: string | null
  theme: string | null
  status: Status<T> | null
  players: Player[]

  setGameId: (_gameId: string | null) => void
  setBackground: (_background: string | null) => void
  setTypeface: (_typeface: string | null) => void
  setTheme: (_theme: string | null) => void
  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void
  resetStatus: () => void
  setPlayers: (_players: Player[]) => void

  reset: () => void
}

const initialState = {
  gameId: null,
  background: null,
  typeface: "playpen-sans",
  theme: "yellow-orange",
  status: null,
  players: [],
}

export const useManagerStore = create<ManagerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),
  setBackground: (background) => set({ background }),
  setTypeface: (typeface) => set({ typeface }),
  setTheme: (theme) => set({ theme }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: null }),

  setPlayers: (players) => set({ players }),

  reset: () => set(initialState),
}))
