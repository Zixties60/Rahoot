import { QuizzWithId } from "@rahoot/common/types/game"
import { auth } from "@rahoot/web/auth"
import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

const getQuizzPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "quizz")
    : path.resolve(process.cwd(), "../../config/quizz")
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const quizzPath = getQuizzPath()
    if (!fs.existsSync(quizzPath)) {
      return NextResponse.json([])
    }

    const files = fs
      .readdirSync(quizzPath)
      .filter((file) => file.endsWith(".json"))
    const quizzes: QuizzWithId[] = files.map((file) => {
      const filePath = path.join(quizzPath, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const quizz = JSON.parse(content)
      return { ...quizz, id: file.replace(".json", "") }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Error reading quizzes:", error)
    return NextResponse.json(
      { error: "Failed to read quizzes" },
      { status: 500 },
    )
  }
}
