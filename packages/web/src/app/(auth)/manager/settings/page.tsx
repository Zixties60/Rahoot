"use client"

import { Cancel, Save } from "@mui/icons-material"

import Button from "@rahoot/web/components/Button"
import FontSelect from "@rahoot/web/components/manager/settings/FontSelect"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Settings = () => {
  const router = useRouter()
  const { socket } = useSocket()
  const { gameId } = useManagerStore()
  const [password, setPassword] = useState("")
  const [playerEffect, setPlayerEffect] = useState(true)
  const [playerMusic, setPlayerMusic] = useState(true)
  const [managerEffect, setManagerEffect] = useState(true)
  const [managerMusic, setManagerMusic] = useState(true)
  const [background, setBackground] = useState("")
  const [typeface, setTypeface] = useState("")
  const [theme, setTheme] = useState("yellow-orange")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/manager/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.managerPassword) {
          setPassword(data.managerPassword)
        }
        if (data.playerEffect !== undefined) {
          setPlayerEffect(data.playerEffect)
        }
        if (data.playerMusic !== undefined) {
          setPlayerMusic(data.playerMusic)
        }
        if (data.managerEffect !== undefined) {
          setManagerEffect(data.managerEffect)
        }
        if (data.managerMusic !== undefined) {
          setManagerMusic(data.managerMusic)
        }
        if (data.background) {
          setBackground(data.background)
        }
        if (data.typeface) {
          setTypeface(data.typeface)
        }
        if (data.theme) {
          setTheme(data.theme)
        }
      })
      .catch(() => {
        toast.error("Failed to load settings")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (theme) {
      const themeConfig = THEME_CONFIG[theme]
      if (themeConfig) {
        document.documentElement.style.setProperty(
          "--color-primary",
          themeConfig.primary,
        )
      }
    }
  }, [theme])

  const handleSave = async () => {
    try {
      const res = await fetch("/api/manager/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerPassword: password,
          playerEffect,
          playerMusic,
          managerEffect,
          managerMusic,
          background,
          typeface,
          theme,
        }),
      })

      if (res.ok) {
        if (gameId) {
          socket?.emit("manager:reloadConfig", { gameId })
        }
        toast.success("Settings saved")
        router.back()
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast.error("Failed to save settings")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Manager Password
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
            placeholder="Enter password"
          />
        </div>

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Background URL (Optional)
          </label>
          <input
            type="text"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
            placeholder="https://example.com/image.png"
          />
        </div>

        <div className="w-full">
          <FontSelect
            label="Game Typeface"
            value={typeface}
            onChange={setTypeface}
          />
        </div>

        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Color Theme
          </label>
          <div className="flex gap-2">
            {Object.keys(THEME_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`h-8 w-8 rounded-full border-2 ${
                  theme === key ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: THEME_CONFIG[key].primary }}
                title={key}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800">Player Audio</h2>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Sound Effects
            </span>
            <button
              onClick={() => setPlayerEffect(!playerEffect)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                playerEffect ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  playerEffect ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Music</span>
            <button
              onClick={() => setPlayerMusic(!playerMusic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                playerMusic ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  playerMusic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <h2 className="text-lg font-bold text-gray-800">Manager Audio</h2>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Sound Effects
            </span>
            <button
              onClick={() => setManagerEffect(!managerEffect)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                managerEffect ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  managerEffect ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Music</span>
            <button
              onClick={() => setManagerMusic(!managerMusic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                managerMusic ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  managerMusic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => router.back()}
          className="w-full bg-gray-500"
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className="w-full" startIcon={<Save />}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default Settings
