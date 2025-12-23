import { getAssetsConfigPath, readConfig } from "@rahoot/web/utils/config"
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
