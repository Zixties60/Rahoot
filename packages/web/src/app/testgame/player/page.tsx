"use client"

import { PlayerStatusDataMap, STATUS } from "@rahoot/common/types/game/status"
import Avatar from "@rahoot/web/components/Avatar"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const TEST_PLAYER_CONFIG_KEY = "rahoot:test_player_config"

const DEFAULT_DATA: Partial<PlayerStatusDataMap> = {
  WAIT: { text: "Waiting for game to start..." },
  SHOW_START: { time: 5, subject: "General Knowledge" },
  SHOW_PREPARED: { totalAnswers: 4, questionNumber: 1 },
  SHOW_QUESTION: {
    question: "What is the capital of France?",
    image: "",
    cooldown: 5,
  },
  SELECT_ANSWER: {
    question: "What is the capital of France?",
    answers: ["Paris", "London", "Berlin", "Madrid"],
    image: "",
    time: 20,
    totalPlayer: 10,
  },
  SHOW_RESULT: {
    correct: true,
    message: "Correct!",
    points: 100,
    myPoints: 1000,
    rank: 1,
    aheadOfMe: null,
  },
  SHOW_LEADERBOARD: {
    subject: "General Knowledge",
    myRank: 1,
    myPoints: 1000,
    aheadOfMe: null,
  },
  FINISHED: {
    subject: "General Knowledge",
    myPoints: 1000,
  },
  GAME_FINISHED: {
    subject: "General Knowledge",
    top: [],
    myRank: 15,
    myPoints: 1000,
  },
}

import { useAssets } from "@rahoot/web/contexts/assetsProvider"

// ... existing code ...

export default function PlayerTestPage() {
  const router = useRouter()
  const { assets } = useAssets()
  const { setPlayer, setStatus, setGameId, setTypeface, setBackground } =
    usePlayerStore()

  const [selectedStatus, setSelectedStatus] = useState<keyof typeof STATUS>(
    STATUS.WAIT,
  )
  const [statusData, setStatusData] = useState<any>(DEFAULT_DATA.WAIT)
  const [username, setUsername] = useState("MockPlayer")
  const [points, setPoints] = useState(0)
  const [avatarId, setAvatarId] = useState(0)
  const [typeface, setTypefaceInput] = useState("itim")
  const [background, setBackgroundInput] = useState("")
  const [image, setImage] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem(TEST_PLAYER_CONFIG_KEY)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setUsername(parsed.username || "MockPlayer")
        setPoints(parsed.points || 0)
        setAvatarId(parsed.avatarId || 0)
        setTypefaceInput(parsed.typeface || "itim")
        setBackgroundInput(parsed.background || "")
        setImage(parsed.image || "")
        setSelectedStatus(parsed.selectedStatus || STATUS.WAIT)
        setStatusData(parsed.statusData || DEFAULT_DATA.WAIT)
      } catch (e) {
        console.error("Failed to load saved config", e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const config = {
      username,
      points,
      avatarId,
      typeface,
      background,
      image,
      selectedStatus,
      statusData,
    }
    localStorage.setItem(TEST_PLAYER_CONFIG_KEY, JSON.stringify(config))
  }, [
    isLoaded,
    username,
    points,
    avatarId,
    typeface,
    background,
    image,
    selectedStatus,
    statusData,
  ])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as keyof PlayerStatusDataMap
    setSelectedStatus(newStatus)
    setStatusData(DEFAULT_DATA[newStatus] || {})
    setImage((DEFAULT_DATA[newStatus] as any)?.image || "")
  }

  const handleApply = () => {
    setGameId("testgame")
    setPlayer({ username, points, avatarId })
    setTypeface(typeface)
    setBackground(background)

    const FinalStatusData = { ...statusData }
    if (image && "image" in FinalStatusData) {
      FinalStatusData.image = image
    }

    // We cast statusData because the UI inputs might be loose, but we trust the user for testing
    setStatus(selectedStatus as any, FinalStatusData)

    // Navigate to the game page
    router.push("/game/testgame")
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-sans text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
            Player Control Panel
          </h1>
          <p className="mt-2 text-gray-400">
            Mock player states and simulate game flows.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Player Configuration */}
          <section className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-blue-400">
              Player Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Points
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Avatar ID
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {assets?.avatars.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setAvatarId(index)}
                      className={`relative rounded-xl border-2 p-1 transition-all ${
                        avatarId === index
                          ? "scale-105 border-blue-500 bg-blue-500/20"
                          : "border-gray-600 bg-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <Avatar id={index} className="h-12 w-12" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Status Configuration */}
          <section className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-purple-400">
              Status Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Game Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(DEFAULT_DATA).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Background (URL)
                </label>
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackgroundInput(e.target.value)}
                  placeholder="https://example.com/bg.jpg"
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Typeface
                </label>
                <select
                  value={typeface}
                  onChange={(e) => setTypefaceInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="itim">Itim</option>
                  <option value="kanit">Kanit</option>
                  <option value="pridi">Pridi</option>
                  <option value="mali">Mali</option>
                  <option value="sarabun">Sarabun</option>
                </select>
              </div>

              {(selectedStatus === "SHOW_QUESTION" ||
                selectedStatus === "SELECT_ANSWER") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">
                    Image (URL)
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Status Data (JSON)
                </label>
                <textarea
                  value={JSON.stringify(statusData, null, 2)}
                  onChange={(e) => {
                    try {
                      setStatusData(JSON.parse(e.target.value))
                    } catch (err) {
                      // Allow typing invalid JSON until it's valid
                    }
                  }}
                  className="h-64 w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-mono text-sm text-white transition-all outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Edit the JSON to customize the state data.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleApply}
            className="transform rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
          >
            🚀 Launch Mock Game
          </button>
        </div>
      </div>
    </div>
  )
}
