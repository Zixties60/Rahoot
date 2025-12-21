import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

const getConfigPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "game.json")
    : path.resolve(process.cwd(), "../../config/game.json")
}

export async function GET() {
  try {
    const configPath = getConfigPath()
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ managerPassword: "" })
    }
    const fileContent = fs.readFileSync(configPath, "utf-8")
    const config = JSON.parse(fileContent)
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
    const { managerPassword, music, background } = body

    if (managerPassword && typeof managerPassword !== "string") {
      return NextResponse.json(
        { error: "Invalid password format" },
        { status: 400 },
      )
    }

    if (music !== undefined && typeof music !== "boolean") {
      return NextResponse.json(
        { error: "Invalid music format" },
        { status: 400 },
      )
    }

    if (background !== undefined && typeof background !== "string") {
      return NextResponse.json(
        { error: "Invalid background format" },
        { status: 400 },
      )
    }

    const configPath = getConfigPath()
    const currentConfig = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, "utf8"))
      : {}

    const newConfig = {
      ...currentConfig,
    }

    if (managerPassword) {
      newConfig.managerPassword = managerPassword
    }

    if (music !== undefined) {
      newConfig.music = music
    }

    if (background !== undefined) {
      newConfig.background = background
    }

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing config:", error)
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 },
    )
  }
}
