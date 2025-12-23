import { Save } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import FontSelect from "@rahoot/web/components/manager/settings/FontSelect"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { THEME_CONFIG } from "@rahoot/web/utils/constants"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const ThemeSection = () => {
  const { socket } = useSocket()
  const { gameId } = useManagerStore()
  const [background, setBackground] = useState("")
  const [typeface, setTypeface] = useState("")
  const [theme, setTheme] = useState("yellow-orange")
  const [playerEffect, setPlayerEffect] = useState(true)
  const [playerMusic, setPlayerMusic] = useState(true)
  const [managerEffect, setManagerEffect] = useState(true)
  const [managerMusic, setManagerMusic] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/manager/settings/theme")
      .then((res) => res.json())
      .then((data) => {
        if (data.background) setBackground(data.background)
        if (data.typeface) setTypeface(data.typeface)
        if (data.theme) setTheme(data.theme)
        if (data.playerEffect !== undefined) setPlayerEffect(data.playerEffect)
        if (data.playerMusic !== undefined) setPlayerMusic(data.playerMusic)
        if (data.managerEffect !== undefined)
          setManagerEffect(data.managerEffect)
        if (data.managerMusic !== undefined) setManagerMusic(data.managerMusic)
      })
      .catch(() => toast.error("Failed to load theme settings"))
      .finally(() => setLoading(false))
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
      const res = await fetch("/api/manager/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background,
          typeface,
          theme,
          playerEffect,
          playerMusic,
          managerEffect,
          managerMusic,
        }),
      })

      if (res.ok) {
        if (gameId) {
          socket?.emit("manager:reloadConfig", { gameId })
        }
        toast.success("Theme settings saved")
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast.error("Failed to save theme settings")
    }
  }

  if (loading) return <div className="p-4">Loading theme...</div>

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Theme & Audio</h2>

      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Background URL (Optional)
        </label>
        <input
          type="text"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
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

      <div className="flex w-full flex-col gap-4 border-t pt-4">
        <h3 className="text-lg font-bold text-gray-800">Player Audio</h3>
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Sound Effects
          </span>
          <button
            onClick={() => setPlayerEffect(!playerEffect)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              playerEffect ? "bg-blue-600" : "bg-gray-200"
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
              playerMusic ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                playerMusic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-800">Manager Audio</h3>
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Sound Effects
          </span>
          <button
            onClick={() => setManagerEffect(!managerEffect)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              managerEffect ? "bg-blue-600" : "bg-gray-200"
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
              managerMusic ? "bg-blue-600" : "bg-gray-200"
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

      <Button onClick={handleSave} className="w-full" startIcon={<Save />}>
        Save Theme
      </Button>
    </div>
  )
}

export default ThemeSection
