import { useState, useMemo } from 'react'
import {
  Tag,
  Search,
  ChevronDown,
  Loader2,
  Plus,
  LayoutGrid,
  Sparkles,
  List,
  ArrowUpDown,
  X,
  Hash,
  Layers,
  Flame,
  Check,
} from 'lucide-react'
import { Button, Input, ShowcaseEmptyState } from '@/shared/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { ConfirmDeleteModal } from '@/shared/ui/system'
import { useDebounce } from '@/shared/hooks'
import { useInfiniteTagsQuery, useDeleteTagMutation } from '../hooks/use-tags'
import type { TagRecord } from '../tag.fns'
import { TagCard } from './tag-card'
import { TagGridSkeleton } from './tag-skeleton'
import { TagDetailPreview } from './tag-detail-preview'
import { TagModal } from './tag-modal'
import { cn } from '@/shared/lib/utils'

type SortType = 'count_desc' | 'count_asc' | 'name_asc' | 'name_desc'
type ViewMode = 'grid' | 'cloud' | 'list'

const SORT_LABELS: Record<SortType, string> = {
  count_desc: 'Most Used (Popular)',
  count_asc: 'Least Used',
  name_asc: 'Name (A to Z)',
  name_desc: 'Name (Z to A)',
}

export function TagsList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 350)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortType>('count_desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Tag Modal states
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null)

  // Confirm Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingTag, setDeletingTag] = useState<TagRecord | null>(null)

  const deleteTagMutation = useDeleteTagMutation()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTagsQuery(30, debouncedSearch)

  const rawTags = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  )

  // Sort tags
  const dbTags = useMemo(() => {
    const list = [...rawTags]
    return list.sort((a, b) => {
      if (sortBy === 'count_desc') return b.count - a.count
      if (sortBy === 'count_asc') return a.count - b.count
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
      return 0
    })
  }, [rawTags, sortBy])

  const activeTagObj = dbTags.find((t) => t.name === selectedTag)
  const showLoadMore = hasNextPage && dbTags.length >= 30

  // Total usages
  const totalUsages = useMemo(
    () => dbTags.reduce((sum, t) => sum + (t.count || 0), 0),
    [dbTags]
  )

  const topTag = useMemo(() => {
    if (dbTags.length === 0) return null
    return [...dbTags].sort((a, b) => b.count - a.count)[0]
  }, [dbTags])

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
    <div className="flex flex-1 flex-col gap-6 p-3 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all sm:p-8 dark:bg-ns-surface/90 dark:shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-500/10 opacity-70 blur-3xl dark:bg-purple-500/20 dark:opacity-40" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-ns-primary/10 opacity-70 blur-3xl dark:bg-ns-primary/20 dark:opacity-40" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300">
              <Tag className="size-3.5" />
              <span>Topic Taxonomy & Tags</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-ns-text sm:text-3xl lg:text-4xl">
              Tag Management
            </h1>

            <p className="max-w-xl text-xs leading-relaxed text-ns-muted sm:text-sm">
              Organize and categorize your workspaces, folders, and notes by
              custom topic hashtags and taxonomy filters.
            </p>
          </div>

          {/* Quick Stats & Action Button */}
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <Button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 rounded-xl bg-ns-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-ns-primary/90 active:scale-95"
            >
              <Plus size={15} />
              <span>Create Tag</span>
            </Button>

            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <span className="text-xl font-extrabold text-ns-text">
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin text-ns-primary" />
                ) : (
                  dbTags.length
                )}
              </span>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Total Tags
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md sm:min-w-24 sm:flex-initial">
              <div className="flex items-center gap-1.5">
                <Layers className="size-3.5 text-purple-500" />
                <span className="text-xl font-extrabold text-ns-text">
                  {isLoading ? '...' : totalUsages}
                </span>
              </div>
              <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                Tagged Items
              </span>
            </div>

            {topTag && (
              <div className="hidden min-w-28 flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/80 px-4 py-2.5 shadow-xs backdrop-blur-md lg:flex">
                <div className="flex items-center gap-1.5">
                  <Flame className="size-3.5 text-amber-500" />
                  <span className="max-w-20 truncate text-sm font-extrabold text-ns-text">
                    #{topTag.name}
                  </span>
                </div>
                <span className="text-[0.65rem] font-bold tracking-wider text-ns-ghost uppercase">
                  Top Topic ({topTag.count})
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls Bar ────────────────────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative w-full lg:max-w-sm">
          <Input
            placeholder="Search tags by keyword..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            prefix={<Search size={15} className="text-ns-ghost" />}
            suffix={
              search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="cursor-pointer rounded-full p-0.5 text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null
            }
            className="border-ns-border-soft bg-ns-surface text-xs shadow-xs focus:border-ns-primary focus:ring-ns-primary/20"
          />
        </div>

        {/* Right Controls: Clear selection, Sort Dropdown & View Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {selectedTag && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="gap-1.5 border-ns-primary/40 bg-ns-primary/10 text-xs font-semibold text-ns-primary hover:bg-ns-primary/20"
            >
              <X size={13} />
              <span>Deselect #{selectedTag}</span>
            </Button>
          )}

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-ns-border-soft bg-ns-surface text-xs text-ns-text shadow-xs hover:bg-ns-hover"
              >
                <ArrowUpDown size={13} className="text-ns-ghost" />
                <span className="hidden text-ns-muted sm:inline">Sort:</span>
                <span className="font-semibold">{SORT_LABELS[sortBy]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-xl border border-ns-border-soft bg-ns-panel p-1 text-xs shadow-xl"
            >
              {(Object.keys(SORT_LABELS) as SortType[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSortBy(key)}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-ns-text hover:bg-ns-hover"
                >
                  <span>{SORT_LABELS[key]}</span>
                  {sortBy === key && (
                    <Check size={14} className="text-ns-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle (Grid / Cloud / List) */}
          <div className="flex items-center rounded-xl border border-ns-border-soft bg-ns-surface p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
              )}
              title="Grid Cards View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cloud')}
              className={cn(
                'flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
                viewMode === 'cloud'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
              )}
              title="Tag Cloud View"
            >
              <Sparkles size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text'
              )}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tag Content List / Grid / Cloud ─────────────────────────── */}
      {isLoading ? (
        <TagGridSkeleton count={15} />
      ) : dbTags.length === 0 ? (
        search ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ns-border-md bg-ns-surface/40 px-6 py-16 text-center shadow-xs backdrop-blur-sm">
            <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-500 shadow-lg shadow-purple-500/5 dark:text-purple-400">
              <Tag className="size-8" />
              <Hash className="absolute -top-1 -right-1 size-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-ns-text">
              No Matching Tags Found
            </h2>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ns-muted">
              We couldn't find any tags matching "{search}". Try a different
              keyword or create a new one.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button
                onClick={handleOpenCreateModal}
                className="gap-2 bg-ns-primary font-semibold text-white shadow-md hover:bg-ns-primary/90"
              >
                <Plus size={14} />
                <span>Create Tag</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setSearch('')}
                className="border-ns-border-soft bg-ns-surface text-ns-text hover:bg-ns-hover"
              >
                <span>Clear Search</span>
              </Button>
            </div>
          </div>
        ) : (
          <ShowcaseEmptyState
            badgeText="Topic Taxonomy"
            title={
              <>
                No tags created yet —{' '}
                <span className="font-extrabold text-ns-text">
                  create a hashtag
                </span>{' '}
                or start organizing.
              </>
            }
            description="Topic tags help you classify, group, and filter related notes and folders across your workspaces."
            primaryAction={{
              label: 'Create First Tag',
              onClick: handleOpenCreateModal,
              icon: <Plus size={15} />,
            }}
          />
        )
      ) : (
        <div className="flex flex-col gap-6">
          {viewMode === 'cloud' ? (
            /* Cloud View: flexible wrapping pill tags */
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-ns-border-soft bg-ns-surface/60 p-5 shadow-xs backdrop-blur-sm">
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
                  viewMode="cloud"
                />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            /* List View: stacked detailed rows */
            <div className="flex flex-col gap-2">
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
                  viewMode="list"
                />
              ))}
            </div>
          ) : (
            /* Grid View: responsive card grid */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                  viewMode="grid"
                />
              ))}
            </div>
          )}

          {/* Read More Pagination Button */}
          {showLoadMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-ns-border-soft bg-ns-surface px-6 py-2.5 text-xs font-bold text-ns-text shadow-sm transition-all hover:border-ns-border-md hover:bg-ns-hover active:scale-95 disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin text-ns-primary"
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

      {/* ── Selected Tag Detail Drilldown Section ───────────────────── */}
      {selectedTag && (
        <TagDetailPreview
          selectedTag={selectedTag}
          activeTagObj={activeTagObj}
          onClose={() => setSelectedTag(null)}
        />
      )}

      {/* ── Create / Edit Tag Modal ─────────────────────────────────── */}
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => {
          setIsTagModalOpen(false)
          setEditingTag(null)
        }}
        tagItem={editingTag}
      />

      {/* ── Confirm Delete Tag Modal ────────────────────────────────── */}
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
