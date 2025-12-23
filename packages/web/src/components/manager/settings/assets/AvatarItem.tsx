import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Delete } from "@mui/icons-material"
import Avatar from "@rahoot/web/components/Avatar"
import IconButton from "@rahoot/web/components/IconButton"
import { Avatar as AvatarType } from "@rahoot/web/contexts/assetsProvider"

interface AvatarWithId extends AvatarType {
  id: string
}

interface Props {
  avatar: AvatarWithId
  onEdit: (avatar: AvatarWithId) => void
  onDelete: (id: string) => void
}

const AvatarItem = ({ avatar, onEdit, onDelete }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: avatar.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1, // Only fade the placeholder in the list, overlay will be a fresh instance
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative aspect-square cursor-pointer transition-transform hover:scale-105"
      onClick={() => onEdit(avatar)}
    >
      <Avatar
        url={avatar.url}
        background={avatar.background}
        className="h-full w-full rounded-xl shadow-sm"
      />

      <div className="absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation() // Prevent edit modal on delete
            onDelete(avatar.id)
          }}
          size="small"
          className="bg-red-500 text-white shadow-sm hover:bg-red-600 dark:hover:bg-red-600"
          title="Delete"
        >
          <Delete sx={{ fontSize: 16 }} />
        </IconButton>
      </div>
    </div>
  )
}

export default AvatarItem
