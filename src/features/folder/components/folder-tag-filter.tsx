import { useState, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { Tag as TagIcon, X, Check, Search, RotateCcw } from 'lucide-react'
import { useTagsQuery } from '@/features/tag'
import { cn } from '@/shared/lib/utils'

export interface FolderTagFilterProps {
  selectedTags?: string[]
  selectedTag?: string | null
  onToggleTag?: (tagName: string) => void
  onSelectTag?: (tagName: string | null) => void
  onClearAllTags?: () => void
  workspaceId?: string | null
  className?: string
}

export function FolderTagFilter({
  selectedTags: propSelectedTags,
  selectedTag,
  onToggleTag,
  onSelectTag,
  onClearAllTags,
  workspaceId: _workspaceId,
  className,
}: FolderTagFilterProps) {
  const { data: dbTags = [], isLoading } = useTagsQuery()
  const [tagSearch, setTagSearch] = useState('')

  // Normalize selectedTags array
  const activeTags: string[] = useMemo(() => {
    if (propSelectedTags && Array.isArray(propSelectedTags)) {
      return propSelectedTags
    }
    if (selectedTag) {
      return selectedTag
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }
    return []
  }, [propSelectedTags, selectedTag])

  const handleTagClick = (tagName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleTag) {
      onToggleTag(tagName)
    } else if (onSelectTag) {
      onSelectTag(tagName)
    }
  }

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onClearAllTags) {
      onClearAllTags()
    } else if (onSelectTag) {
      onSelectTag(null)
    }
  }

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return dbTags
    const query = tagSearch.toLowerCase()
    return dbTags.filter((t) => t.name.toLowerCase().includes(query))
  }, [dbTags, tagSearch])

  const isAnyTagSelected = activeTags.length > 0

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-9 flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold whitespace-nowrap shadow-xs transition-all active:scale-95',
              isAnyTagSelected
                ? 'border-purple-500/50 bg-purple-500/15 text-purple-700 dark:border-purple-500/60 dark:bg-purple-500/20 dark:text-purple-300'
                : 'border-ns-border/70 bg-ns-surface text-ns-text hover:border-ns-border-em hover:bg-ns-hover dark:bg-ns-panel dark:hover:text-white',
              className
            )}
          >
            <TagIcon
              size={13}
              className={
                isAnyTagSelected
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-ns-muted'
              }
            />
            <span>
              {isAnyTagSelected ? (
                <>
                  Tags (
                  <span className="font-bold text-purple-700 dark:text-white">
                    {activeTags.length}
                  </span>
                  ):{' '}
                  <span className="font-bold text-purple-600 dark:text-purple-200">
                    {activeTags.length <= 2
                      ? activeTags.map((t) => `#${t}`).join(', ')
                      : `#${activeTags[0]} +${activeTags.length - 1}`}
                  </span>
                </>
              ) : (
                'Filter by Tags'
              )}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-60 rounded-2xl border border-ns-border-soft bg-ns-surface/95 p-1.5 text-ns-text shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121118]/95 dark:text-white"
        >
          <div className="flex items-center justify-between px-2 py-1">
            <DropdownMenuLabel className="p-0 text-[0.7rem] font-bold tracking-wider text-ns-muted uppercase dark:text-zinc-400">
              Filter by Tags {isAnyTagSelected && `(${activeTags.length})`}
            </DropdownMenuLabel>
            {isAnyTagSelected && (
              <button
                type="button"
                onClick={handleClear}
                className="flex cursor-pointer items-center gap-1 text-[0.68rem] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <RotateCcw size={10} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Search Tag Input */}
          <div className="relative px-1 py-1">
            <Search
              size={13}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ns-muted dark:text-zinc-400"
            />
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags..."
              className="h-8 w-full rounded-lg border border-ns-border-soft bg-ns-surface-alt pr-2 pl-8 text-xs text-ns-text outline-none placeholder:text-ns-muted focus:border-purple-500/50 focus:bg-ns-surface dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <DropdownMenuSeparator className="my-1 bg-ns-border-soft dark:bg-white/10" />

          {/* Tags List with Checkboxes */}
          <div className="no-scrollbar max-h-52 overflow-y-auto">
            {isLoading ? (
              <div className="py-3 text-center text-xs text-ns-muted dark:text-zinc-500">
                Loading tags...
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="py-3 text-center text-xs text-ns-muted dark:text-zinc-500">
                No tags found
              </div>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = activeTags.includes(tag.name)
                return (
                  <div
                    key={tag.id || tag.name}
                    onClick={(e) => handleTagClick(tag.name, e)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors select-none',
                      isSelected
                        ? 'bg-purple-500/15 font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-white'
                        : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all',
                          isSelected
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-ns-border-soft bg-ns-surface-alt dark:border-white/20 dark:bg-black/30'
                        )}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-purple-500 dark:text-purple-400">
                          #
                        </span>
                        <span>{tag.name}</span>
                      </div>
                    </div>

                    {tag.count !== undefined && (
                      <span className="text-[10px] text-ns-muted dark:text-zinc-500">
                        {tag.count}
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Clear All Button */}
      {isAnyTagSelected && (
        <button
          type="button"
          onClick={() => handleClear()}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 transition-colors hover:bg-purple-500/20 hover:text-purple-700 dark:text-purple-400 dark:hover:text-white"
          title="Clear all tag filters"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
