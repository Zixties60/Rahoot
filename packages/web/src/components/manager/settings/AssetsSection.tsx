import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Add, Save } from "@mui/icons-material"
import Button from "@rahoot/web/components/Button"
import {
  Avatar as AvatarType,
  useAssets,
} from "@rahoot/web/contexts/assetsProvider"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import AvatarForm from "./assets/AvatarForm"
import AvatarItem from "./assets/AvatarItem"
import SoundItem from "./assets/SoundItem"
import { SOUNDS } from "@rahoot/web/utils/constants"

// UI-only type with stable ID for dnd-kit
export interface AvatarWithId extends AvatarType {
  id: string
}

// Config from API (no IDs in JSON)
interface AssetsConfig {
  avatars: AvatarType[]
  sounds: Record<string, string>
}

const AssetsSection = () => {
  const [avatars, setAvatars] = useState<AvatarWithId[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sounds, setSounds] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAvatar, setEditingAvatar] = useState<AvatarWithId | null>(null)
  const { reloadAssets } = useAssets()

  useEffect(() => {
    fetch("/api/settings/assets")
      .then((res) => res.json())
      .then((data: AssetsConfig) => {
        if (data.avatars) {
          // Assign temp UUIDs for UI stability
          const normalizedAvatars = data.avatars.map((a) => ({
            ...a,
            id: uuidv4(),
          }))
          setAvatars(normalizedAvatars)
        }
        if (data.sounds) setSounds(data.sounds)
      })
      .catch(() => toast.error("Failed to load assets"))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveAll = async () => {
    try {
      // Strip IDs before saving
      const cleanAvatars: AvatarType[] = avatars.map(({ url, background }) => ({
        url,
        background,
      }))

      const payload = {
        avatars: cleanAvatars,
        sounds,
      }

      const res = await fetch("/api/manager/settings/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        reloadAssets()
        toast.success("Assets config saved")
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast.error("Failed to save assets")
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (active.id !== over?.id) {
      setAvatars((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddStart = () => {
    setEditingAvatar(null)
    setIsFormOpen(true)
  }

  const handleEditStart = (avatar: AvatarWithId) => {
    setEditingAvatar(avatar)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this avatar?")) {
      setAvatars((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const handleFormSave = (data: {
    id?: string // This is the UUID
    url: string
    background: string
  }) => {
    if (editingAvatar) {
      // Update existing
      setAvatars((prev) =>
        prev.map((a) =>
          a.id === data.id
            ? { ...a, url: data.url, background: data.background }
            : a,
        ),
      )
    } else {
      // Add new
      const newAvatar: AvatarWithId = {
        id: uuidv4(),
        url: data.url,
        background: data.background,
      }
      setAvatars((prev) => [...prev, newAvatar])
    }
    setIsFormOpen(false)
  }

  if (loading) return <div className="p-4">Loading assets...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Avatars</h2>
        <Button
          onClick={handleAddStart}
          startIcon={<Add />}
          className="bg-secondary text-onSecondary!"
        >
          Add Avatar
        </Button>
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={avatars.map((a) => a.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-4">
              {avatars.map((avatar) => (
                <AvatarItem
                  key={avatar.id}
                  avatar={avatar}
                  onEdit={handleEditStart}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <AvatarItem
                avatar={avatars.find((a) => a.id === activeId)!}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {avatars.length === 0 && (
          <p className="py-4 text-center text-gray-500 italic">
            No avatars found.
          </p>
        )}
      </div>

      {/* Basic Sound Editor */}
      <h2 className="border-t border-gray-100 pt-4 text-xl font-bold">
        Sounds Configuration
      </h2>
      <h2 className="border-t border-gray-100 pt-4 text-xl font-bold">
        Sounds Configuration
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SOUNDS.map((sound) => (
          <SoundItem
            key={sound}
            label={sound}
            url={sounds[sound]}
            onChange={(newUrl) =>
              setSounds((prev) => ({ ...prev, [sound]: newUrl }))
            }
          />
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={handleSaveAll} className="w-full" startIcon={<Save />}>
          Save Assets Config
        </Button>
      </div>

      {isFormOpen && (
        <AvatarForm
          initialData={editingAvatar}
          onSave={handleFormSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}

export default AssetsSection
