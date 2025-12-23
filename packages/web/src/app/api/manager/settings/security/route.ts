import {
  getGameConfigPath,
  readConfig,
  writeConfig,
} from "@rahoot/web/utils/config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const configPath = getGameConfigPath()
    const config = readConfig(configPath)
    return NextResponse.json({ managerPassword: config.managerPassword || "" })
  } catch (error) {
    console.error("Error reading config:", error)
    return NextResponse.json(
      { error: "Failed to read configuration" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { managerPassword } = body

    if (managerPassword !== undefined && typeof managerPassword !== "string") {
      return NextResponse.json(
        { error: "Invalid password format" },
        { status: 400 },
      )
    }

    const configPath = getGameConfigPath()
    const currentConfig = readConfig(configPath)

    const newConfig = {
      ...currentConfig,
      managerPassword,
    }

    writeConfig(configPath, newConfig)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing config:", error)
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 },
    )
  }
}
