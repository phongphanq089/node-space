import { LayoutGrid, List, X, RotateCcw } from 'lucide-react'
import { FolderFilterPills } from './folder-filter-pills'
import { FolderTagFilter } from './folder-tag-filter'
import { FolderSortMenu } from './folder-sort-menu'
import type { SortField, SortDirection } from './folder-sort-menu'
import { FolderSearchBar } from './folder-search-bar'
import { cn } from '@/shared/lib/utils'

export interface FolderToolbarProps {
  selectedWorkspaceId: string | null
  onSelectWorkspace: (id: string | null) => void
  selectedTags?: string[]
  selectedTag?: string | null
  onToggleTag?: (tag: string) => void
  onSelectTag?: (tag: string | null) => void
  onClearAllTags?: () => void
  sortBy: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField, direction: SortDirection) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  isSelectMode: boolean
  onToggleSelectMode: () => void
  search?: string
  onSearchChange?: (val: string) => void
  onCreateFolder?: () => void
  hideSearchBar?: boolean
}

export function FolderToolbar({
  selectedWorkspaceId,
  onSelectWorkspace,
  selectedTags = [],
  selectedTag,
  onToggleTag,
  onSelectTag,
  onClearAllTags,
  sortBy,
  sortDirection,
  onSortChange,
  viewMode,
  onViewModeChange,
  isSelectMode,
  onToggleSelectMode,
  search = '',
  onSearchChange,
  onCreateFolder,
  hideSearchBar = false,
}: FolderToolbarProps) {
  // Normalize tags array
  const activeTags =
    selectedTags.length > 0
      ? selectedTags
      : selectedTag
        ? selectedTag
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar when not rendered on hero banner */}
      {!hideSearchBar && onSearchChange && (
        <FolderSearchBar
          search={search}
          onSearchChange={onSearchChange}
          onCreateFolder={onCreateFolder}
        />
      )}

      {/* ── Filter Controls & Action Switchers ── */}
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Workspace Filter Select & Multi-Tag Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <FolderFilterPills
            selectedWorkspaceId={selectedWorkspaceId}
            onSelectWorkspace={onSelectWorkspace}
          />

          <FolderTagFilter
            selectedTags={activeTags}
            selectedTag={selectedTag}
            onToggleTag={onToggleTag}
            onSelectTag={onSelectTag}
            onClearAllTags={onClearAllTags}
            workspaceId={selectedWorkspaceId}
          />
        </div>

        {/* Right: Sort Menu & View Mode Switcher */}
        <div className="flex flex-shrink-0 items-center gap-2 self-end lg:self-auto">
          {/* Sort Dropdown Menu */}
          <FolderSortMenu
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            isSelectMode={isSelectMode}
            onToggleSelectMode={onToggleSelectMode}
          />

          {/* Grid / List View Mode Switcher */}
          <div className="flex flex-shrink-0 items-center rounded-xl border border-ns-border/70 bg-ns-surface p-0.5 shadow-xs dark:bg-ns-panel">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:hover:text-white'
              )}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-ns-primary text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:hover:text-white'
              )}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtered by Tags Active Badges Row */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 pt-0.5">
          <span className="text-xs font-bold whitespace-nowrap text-ns-muted uppercase dark:text-white/60">
            Filtered by Tags ({activeTags.length}):
          </span>

          {activeTags.map((tagName) => (
            <span
              key={tagName}
              className="py-0.8 inline-flex items-center gap-1.5 rounded-sm border border-purple-200 bg-purple-50 px-2.5 text-xs font-bold text-purple-700 dark:border-purple-500/50 dark:bg-purple-500/20 dark:text-purple-300"
            >
              <span>#{tagName}</span>
              <button
                type="button"
                onClick={() =>
                  onToggleTag ? onToggleTag(tagName) : onSelectTag?.(null)
                }
                className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-500/40 dark:hover:text-white"
                title={`Remove #${tagName}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}

          {activeTags.length > 1 && (
            <button
              type="button"
              onClick={() =>
                onClearAllTags ? onClearAllTags() : onSelectTag?.(null)
              }
              className="py-0.8 flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-xs font-semibold text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={11} />
              <span>Clear all</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
