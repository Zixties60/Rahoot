import { Refresh } from "@mui/icons-material"
import Avatar from "@rahoot/web/components/Avatar"
import Button from "@rahoot/web/components/Button"
import Input from "@rahoot/web/components/Input"
import { useEffect, useState } from "react"

interface AvatarData {
  id?: string
  url: string
  background: string
}

interface Props {
  initialData?: AvatarData | null
  onSave: (data: AvatarData) => void
  onCancel: () => void
}

const AvatarForm = ({ initialData, onSave, onCancel }: Props) => {
  const [url, setUrl] = useState("")
  // Separate state for the preview, so it only updates on button click
  const [previewUrl, setPreviewUrl] = useState("")
  const [background, setBackground] = useState("#ffffff")

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url)
      setPreviewUrl(initialData.url)
      setBackground(initialData.background)
    } else {
      setUrl("")
      setPreviewUrl("")
      setBackground("#ffffff")
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...(initialData?.id !== undefined && { id: initialData.id }),
      url,
      background,
    })
  }

  const handlePreview = () => {
    setPreviewUrl(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold">
          {initialData ? "Edit Avatar" : "Add Avatar"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/assets/avatar.png or https://..."
                required
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handlePreview}
                title="Load Preview"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Refresh />
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300 p-1"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500"
                placeholder="#RRGGBB"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-4">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Preview
            </span>
            <div className="flex justify-center">
              <div className="h-24 w-24">
                <Avatar
                  url={previewUrl}
                  background={background}
                  className="h-full w-full rounded-full border border-gray-200 shadow-sm"
                />
                {!previewUrl && (
                  <span className="text-xs text-gray-400">No Image Loaded</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" onClick={onCancel} className="bg-gray-500">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AvatarForm
