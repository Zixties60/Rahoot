import { Quizz } from "@rahoot/common/types/game"
import fs from "fs" // eslint-disable-line no-restricted-imports
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const getConfigPath = () => {
  return process.env.CONFIG_PATH || path.join(process.cwd(), "../../config")
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const filePath = path.join(getConfigPath(), "quizz", `${id}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const quizz = JSON.parse(fileContent)

    return NextResponse.json(quizz)
  } catch (error) {
    console.error("Failed to read quiz:", error)
    return NextResponse.json({ error: "Failed to read quiz" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { subject, questions, background } = body as Quizz

    if (!subject || !questions) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 })
    }

    const filePath = path.join(getConfigPath(), "quizz", `${id}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const quizzContent = JSON.stringify(
      { subject, questions, background },
      null,
      2,
    )
    fs.writeFileSync(filePath, quizzContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update quiz:", error)
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const filePath = path.join(getConfigPath(), "quizz", `${id}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete quiz:", error)
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 },
    )
  }
}
