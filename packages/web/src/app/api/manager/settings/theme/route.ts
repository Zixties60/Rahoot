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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      background,
      typeface,
      theme,
      playerEffect,
      playerMusic,
      managerEffect,
      managerMusic,
    } = body

    if (
      (playerEffect !== undefined && typeof playerEffect !== "boolean") ||
      (playerMusic !== undefined && typeof playerMusic !== "boolean") ||
      (managerEffect !== undefined && typeof managerEffect !== "boolean") ||
      (managerMusic !== undefined && typeof managerMusic !== "boolean")
    ) {
      return NextResponse.json(
        { error: "Invalid sound setting format" },
        { status: 400 },
      )
    }

    if (background !== undefined && typeof background !== "string") {
      return NextResponse.json(
        { error: "Invalid background format" },
        { status: 400 },
      )
    }

    if (typeface !== undefined && typeof typeface !== "string") {
      return NextResponse.json(
        { error: "Invalid typeface format" },
        { status: 400 },
      )
    }

    if (theme !== undefined && typeof theme !== "string") {
      return NextResponse.json(
        { error: "Invalid theme format" },
        { status: 400 },
      )
    }

    const configPath = getGameConfigPath()
    const currentConfig = readConfig(configPath)

    const newConfig = {
      ...currentConfig,
    }

    if (background !== undefined) newConfig.background = background
    if (typeface !== undefined) newConfig.typeface = typeface
    if (theme !== undefined) newConfig.theme = theme
    if (playerEffect !== undefined) newConfig.playerEffect = playerEffect
    if (playerMusic !== undefined) newConfig.playerMusic = playerMusic
    if (managerEffect !== undefined) newConfig.managerEffect = managerEffect
    if (managerMusic !== undefined) newConfig.managerMusic = managerMusic

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
