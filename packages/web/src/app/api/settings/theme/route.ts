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
    return NextResponse.json({
      background: config.background || "",
      typeface: config.typeface || "",
      theme: config.theme || "yellow-orange",
      playerEffect: config.playerEffect ?? true,
      playerMusic: config.playerMusic ?? true,
      managerEffect: config.managerEffect ?? true,
      managerMusic: config.managerMusic ?? true,
    })
  } catch (error) {
    console.error("Error reading config:", error)
    return NextResponse.json(
      { error: "Failed to read configuration" },
      { status: 500 },
    )
  }
}
