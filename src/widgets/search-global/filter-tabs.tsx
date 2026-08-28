import type { FilterCategory } from './types'

interface FilterTabsProps {
  category: FilterCategory
  setCategory: (cat: FilterCategory) => void
  counts: Record<FilterCategory, number>
}

const TAB_LIST: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'folders', label: 'Folders' },
  { id: 'notes', label: 'Notes' },
  { id: 'tags', label: 'Tags' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'actions', label: 'Actions' },
]

export function FilterTabs({ category, setCategory, counts }: FilterTabsProps) {
  return (
    <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-border/60 px-4 py-2 text-xs dark:border-ns-border-soft/60">
      <span className="mr-1 text-[0.65rem] font-bold text-muted-foreground uppercase dark:text-ns-faint">
        Filter:
      </span>
      {TAB_LIST.map((tab) => {
        const isActive = category === tab.id
        const count = counts[tab.id] ?? 0
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={
              'flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ' +
              (isActive
                ? 'bg-primary text-primary-foreground shadow-md dark:bg-ns-primary dark:text-white'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:text-ns-ghost dark:hover:bg-ns-hover dark:hover:text-ns-text')
            }
          >
            <span>{tab.label}</span>
            {count > 0 && (
              <span
                className={
                  'rounded-full px-1.5 py-0.5 text-[0.6rem] ' +
                  (isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground dark:bg-ns-border-soft dark:text-ns-muted')
                }
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
