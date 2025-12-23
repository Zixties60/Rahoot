"use client"

import { Lock } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const ManagerLoginPage = () => {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/manager"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        password,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        toast.error("Invalid password")
        setLoading(false)
      } else {
        toast.success("Login successful")
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error("An error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg bg-white p-8 shadow-xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Manager Access</h1>
        <p className="text-sm text-gray-500">
          Please enter the password to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 pl-10 outline-none focus:border-blue-500"
              placeholder="Enter password"
              autoFocus
            />
            <Lock
              className="absolute top-2.5 left-3 text-gray-400"
              sx={{ fontSize: 20 }}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full justify-center"
          disabled={loading || !password}
        >
          {loading ? "Verifying..." : "Login"}
        </Button>
      </form>
    </div>
  )
}

export default ManagerLoginPage
