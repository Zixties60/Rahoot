import { StatusDataMap } from "@rahoot/common/types/game/status"
import { createStatus, Status } from "@rahoot/web/utils/createStatus"
import { create } from "zustand"

type PlayerState = {
  username?: string
  points?: number
  avatarId?: number
}

type PlayerStore<T> = {
  gameId: string | null
  background: string | null
  typeface: string | null
  theme: string | null
  playerEffect: boolean
  playerMusic: boolean
  player: PlayerState | null
  status: Status<T> | null

  setGameId: (_gameId: string | null) => void

  setPlayer: (_state: PlayerState) => void
  login: (_username: string, _avatarId: number) => void
  join: (_username: string) => void
  updatePoints: (_points: number) => void
  setBackground: (_background: string | null) => void
  setTypeface: (_typeface: string | null) => void
  setTheme: (_theme: string | null) => void
  setPlayerEffect: (_playerEffect: boolean) => void
  setPlayerMusic: (_playerMusic: boolean) => void

  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void

  reset: () => void
}

const initialState = {
  gameId: null,
  background: null,
  typeface: "itim",
  theme: "orange",
  playerEffect: true,
  playerMusic: true,
  player: null,
  status: null,
}

export const usePlayerStore = create<PlayerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),

  setPlayer: (player: PlayerState) => set({ player }),
  login: (username, avatarId) =>
    set((state) => ({
      player: { ...state.player, username, avatarId },
    })),

  join: (gameId) => {
    set((state) => ({
      gameId,
      player: { ...state.player, points: 0 },
    }))
  },

  updatePoints: (points) =>
    set((state) => ({
      player: { ...state.player, points },
    })),

  setBackground: (background) => set({ background }),
  setTypeface: (typeface) => set({ typeface }),
  setTheme: (theme) => set({ theme }),
  setPlayerEffect: (playerEffect) => set({ playerEffect }),
  setPlayerMusic: (playerMusic) => set({ playerMusic }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),

  reset: () => set(initialState),
}))
