import { useRef } from 'react'
import { FileText, X, Plus, Pin, SplitSquareVertical } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'

export interface NoteTab {
  id: string
  title: string
  tags?: string[]
  isPinned?: boolean
  updated?: string
  content?: string
}

interface FolderNoteTabsBarProps {
  tabs: NoteTab[]
  activeTabId: string | null
  viewMode: 'edit' | 'preview' | 'split'
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  onTogglePinTab: (tabId: string) => void
  onChangeViewMode?: (mode: 'edit' | 'preview' | 'split') => void
}

export function FolderNoteTabsBar({
  tabs,
  activeTabId,
  viewMode,
  onSelectTab,
  onCloseTab,
  onTogglePinTab,
  onChangeViewMode,
}: FolderNoteTabsBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const { open: openNewNoteDialog } = useNewNoteDialogStore()

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
    }
  }

  const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      e.preventDefault()
      onCloseTab(tabId)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-9 w-full shrink-0 items-center justify-between border-b border-ns-border-soft bg-ns-panel/80 px-2.5 backdrop-blur-md select-none">
        {/* Scrollable Tabs List */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-0.5"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                className={cn(
                  'group relative flex h-7 max-w-[180px] min-w-[100px] cursor-pointer items-center justify-between gap-1.5 rounded-md px-2 text-xs transition-all',
                  isActive
                    ? 'border border-ns-border-md bg-ns-surface font-medium text-white shadow-xs'
                    : 'text-ns-ghost hover:border-ns-border-soft hover:bg-ns-hover/40 hover:text-ns-text'
                )}
                title={tab.title}
              >
                {/* Note Icon & Title */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                  {tab.isPinned ? (
                    <Pin
                      size={10}
                      className="shrink-0 rotate-45 fill-ns-primary-lt text-ns-primary-lt"
                    />
                  ) : (
                    <FileText
                      size={11}
                      className={cn(
                        'shrink-0',
                        isActive ? 'text-ns-primary-lt' : 'text-ns-ghost'
                      )}
                    />
                  )}
                  <span className="truncate text-[0.72rem]">{tab.title}</span>
                </div>

                {/* Actions: Pin & Close */}
                <div className="flex shrink-0 items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onTogglePinTab(tab.id)
                        }}
                        className={cn(
                          'flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-opacity',
                          tab.isPinned
                            ? 'opacity-90 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-60 hover:opacity-100!'
                        )}
                        aria-label={
                          tab.isPinned ? 'Unpin note tab' : 'Pin note tab'
                        }
                      >
                        <Pin
                          size={9}
                          className={
                            tab.isPinned
                              ? 'fill-ns-primary-lt text-ns-primary-lt'
                              : 'text-ns-ghost'
                          }
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{tab.isPinned ? 'Unpin tab' : 'Pin tab'}</p>
                    </TooltipContent>
                  </Tooltip>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseTab(tab.id)
                    }}
                    className={cn(
                      'flex h-4 w-4 cursor-pointer items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover hover:text-white',
                      isActive
                        ? 'opacity-80 hover:opacity-100'
                        : 'opacity-0 group-hover:opacity-80 hover:opacity-100!'
                    )}
                    aria-label="Close note tab"
                  >
                    <X size={10} />
                  </button>
                </div>

                {/* Active Indicator Underline */}
                {isActive && (
                  <span className="absolute right-1.5 bottom-0 left-1.5 h-0.5 rounded-full bg-ns-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                )}
              </div>
            )
          })}

          {/* Plus (+) New Note Button inside this Folder */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => openNewNoteDialog()}
                className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                aria-label="New Note in Folder"
              >
                <Plus size={13} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Note in this folder</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Quick Split View / Compare Toggle */}
        {tabs.length > 1 && onChangeViewMode && (
          <div className="flex shrink-0 items-center pl-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    onChangeViewMode(viewMode === 'split' ? 'edit' : 'split')
                  }
                  className={cn(
                    'flex h-6.5 items-center gap-1 rounded-md px-2 text-[0.68rem] font-medium transition-all',
                    viewMode === 'split'
                      ? 'bg-ns-primary/20 text-ns-primary-lt'
                      : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                  )}
                >
                  <SplitSquareVertical size={12} />
                  <span>Compare</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle side-by-side comparison</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
