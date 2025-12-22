import { Quizz } from "@rahoot/common/types/game"
import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const getQuizzPath = () => {
  const inContainerPath = process.env.CONFIG_PATH
  return inContainerPath
    ? path.resolve(inContainerPath, "quizz")
    : path.resolve(process.cwd(), "../../config/quizz")
}

export async function POST(request: Request) {
  try {
    const body: Quizz = await request.json()
    console.log("Create Quiz Body:", JSON.stringify(body, null, 2))
    const { subject, questions } = body

    if (!subject || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid quiz format" },
        { status: 400 },
      )
    }

    const quizzPath = getQuizzPath()
    if (!fs.existsSync(quizzPath)) {
      fs.mkdirSync(quizzPath, { recursive: true })
    }

    const id = uuidv4()
    const filePath = path.join(quizzPath, `${id}.json`)

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 },
    )
  }
}
