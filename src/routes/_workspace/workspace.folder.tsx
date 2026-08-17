import { FoldersList } from '@/features/folder'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const folderSearchSchema = z.object({
  workspaceId: z.string().optional(),
  noteId: z.string().optional(),
  tag: z.string().optional(),
})

export const Route = createFileRoute('/_workspace/workspace/folder')({
  validateSearch: (search) => folderSearchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, noteId, tag } = Route.useSearch()
  return (
    <div className="relative flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-ns-border-soft" />
        </div>
        <FoldersList
          initialWorkspaceId={workspaceId}
          initialNoteId={noteId}
          initialTag={tag}
        />
      </div>
    </div>
  )
}
