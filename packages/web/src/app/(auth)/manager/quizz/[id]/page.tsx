"use client"

import { Add, Clear, Close, Delete, Save } from "@mui/icons-material"
import { Quizz } from "@rahoot/common/types/game"
import Button from "@rahoot/web/components/Button"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const EditQuizz = () => {
  const router = useRouter()
  const params = useParams()
  const [subject, setSubject] = useState("")
  const [questions, setQuestions] = useState<Quizz["questions"]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizz = async () => {
      try {
        const res = await fetch(`/api/manager/quizz/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch quiz")
        const data = await res.json()
        setSubject(data.subject)
        setQuestions(data.questions)
      } catch (error) {
        toast.error("Failed to load quiz")
        router.push("/manager")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchQuizz()
    }
  }, [params.id, router])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: ["", ""],
        solution: 0,
        cooldown: 5,
        time: 20,
      },
    ])
  }

  const handleQuestionChange = (
    index: number,
    field: keyof Quizz["questions"][0],
    value: any,
  ) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    value: string,
  ) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers[aIndex] = value
    setQuestions(newQuestions)
  }

  const handleAddAnswer = (qIndex: number) => {
    const newQuestions = [...questions]
    if (newQuestions[qIndex].answers.length >= 4) {
      toast.error("Maximum 4 answers allowed")
      return
    }
    newQuestions[qIndex].answers.push("")
    setQuestions(newQuestions)
  }

  const handleRemoveAnswer = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter(
      (_, i) => i !== aIndex,
    )
    if (newQuestions[qIndex].solution >= newQuestions[qIndex].answers.length) {
      newQuestions[qIndex].solution = 0
    }
    setQuestions(newQuestions)
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!subject) {
      toast.error("Please enter a subject")
      return
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question")
      return
    }

    for (const q of questions) {
      if (!q.question) {
        toast.error("All questions must have a text")
        return
      }
      if (q.answers.some((a) => !a)) {
        toast.error("All answers must be filled")
        return
      }
      if (q.answers.length < 2 || q.answers.length > 4) {
        toast.error("Each question must have between 2 and 4 answers")
        return
      }
    }

    try {
      const res = await fetch(`/api/manager/quizz/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, questions }),
      })

      if (res.ok) {
        toast.success("Quiz updated successfully")
        router.push("/manager")
      } else {
        throw new Error("Failed to update quiz")
      }
    } catch {
      toast.error("Failed to update quiz")
    }
  }

  if (loading) {
    return <div className="p-4 text-white">Loading quiz...</div>
  }

  return (
    <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Quiz</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete this quiz? This action cannot be undone.",
                )
              ) {
                fetch(`/api/manager/quizz/${params.id}`, { method: "DELETE" })
                  .then(() => {
                    toast.success("Quiz deleted successfully")
                    router.push("/manager")
                  })
                  .catch(() => toast.error("Failed to delete quiz"))
              }
            }}
            className="bg-red-500"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
          placeholder="Enter quiz subject"
        />
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="relative flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Question {qIndex + 1}</h3>
              <Button
                onClick={() => handleRemoveQuestion(qIndex)}
                className="bg-red-500"
                startIcon={<Delete fontSize="small" />}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Question Text
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
                placeholder="Enter question"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL (Optional)
              </label>
              <input
                type="text"
                value={q.image || ""}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "image", e.target.value)
                }
                className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Answers
              </label>
              <div className="flex flex-col gap-2">
                {q.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`solution-${qIndex}`}
                      checked={q.solution === aIndex}
                      onChange={() =>
                        handleQuestionChange(qIndex, "solution", aIndex)
                      }
                      className="h-4 w-4"
                    />
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                      className="focus:border-primary flex-1 rounded-md border border-gray-300 p-2 outline-none"
                      placeholder={`Answer ${aIndex + 1}`}
                    />
                    {q.answers.length > 2 && (
                      <Button
                        onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                        className="bg-red-500 text-sm"
                        startIcon={<Clear fontSize="small" />}
                      />
                    )}
                  </div>
                ))}
                {q.answers.length < 4 && (
                  <button
                    onClick={() => handleAddAnswer(qIndex)}
                    className="text-primary w-fit text-left text-sm font-medium hover:underline"
                  >
                    + Add Answer
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Cooldown (sec)
                </label>
                <input
                  type="number"
                  value={q.cooldown}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "cooldown",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Time (sec)
                </label>
                <input
                  type="number"
                  value={q.time}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "time",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="focus:border-primary w-full rounded-md border border-gray-300 p-2 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleAddQuestion}
        className="w-full bg-blue-500"
        startIcon={<Add />}
      >
        Add Question
      </Button>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => router.back()}
          className="w-full bg-gray-500"
          startIcon={<Close />}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className="w-full" startIcon={<Save />}>
          Save Quiz
        </Button>
      </div>
    </div>
  )
}

export default EditQuizz
