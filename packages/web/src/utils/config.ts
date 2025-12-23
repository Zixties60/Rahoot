import fs from "fs"
import path from "path"

export const getGameConfigPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "game.json")
    : path.resolve(process.cwd(), "../../config/game.json")
}

export const getAssetsConfigPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "assets.json")
    : path.resolve(process.cwd(), "../../config/assets.json")
}

export const readConfig = (configPath: string) => {
  if (!fs.existsSync(configPath)) {
    return {}
  }
  const fileContent = fs.readFileSync(configPath, "utf-8")
  return JSON.parse(fileContent)
}

export const writeConfig = (configPath: string, newConfig: any) => {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))
}
