import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X, FolderPlus, ChevronDown, Loader2 } from 'lucide-react'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { FolderModal } from './folder-modal'
import { FolderCard } from './folder-card'
import type { FolderItemRecord } from './folder-card'
import { FolderListItem } from './folder-list-item'
import { FolderToolbar } from './folder-toolbar'
import { FolderBatchActionBar } from './folder-batch-action-bar'
import { FolderGridSkeleton, FolderListSkeleton } from './folder-skeleton'
import {
  useInfiniteFoldersQuery,
  useDeleteFolderMutation,
} from '../hooks/use-folders'
import { useFolderFilters } from '../hooks/use-folder-filters'
import { useNoteTabsStore } from '@/features/notes'
import { toast } from 'sonner'

interface FoldersListProps {
  initialWorkspaceId?: string
  initialNoteId?: string
  initialFolderId?: string
  initialTag?: string
  search?: string
  onSearchChange?: (value: string) => void
  isCreateFolderOpen?: boolean
  setIsCreateFolderOpen?: (open: boolean) => void
  hideSearchBar?: boolean
}

export function FoldersList({
  initialWorkspaceId,
  initialNoteId: _initialNoteId,
  initialFolderId,
  initialTag,
  search: externalSearch,
  onSearchChange: externalOnSearchChange,
  isCreateFolderOpen: externalIsCreateFolderOpen,
  setIsCreateFolderOpen: externalSetIsCreateFolderOpen,
  hideSearchBar = false,
}: FoldersListProps) {
  const navigate = useNavigate()

  // Centralized filter, sort, view mode & multi-selection logic
  const filters = useFolderFilters({
    initialWorkspaceId,
    initialTag,
    externalSearch,
    externalOnSearchChange,
  })

  // Modal states
  const [internalIsCreateFolderOpen, setInternalIsCreateFolderOpen] =
    useState(false)
  const isCreateFolderOpen =
    externalIsCreateFolderOpen !== undefined
      ? externalIsCreateFolderOpen
      : internalIsCreateFolderOpen
  const setIsCreateFolderOpen =
    externalSetIsCreateFolderOpen || setInternalIsCreateFolderOpen

  const [editingFolder, setEditingFolder] = useState<FolderItemRecord | null>(
    null
  )
  const [deletingFolder, setDeletingFolder] = useState<FolderItemRecord | null>(
    null
  )
  const [isBatchDeleting, setIsBatchDeleting] = useState(false)
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] =
    useState(false)

  const deleteFolderMutation = useDeleteFolderMutation()

  // Tab navigation store
  const { openTab } = useNoteTabsStore()

  const mapFolderToNode = useCallback(
    (folder: FolderItemRecord) => ({
      id: folder.id,
      title: folder.name,
      folderId: folder.id,
      folderName: folder.name,
      thumbnail: folder.image ?? undefined,
      updatedAt: folder.updatedAt
        ? new Date(folder.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recently',
    }),
    []
  )

  const handleSelectFolder = useCallback(
    (folder: FolderItemRecord) => {
      const tabData = mapFolderToNode(folder)
      openTab(tabData)
      void navigate({
        to: `/workspace/folder/${tabData.id}` as any,
      })
    },
    [navigate, openTab, mapFolderToNode]
  )

  // Modals handlers
  const handleCloseFolderModal = useCallback(() => {
    setIsCreateFolderOpen(false)
    setEditingFolder(null)
  }, [setIsCreateFolderOpen])

  const handleConfirmSingleDelete = useCallback(() => {
    if (!deletingFolder) return
    deleteFolderMutation.mutate(deletingFolder.id, {
      onSuccess: () => setDeletingFolder(null),
    })
  }, [deletingFolder, deleteFolderMutation])

  const handleConfirmBatchDelete = useCallback(async () => {
    if (filters.selectedFolderIds.length === 0) return
    setIsBatchDeleting(true)
    try {
      for (const folderId of filters.selectedFolderIds) {
        await deleteFolderMutation.mutateAsync(folderId)
      }
      toast.success(
        `Deleted ${filters.selectedFolderIds.length} folder${filters.selectedFolderIds.length > 1 ? 's' : ''} successfully!`
      )
      filters.handleDeselectAll()
      filters.setIsSelectMode(false)
      setIsBatchDeleteConfirmOpen(false)
    } catch (err: any) {
      toast.error('Failed to delete some folders: ' + (err.message || 'Error'))
    } finally {
      setIsBatchDeleting(false)
    }
  }, [filters, deleteFolderMutation])

  // Data fetching
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFoldersQuery(
      12,
      filters.debouncedSearch,
      filters.selectedWorkspaceId,
      filters.selectedTags
    )

  // Flatten database records
  const dbFolders: FolderItemRecord[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  // Sort folders
  const sortedFolders = useMemo(() => {
    return filters.sortFolders(dbFolders)
  }, [filters, dbFolders])

  // Auto-select folder if initialFolderId is provided
  useEffect(() => {
    if (!initialFolderId || isLoading || dbFolders.length === 0) return
    const matched = dbFolders.find((f) => f.id === initialFolderId)
    if (matched) {
      handleSelectFolder(matched)
    }
  }, [initialFolderId, isLoading, dbFolders, handleSelectFolder])

  const showLoadMore = hasNextPage && dbFolders.length >= 12

  return (
    <>
      {/* Extracted Folder Toolbar (Workspace filter, Tag filter, Sort menu, View switcher) */}
      <FolderToolbar
        selectedWorkspaceId={filters.selectedWorkspaceId}
        onSelectWorkspace={filters.handleSelectWorkspace}
        selectedTags={filters.selectedTags}
        selectedTag={filters.selectedTag}
        onToggleTag={filters.handleToggleTag}
        onSelectTag={filters.handleSelectTag}
        onClearAllTags={filters.handleClearAllTags}
        sortBy={filters.sortBy}
        sortDirection={filters.sortDirection}
        onSortChange={(field, direction) => {
          filters.setSortBy(field)
          filters.setSortDirection(direction)
        }}
        viewMode={filters.viewMode}
        onViewModeChange={filters.setViewMode}
        isSelectMode={filters.isSelectMode}
        onToggleSelectMode={filters.handleToggleSelectMode}
        search={filters.search}
        onSearchChange={filters.setSearch}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        hideSearchBar={hideSearchBar}
      />

      {/* ── Content View ── */}
      {isLoading ? (
        filters.viewMode === 'list' ? (
          <FolderListSkeleton count={8} />
        ) : (
          <FolderGridSkeleton count={9} />
        )
      ) : sortedFolders.length === 0 ? (
        <EmptyState
          variant={
            filters.selectedWorkspaceId
              ? 'folder'
              : filters.search
                ? 'search'
                : 'default'
          }
          title={
            filters.selectedWorkspaceId
              ? 'No folders match the selected workspace'
              : filters.search
                ? `No folders found for "${filters.search}"`
                : 'No folders available'
          }
          description={
            filters.search ||
            filters.selectedWorkspaceId ||
            filters.selectedTags.length > 0
              ? 'Try clearing your search query or resetting filters.'
              : 'Create your first folder to organize your notes.'
          }
          action={
            filters.selectedWorkspaceId ||
            filters.search ||
            filters.selectedTags.length > 0 ? (
              <button
                onClick={filters.resetFilters}
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
          {filters.viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
              {sortedFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onSelectTag={filters.handleToggleTag}
                  onSelect={handleSelectFolder}
                  onEdit={setEditingFolder}
                  onDelete={setDeletingFolder}
                  isDeleting={
                    deleteFolderMutation.isPending &&
                    deletingFolder?.id === folder.id
                  }
                  isSelectMode={filters.isSelectMode}
                  isSelected={filters.selectedFolderIds.includes(folder.id)}
                  onToggleSelect={filters.handleToggleSelectFolder}
                />
              ))}
            </div>
          )}

          {filters.viewMode === 'list' && (
            <div className="flex flex-col gap-2.5">
              {sortedFolders.map((folder) => (
                <FolderListItem
                  key={folder.id}
                  folder={folder}
                  onSelectTag={filters.handleToggleTag}
                  onSelect={handleSelectFolder}
                  onEdit={setEditingFolder}
                  onDelete={setDeletingFolder}
                  isDeleting={
                    deleteFolderMutation.isPending &&
                    deletingFolder?.id === folder.id
                  }
                  isSelectMode={filters.isSelectMode}
                  isSelected={filters.selectedFolderIds.includes(folder.id)}
                  onToggleSelect={filters.handleToggleSelectFolder}
                />
              ))}
            </div>
          )}

          {/* Pagination Load More */}
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

      {/* Floating Multi-Select Action Bar */}
      <FolderBatchActionBar
        isSelectMode={filters.isSelectMode}
        selectedCount={filters.selectedFolderIds.length}
        totalCount={sortedFolders.length}
        onSelectAll={() =>
          filters.handleSelectAll(sortedFolders.map((f) => f.id))
        }
        onDeselectAll={filters.handleDeselectAll}
        onDeleteSelected={() => setIsBatchDeleteConfirmOpen(true)}
        onCancel={() => {
          filters.setIsSelectMode(false)
          filters.handleDeselectAll()
        }}
      />

      {/* Folder Modal (Create & Edit) */}
      <FolderModal
        mode={editingFolder ? 'edit' : 'create'}
        folder={editingFolder}
        isOpen={isCreateFolderOpen || Boolean(editingFolder)}
        onClose={handleCloseFolderModal}
        defaultWorkspaceId={filters.selectedWorkspaceId}
      />

      {/* Single Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingFolder)}
        onClose={() => setDeletingFolder(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Folder"
        description="Are you sure you want to delete this folder and all notes inside it? This action cannot be undone."
        itemName={deletingFolder?.name}
        isPending={deleteFolderMutation.isPending}
      />

      {/* Batch Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isBatchDeleteConfirmOpen}
        onClose={() => setIsBatchDeleteConfirmOpen(false)}
        onConfirm={handleConfirmBatchDelete}
        title={`Delete ${filters.selectedFolderIds.length} Folder${filters.selectedFolderIds.length > 1 ? 's' : ''}`}
        description={`Are you sure you want to delete ${filters.selectedFolderIds.length} selected folder${filters.selectedFolderIds.length > 1 ? 's' : ''} and all notes inside them? This action cannot be undone.`}
        isPending={isBatchDeleting}
      />
    </>
  )
}
