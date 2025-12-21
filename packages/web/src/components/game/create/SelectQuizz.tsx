import { QuizzWithId } from "@rahoot/common/types/game"
import Button from "@rahoot/web/components/Button"
import clsx from "clsx"

type Props = {
  quizzList: QuizzWithId[]
  onSelect: (_id: string) => void
  onEdit: (_id: string) => void
}

const SelectQuizz = ({ quizzList, onSelect, onEdit }: Props) => {
  return (
    <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl font-bold">Select a quizz</h1>
        <div className="w-full space-y-2">
          {quizzList.map((quizz) => (
            <div
              key={quizz.id}
              className={clsx(
                "flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300",
              )}
            >
              <span className="font-medium">{quizz.subject}</span>

              <div className="flex gap-2">
                <Button
                  className="bg-blue-500 py-1 text-sm"
                  onClick={() => onEdit(quizz.id)}
                >
                  Edit
                </Button>
                <Button
                  className="py-1 text-sm"
                  onClick={() => onSelect(quizz.id)}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectQuizz
