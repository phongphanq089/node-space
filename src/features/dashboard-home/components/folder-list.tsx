import { useState } from 'react'
import { X, FolderPlus } from 'lucide-react'
import { GlowCardGrid } from '@/shared/ui/system/glow-card-grid'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { CreateFolderModal } from './create-folder-modal'
import { NodeSearchBar } from './node-search-bar'
import { FolderFilterPills } from './folder-filter-pills'
import { FolderCard } from './node-card'
import { useFoldersQuery } from '../hooks/use-folders'

export function FoldersList() {
  const { data: dbFolders = [] } = useFoldersQuery()
  const [search, setSearch] = useState('')
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  )
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  const filteredFolders = dbFolders.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchesWorkspace = selectedWorkspaceId
      ? f.workspace_id === selectedWorkspaceId
      : true
    return matchesSearch && matchesWorkspace
  })

  const resetFilters = () => {
    setSelectedWorkspaceId(null)
    setSearch('')
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <NodeSearchBar
          search={search}
          onSearchChange={setSearch}
          onCreateFolder={() => setIsCreateFolderOpen(true)}
        />

        <FolderFilterPills
          selectedWorkspaceId={selectedWorkspaceId}
          onSelectWorkspace={setSelectedWorkspaceId}
        />
      </div>

      {filteredFolders.length === 0 ? (
        <EmptyState
          variant={
            selectedWorkspaceId ? 'folder' : search ? 'search' : 'default'
          }
          title={
            selectedWorkspaceId
              ? 'No folders match the selected workspace'
              : search
                ? `No folders found for "${search}"`
                : 'No folders available'
          }
          description={
            search || selectedWorkspaceId
              ? 'Try clearing your search query or resetting filters.'
              : 'Create your first folder to organize your notes.'
          }
          action={
            selectedWorkspaceId || search ? (
              <button
                onClick={resetFilters}
                className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-ns-border bg-ns-panel px-3 py-1.5 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
              >
                <X size={12} />
                <span>Reset Filters</span>
              </button>
            ) : (
              <button
                onClick={() => setIsCreateFolderOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-ns-border bg-ns-panel px-3.5 py-2 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
              >
                <FolderPlus size={14} />
                <span>Create New Folder</span>
              </button>
            )
          }
        />
      ) : (
        <GlowCardGrid className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
          {filteredFolders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </GlowCardGrid>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </>
  )
}
