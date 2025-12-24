"use client"

import { ManagerStatusDataMap, STATUS } from "@rahoot/common/types/game/status"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const TEST_MANAGER_CONFIG_KEY = "rahoot:test_manager_config"

const DEFAULT_DATA: Partial<ManagerStatusDataMap> = {
  SHOW_ROOM: { text: "Join now!", inviteCode: "123456" },
  SHOW_START: { time: 5, subject: "General Knowledge" },
  SHOW_PREPARED: { totalAnswers: 4, questionNumber: 1 },
  SHOW_QUESTION: {
    question: "What is the capital of France?",
    image: "",
    cooldown: 5,
  },
  SHOW_RESPONSES: {
    question: "What is the capital of France?",
    responses: { 0: 2, 1: 5, 2: 1, 3: 0 },
    correct: 0,
    answers: ["Paris", "London", "Berlin", "Madrid"],
    image: "",
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
    oldLeaderboard: [
      {
        username: "Player 1",
        points: 900,
        avatarId: 0,
        id: "1",
        clientId: "mock-client-1",
        connected: true,
      },
    ],
    leaderboard: [
      {
        username: "Player 1",
        points: 1000,
        avatarId: 0,
        id: "1",
        clientId: "mock-client-1",
        connected: true,
      },
      {
        username: "Player 2",
        points: 800,
        avatarId: 1,
        id: "2",
        clientId: "mock-client-2",
        connected: true,
      },
    ],
  },
  FINISHED: {
    subject: "General Knowledge",
    top: [],
  },
  GAME_FINISHED: {
    subject: "General Knowledge",
    top: [],
  },
}

export default function ManagerTestPage() {
  const router = useRouter()
  const { setStatus, setGameId, setTypeface, setBackground, setTheme } =
    useManagerStore()

  const [selectedStatus, setSelectedStatus] = useState<keyof typeof STATUS>(
    STATUS.SHOW_ROOM,
  )
  const [statusData, setStatusData] = useState<any>(DEFAULT_DATA.SHOW_ROOM)
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(DEFAULT_DATA.SHOW_ROOM, null, 2),
  )

  const [typeface, setTypefaceInput] = useState("itim")
  const [background, setBackgroundInput] = useState("")
  const [theme, setThemeInput] = useState("orange")
  const [image, setImage] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem(TEST_MANAGER_CONFIG_KEY)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setTypefaceInput(parsed.typeface || "itim")
        setBackgroundInput(parsed.background || "")
        setThemeInput(parsed.theme || "orange")
        setImage(parsed.image || "")
        setSelectedStatus(parsed.selectedStatus || STATUS.SHOW_ROOM)

        const loadedStatusData = parsed.statusData || DEFAULT_DATA.SHOW_ROOM
        setStatusData(loadedStatusData)
        setJsonInput(JSON.stringify(loadedStatusData, null, 2))
      } catch (e) {
        console.error("Failed to load saved config", e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const config = {
      typeface,
      background,
      theme,
      image,
      selectedStatus,
      statusData,
    }
    localStorage.setItem(TEST_MANAGER_CONFIG_KEY, JSON.stringify(config))
  }, [isLoaded, typeface, background, theme, image, selectedStatus, statusData])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as keyof ManagerStatusDataMap
    setSelectedStatus(newStatus)

    // Default image if available for the new status
    const newData = DEFAULT_DATA[newStatus] || {}
    setStatusData(newData)
    setJsonInput(JSON.stringify(newData, null, 2))
    setImage((newData as any)?.image || "")
  }

  const handleApply = () => {
    setGameId("testgame")
    setTypeface(typeface)
    setBackground(background)

    // Ensure we send valid strings for theme/typeface if they are null in store logic,
    // but here we have defaults.
    setTheme(theme)

    const FinalStatusData = { ...statusData }

    // Inject image override if applicable for current key
    // We check if 'image' property exists in the type implicitly by logic or loosely
    if (
      image &&
      (selectedStatus === "SHOW_QUESTION" ||
        selectedStatus === "SHOW_RESPONSES")
    ) {
      FinalStatusData.image = image
    }

    // We cast statusData because the UI inputs might be loose, but we trust the user for testing
    setStatus(selectedStatus as any, FinalStatusData)

    // Navigate to the game page
    router.push("/game/manager/testgame")
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-sans text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
            Manager Control Panel
          </h1>
          <p className="mt-2 text-gray-400">
            Mock manager states and simulate game flows.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* General Configuration */}
          <section className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-blue-400">
              General Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Game ID
                </label>
                <input
                  type="text"
                  value="testgame"
                  disabled
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-gray-400 transition-all outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setThemeInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="orange">Orange</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Typeface
                </label>
                <select
                  value={typeface}
                  onChange={(e) => setTypefaceInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="itim">Itim</option>
                  <option value="kanit">Kanit</option>
                  <option value="pridi">Pridi</option>
                  <option value="mali">Mali</option>
                  <option value="sarabun">Sarabun</option>
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
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              {(selectedStatus === "SHOW_QUESTION" ||
                selectedStatus === "SHOW_RESPONSES") && (
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
                  value={jsonInput}
                  onChange={(e) => {
                    const val = e.target.value
                    setJsonInput(val)
                    try {
                      setStatusData(JSON.parse(val))
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
