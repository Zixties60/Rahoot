import { Save } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import { useState } from "react"
import toast from "react-hot-toast"

const SecuritySection = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!newPassword) {
      toast.error("Please enter a new password")
      return
    }

    try {
      const res = await fetch("/api/manager/settings/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerPassword: newPassword }),
      })

      if (res.ok) {
        toast.success("Security settings saved")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast.error("Failed to save security settings")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Security</h2>

      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          New Manager Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
          placeholder="Enter new password"
        />
      </div>

      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
          placeholder="Confirm new password"
        />
      </div>

      <Button onClick={handleSave} className="w-full" startIcon={<Save />}>
        Update Password
      </Button>
    </div>
  )
}

export default SecuritySection
