import { useState } from 'react'
import { FoldersList } from '@/features/folder'
import { HeroBanner } from '@/features/folder/components/banner-hero'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const folderSearchSchema = z.object({
  workspaceId: z.string().optional(),
  noteId: z.string().optional(),
  folderId: z.string().optional(),
  tag: z.string().optional(),
})

export const Route = createFileRoute('/_workspace/workspace/folder/')({
  validateSearch: (search) => folderSearchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, noteId, folderId, tag } = Route.useSearch()
  const [search, setSearch] = useState('')
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  return (
    <div className="relative flex min-w-0 flex-1 flex-col gap-4 pb-10">
      <HeroBanner
        search={search}
        onSearchChange={setSearch}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
      />
      <div className="flex min-w-0 flex-col gap-3 py-2">
        <FoldersList
          initialWorkspaceId={workspaceId}
          initialNoteId={noteId}
          initialFolderId={folderId}
          initialTag={tag}
          search={search}
          onSearchChange={setSearch}
          isCreateFolderOpen={isCreateFolderOpen}
          setIsCreateFolderOpen={setIsCreateFolderOpen}
          hideSearchBar={true}
        />
      </div>
    </div>
  )
}
