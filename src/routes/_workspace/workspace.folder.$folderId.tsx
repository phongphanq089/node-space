import { createFileRoute } from '@tanstack/react-router'
import { NoteDetailView } from '@/features/notes'

export const Route = createFileRoute('/_workspace/workspace/folder/$folderId')({
  component: FolderDetailPage,
})

function FolderDetailPage() {
  const { folderId } = Route.useParams()

  return <NoteDetailView noteId={folderId} />
}
