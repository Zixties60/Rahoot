"use client"

import { Cancel, Logout } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import AssetsSection from "@rahoot/web/components/manager/settings/AssetsSection"
import SecuritySection from "@rahoot/web/components/manager/settings/SecuritySection"
import ThemeSection from "@rahoot/web/components/manager/settings/ThemeSection"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const Settings = () => {
  const router = useRouter()

  return (
    <div className="z-10 mb-16 flex w-full max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <Button
          onClick={() => router.back()}
          className="bg-gray-500 shadow-md"
          startIcon={<Cancel />}
        >
          Close
        </Button>
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm">
        <SecuritySection />
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm">
        <ThemeSection />
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm">
        <AssetsSection />
      </div>

      <Button
        className="w-full bg-red-500 shadow-md hover:bg-red-600"
        onClick={() => signOut({ callbackUrl: "/manager/login" })}
        startIcon={<Logout />}
      >
        Logout
      </Button>
    </div>
  )
}

export default Settings
