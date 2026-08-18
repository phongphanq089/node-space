import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X, FolderPlus, ChevronDown, Loader2 } from 'lucide-react'
import { GlowCardGrid } from '@/shared/ui/system/glow-card-grid'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { FolderModal } from './folder-modal'
import { NodeSearchBar } from './node-search-bar'
import { FolderFilterPills } from './folder-filter-pills'
import { FolderCard } from './folder-card'
import type { FolderItemRecord } from './folder-card'
import { FolderGridSkeleton } from './folder-skeleton'
import {
  useInfiniteFoldersQuery,
  useDeleteFolderMutation,
} from '../hooks/use-folders'
import { useDebounce } from '@/shared/hooks'
import { useNoteDetailModalStore } from '@/features/notes'
import type { NoteDetailNode } from '@/features/notes'

interface FoldersListProps {
  initialWorkspaceId?: string
  initialNoteId?: string
  initialFolderId?: string
  initialTag?: string
}

export function FoldersList({
  initialWorkspaceId,
  initialNoteId: _initialNoteId,
  initialFolderId,
  initialTag,
}: FoldersListProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    initialWorkspaceId ?? null
  )
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialTag ?? null
  )
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderItemRecord | null>(
    null
  )
  const [deletingFolder, setDeletingFolder] = useState<FolderItemRecord | null>(
    null
  )

  const deleteFolderMutation = useDeleteFolderMutation()

  useEffect(() => {
    if (initialWorkspaceId !== undefined) {
      setSelectedWorkspaceId(initialWorkspaceId || null)
    }
  }, [initialWorkspaceId])

  useEffect(() => {
    if (initialTag !== undefined) {
      setSelectedTag(initialTag || null)
    }
  }, [initialTag])

  const handleSelectWorkspace = useCallback(
    (id: string | null) => {
      setSelectedWorkspaceId(id)
      void navigate({
        to: '/workspace/folder',
        search: (prev) => ({
          ...prev,
          workspaceId: id || undefined,
        }),
        replace: true,
      })
    },
    [navigate]
  )

  const handleSelectTag = useCallback(
    (tagName: string | null) => {
      setSelectedTag(tagName)
      void navigate({
        to: '/workspace/folder',
        search: (prev) => ({
          ...prev,
          tag: tagName || undefined,
        }),
        replace: true,
      })
    },
    [navigate]
  )

  const handleEditFolder = useCallback((folder: FolderItemRecord) => {
    setEditingFolder(folder)
  }, [])

  const handleDeleteFolder = useCallback((folder: FolderItemRecord) => {
    setDeletingFolder(folder)
  }, [])

  const { openModal, node: activeNode } = useNoteDetailModalStore()

  const mapFolderToNode = useCallback(
    (folder: FolderItemRecord) => ({
      title: folder.name,
      count: 0,
      updated: folder.updatedAt
        ? new Date(folder.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently',
      folderId: folder.id,
      thumbnail: folder.image ?? undefined,
    }),
    []
  )
  const handleSelectFolder = useCallback(
    (folder: FolderItemRecord) => {
      void navigate({
        to: '/workspace/folder',
        search: (prev) => ({
          ...prev,
          folderId: folder.id,
        }),
      })
      openModal(mapFolderToNode(folder))
    },
    [navigate, openModal, mapFolderToNode]
  )

  const handleCloseFolderModal = useCallback(() => {
    setIsCreateFolderOpen(false)
    setEditingFolder(null)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeletingFolder(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!deletingFolder) return
    deleteFolderMutation.mutate(deletingFolder.id, {
      onSuccess: () => setDeletingFolder(null),
    })
  }, [deletingFolder, deleteFolderMutation])

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

  useEffect(() => {
    if (!initialFolderId || isLoading || dbFolders.length === 0) return
    const matched = dbFolders.find((f) => f.id === initialFolderId)
    if (matched) {
      openModal(mapFolderToNode(matched))
    }
  }, [initialFolderId, isLoading])

  const prevNodeRef = useRef<NoteDetailNode | null>(activeNode)
  useEffect(() => {
    const hadNode = prevNodeRef.current
    prevNodeRef.current = activeNode
    if (!activeNode && hadNode) {
      void navigate({
        to: '/workspace/folder',
        search: (prev) => ({ ...prev, folderId: undefined }),
        replace: true,
      })
    }
  }, [activeNode, navigate])

  const resetFilters = useCallback(() => {
    handleSelectWorkspace(null)
    handleSelectTag(null)
    setSearch('')
  }, [handleSelectWorkspace, handleSelectTag])

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
              <span className="text-xs font-bold whitespace-nowrap text-white/60 uppercase">
                Filtered by Tag:
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-purple-500/50 bg-purple-500/20 px-2.5 py-1 text-xs font-bold text-purple-300">
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
        <FolderGridSkeleton count={9} />
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
                onSelect={handleSelectFolder}
                onEdit={handleEditFolder}
                onDelete={handleDeleteFolder}
                isDeleting={
                  deleteFolderMutation.isPending &&
                  deletingFolder?.id === folder.id
                }
              />
            ))}
          </GlowCardGrid>

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

      {/* Single Lifted Folder Modal (Handles both Create & Edit) */}
      <FolderModal
        mode={editingFolder ? 'edit' : 'create'}
        folder={editingFolder}
        isOpen={isCreateFolderOpen || Boolean(editingFolder)}
        onClose={handleCloseFolderModal}
        defaultWorkspaceId={selectedWorkspaceId}
      />

      {/* Single Lifted Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingFolder)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Folder"
        description="Are you sure you want to delete this folder? This action cannot be undone."
        itemName={deletingFolder?.name}
        isPending={deleteFolderMutation.isPending}
      />
    </>
  )
}
