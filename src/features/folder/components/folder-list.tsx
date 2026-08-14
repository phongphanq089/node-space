import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X, FolderPlus, ChevronDown, Loader2 } from 'lucide-react'
import { GlowCardGrid } from '@/shared/ui/system/glow-card-grid'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { FolderModal } from './folder-modal'
import { NodeSearchBar } from './node-search-bar'
import { FolderFilterPills } from './folder-filter-pills'
import { FolderCard } from './folder-card'
import { FolderGridSkeleton } from './folder-skeleton'
import { useInfiniteFoldersQuery } from '../hooks/use-folders'
import { useDebounce } from '@/shared/hooks'

interface FoldersListProps {
  initialWorkspaceId?: string
  initialNoteId?: string
  initialTag?: string
}

export function FoldersList({
  initialWorkspaceId,
  initialNoteId,
  initialTag,
}: FoldersListProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    initialWorkspaceId ?? null
  )
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNoteId ?? null
  )
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag ?? null
  )
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  useEffect(() => {
    if (initialWorkspaceId !== undefined) {
      setSelectedWorkspaceId(initialWorkspaceId || null)
    }
  }, [initialWorkspaceId])

  useEffect(() => {
    if (initialNoteId !== undefined) {
      setSelectedNoteId(initialNoteId || null)
    }
  }, [initialNoteId])

  useEffect(() => {
    if (initialTag !== undefined) {
      setSelectedTag(initialTag || null)
    }
  }, [initialTag])

  const handleOpenNoteDetail = (noteId: string | null) => {
    setSelectedNoteId(noteId)
    void navigate({
      to: '/workspace/folder',
      search: (prev) => ({
        ...prev,
        noteId: noteId || undefined,
      }),
      replace: true,
    })
  }

  const activeNoteId = selectedNoteId || initialNoteId || null
  // eslint-disable-next-line no-constant-condition
  if (activeNoteId && false) {
    handleOpenNoteDetail(activeNoteId)
  }

  const handleSelectWorkspace = (id: string | null) => {
    setSelectedWorkspaceId(id)
    void navigate({
      to: '/workspace/folder',
      search: (prev) => ({
        ...prev,
        workspaceId: id || undefined,
      }),
      replace: true,
    })
  }

  const handleSelectTag = (tagName: string | null) => {
    setSelectedTag(tagName)
    void navigate({
      to: '/workspace/folder',
      search: (prev) => ({
        ...prev,
        tag: tagName || undefined,
      }),
      replace: true,
    })
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFoldersQuery(
      12,
      debouncedSearch,
      selectedWorkspaceId,
      selectedTag
    )

  // Flatten all fetched pages of folders into a single list
  const dbFolders = data?.pages.flatMap((page) => page.items) ?? []

  // Hide Load More button if total items displayed is less than page limit (12)
  const showLoadMore = hasNextPage && dbFolders.length >= 12

  const resetFilters = () => {
    handleSelectWorkspace(null)
    handleSelectTag(null)
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

        <div className="flex flex-col gap-2">
          <FolderFilterPills
            selectedWorkspaceId={selectedWorkspaceId}
            onSelectWorkspace={handleSelectWorkspace}
          />

          {selectedTag && (
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-faint uppercase">
                Filtered by Tag:
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/50 bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                <span>#{selectedTag}</span>
                <button
                  type="button"
                  onClick={() => handleSelectTag(null)}
                  className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-purple-500/40 hover:text-white"
                  title="Clear tag filter"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <FolderGridSkeleton count={6} />
      ) : dbFolders.length === 0 ? (
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
        <div className="flex flex-col gap-6">
          <GlowCardGrid className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
            {dbFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onSelectTag={handleSelectTag}
              />
            ))}
          </GlowCardGrid>

          {/* Read More / Load More Button */}
          {showLoadMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-ns-border/50 bg-ns-panel px-6 py-2.5 text-xs font-bold text-ns-primary-lt shadow-lg transition-all hover:border-ns-border-em hover:bg-ns-hover active:scale-95 disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin text-ns-primary-lt"
                    />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Folder Modal */}
      <FolderModal
        mode="create"
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        defaultWorkspaceId={selectedWorkspaceId}
      />
    </>
  )
}
