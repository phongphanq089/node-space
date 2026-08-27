export interface NoteItem {
  id?: string
  title: string
  name?: string
  content?: string
  tags: string[]
  updated: string
  starred?: boolean
  isPinned?: boolean
  isFavorite?: boolean
  isArchived?: boolean
  isTrash?: boolean
  folderId?: string | null
  workspaceId?: string | null
  authorId?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface FolderDetailNode {
  id?: string
  title: string
  name?: string
  count?: number
  updated?: string
  tag?: string
  tagColor?: string
  folderId?: string
  folderName?: string
  active?: boolean
  starred?: boolean
  thumbnail?: string
  color?: string | null
  image?: string | null
}
