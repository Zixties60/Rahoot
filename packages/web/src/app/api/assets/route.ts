import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

const getConfigPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "assets.json")
    : path.resolve(process.cwd(), "../../config/assets.json")
}

export async function GET() {
  try {
    const configPath = getConfigPath()
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({})
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
