import { Save } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const SecuritySection = () => {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/manager/settings/security")
      .then((res) => res.json())
      .then((data) => {
        if (data.managerPassword) {
          setPassword(data.managerPassword)
        }
      })
      .catch(() => toast.error("Failed to load security settings"))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      const res = await fetch("/api/manager/settings/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerPassword: password }),
      })

      if (res.ok) {
        toast.success("Security settings saved")
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast.error("Failed to save security settings")
    }
  }

  if (loading) return <div className="p-4">Loading security...</div>

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Security</h2>
      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Manager Password
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
          placeholder="Enter password"
        />
      </div>
      <Button onClick={handleSave} className="w-full" startIcon={<Save />}>
        Save Security
      </Button>
    </div>
  )
}

export default SecuritySection
