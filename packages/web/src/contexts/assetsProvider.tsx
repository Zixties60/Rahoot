"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export interface Avatar {
  url: string
  background: string
}

interface Sounds {
  waitingRoomMusic: string
  answersMusic: string
  answersSound: string
  resultsResult: string
  showSound: string
  boumpSound: string
  podiumThree: string
  podiumSecond: string
  podiumFirst: string
  snearRoll: string
}

interface AssetsData {
  avatars: Avatar[]
  sounds: Sounds
}

interface AssetsContextType {
  assets: AssetsData | null
  isLoading: boolean
  error: Error | null
  getAvatar: (index: number) => Avatar | undefined
  getSound: (key: keyof Sounds) => string | undefined
  reloadAssets: () => Promise<void>
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined)

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [assets, setAssets] = useState<AssetsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAssets = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/settings/assets")
      if (!response.ok) {
        throw new Error("Failed to fetch assets")
      }
      const data = await response.json()
      setAssets(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const getAvatar = (index: number) => {
    return assets?.avatars[index]
  }

  const getSound = (key: keyof Sounds) => {
    return assets?.sounds[key]
  }

  return (
    <AssetsContext.Provider
      value={{
        assets,
        isLoading,
        error,
        getAvatar,
        getSound,
        reloadAssets: fetchAssets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export const useAssets = () => {
  const context = useContext(AssetsContext)
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetsProvider")
  }
  return context
}
