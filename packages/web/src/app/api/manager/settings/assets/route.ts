import {
  getAssetsConfigPath,
  readConfig,
  writeConfig,
} from "@rahoot/web/utils/config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const configPath = getAssetsConfigPath()
    const config = readConfig(configPath)
    return NextResponse.json(config)
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
    // Here we can add validation for assets structure if needed
    // For now, we trust the client (manager) to send valid structure

    const configPath = getAssetsConfigPath()
    // Overwrite the entire assets config with the new body
    // Assuming body is the full assets object { avatars: [], sounds: {} }
    writeConfig(configPath, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing config:", error)
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 },
    )
  }
}
