"use client"

import { Cancel, Clear, Logout } from "@mui/icons-material"
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
        <div className="flex items-center gap-4">
          <Button
            className="bg-red-500 shadow-md"
            onClick={() => signOut({ callbackUrl: "/manager/login" })}
            startIcon={<Logout />}
          >
            Logout
          </Button>
          <Button
            onClick={() => router.back()}
            className="w-full"
            startIcon={<Clear />}
          />
        </div>
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
      <div className="flex w-full items-center gap-4">
        <Button
          onClick={() => router.back()}
          className="w-full"
          startIcon={<Clear />}
        >
          Close
        </Button>
      </div>
    </div>
  )
}

export default Settings
