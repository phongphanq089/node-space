import { useState } from 'react'
import { Tag, Search, ChevronDown, Loader2, Plus } from 'lucide-react'
import { Button, Input } from '@/shared/ui'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { useDebounce } from '@/shared/hooks'
import { useInfiniteTagsQuery, useDeleteTagMutation } from '../hooks/use-tags'
import type { TagRecord } from '../tag.fns'
import { TagCard } from './tag-card'
import { TagGridSkeleton } from './tag-skeleton'
import { TagDetailPreview } from './tag-detail-preview'
import { TagModal } from './tag-modal'

export function TagsList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 350)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Tag Modal states
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null)

  // Confirm Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTag, setDeletingTag] = useState<TagRecord | null>(null)

  const deleteTagMutation = useDeleteTagMutation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTagsQuery(15, debouncedSearch)

  const dbTags = data?.pages.flatMap((page) => page.items) ?? []
  const activeTagObj = dbTags.find((t) => t.name === selectedTag)
  const showLoadMore = hasNextPage && dbTags.length >= 15

  const handleOpenCreateModal = () => {
    setEditingTag(null)
    setIsTagModalOpen(true)
  }

  const handleOpenEditModal = (t: TagRecord) => {
    setEditingTag(t)
    setIsTagModalOpen(true)
  }

  const handleOpenDeleteModal = (t: TagRecord) => {
    setDeletingTag(t)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deletingTag) return
    deleteTagMutation.mutate(deletingTag.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
        if (selectedTag === deletingTag.name) {
          setSelectedTag(null)
        }
        setDeletingTag(null)
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg p-4 font-sans sm:p-6 lg:p-8">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="ns-orb-purple-20 pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-30 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[0.7rem] font-semibold text-purple-300">
              <Tag className="size-3.5" />
              <span>Classification System</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Tag Management
            </h1>
            <p className="max-w-xl text-xs text-ns-muted sm:text-sm">
              Organize and filter your node workspace by custom topic tags,
              categories, and keywords.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-600/30 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-purple-600/50 active:scale-95"
            >
              <Plus size={15} />
              <span>Create Tag</span>
            </Button>
            <div className="flex flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-lg font-bold text-purple-400">
                {dbTags.length}
              </span>
              <span className="text-[0.65rem] font-semibold text-ns-ghost uppercase">
                Total Tags
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder="Search tags by keyword..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            suffix={<Search size={14} className="text-ns-ghost" />}
          />
        </div>

        {selectedTag && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="cursor-pointer self-start border-ns-border-soft text-xs text-ns-muted hover:text-white sm:self-auto"
          >
            Clear tag selection
          </Button>
        )}
      </div>

      {/* Tag Grid Cloud */}
      {isLoading ? (
        <TagGridSkeleton count={10} />
      ) : dbTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ns-border/40 bg-ns-panel/20 p-8 text-center">
          <Tag size={24} className="text-ns-ghost" />
          <span className="text-sm font-bold text-ns-muted">No tags found</span>
          <span className="text-xs text-ns-faint">
            Create a new tag or try adjusting your search keyword
          </span>
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="mt-1 flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus size={14} />
            <span>Create First Tag</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {dbTags.map((t) => (
              <TagCard
                key={t.id}
                tag={t}
                isSelected={selectedTag === t.name}
                onSelect={(name) =>
                  setSelectedTag(selectedTag === name ? null : name)
                }
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>

          {/* Read More Pagination Button */}
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
                    <span>Loading more tags...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Tags</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected Tag Preview Section */}
      {selectedTag && (
        <TagDetailPreview
          selectedTag={selectedTag}
          activeTagObj={activeTagObj}
        />
      )}

      {/* Create / Edit Tag Modal */}
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => {
          setIsTagModalOpen(false)
          setEditingTag(null)
        }}
        tagItem={editingTag}
      />

      {/* Confirm Delete Tag Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingTag(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Topic Tag"
        description="Are you sure you want to delete this topic tag? This action cannot be undone."
        itemName={deletingTag ? `#${deletingTag.name}` : ''}
        isPending={deleteTagMutation.isPending}
      />
    </div>
  )
}
