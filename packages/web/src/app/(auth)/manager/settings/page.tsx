"use client"

import { Cancel, Save } from "@mui/icons-material"

import Button from "@rahoot/web/components/Button"
import FontSelect from "@rahoot/web/components/manager/settings/FontSelect"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Settings = () => {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [music, setMusic] = useState(false)
  const [background, setBackground] = useState("")
  const [typeface, setTypeface] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/manager/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.managerPassword) {
          setPassword(data.managerPassword)
        }
        if (data.music !== undefined) {
          setMusic(data.music)
        }
        if (data.background) {
          setBackground(data.background)
        }
        if (data.typeface) {
          setTypeface(data.typeface)
        }
      })
      .catch(() => {
        toast.error("Failed to load settings")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    try {
      const res = await fetch("/api/manager/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          managerPassword: password,
          music,
          background,
          typeface,
        }),
      })

      if (res.ok) {
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

        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Enable Music
          </span>
          <button
            onClick={() => setMusic(!music)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              music ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                music ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
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
