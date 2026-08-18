import { useRef } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, Folder, FileText, X, Plus, Pin } from 'lucide-react'
import { useNoteTabsStore } from '@/features/notes'
import { useNewNoteDialogStore } from '@/features/notes/store/use-new-note-dialog-store'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'

export function WorkspaceTabsBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const { tabs, activeTabId, closeTab, togglePinTab } = useNoteTabsStore()

  const isHomeActive =
    location.pathname === '/workspace' || location.pathname === '/workspace/'
  const isFoldersActive = location.pathname.startsWith('/workspace/folder')

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
    }
  }

  const handleTabClick = (tabId: string) => {
    navigate({ to: `/workspace/notes/${tabId}` as any })
  }

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    e.preventDefault()
    closeTab(tabId, (nextTabId) => {
      if (nextTabId) {
        navigate({ to: `/workspace/notes/${nextTabId}` as any })
      } else {
        navigate({ to: '/workspace/folder' })
      }
    })
  }

  const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      e.preventDefault()
      closeTab(tabId, (nextTabId) => {
        if (nextTabId) {
          navigate({ to: `/workspace/notes/${nextTabId}` as any })
        } else {
          navigate({ to: '/workspace/folder' })
        }
      })
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-10 w-full shrink-0 items-center justify-between border-b border-ns-border/70 bg-ns-panel/75 px-3 backdrop-blur-md select-none">
        {/* Scrollable Tabs List */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1"
        >
          {/* Permanent Home / Dashboard Tab */}
          <Link
            to="/workspace"
            className={cn(
              'group relative flex h-7.5 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all',
              isHomeActive
                ? 'bg-ns-primary/15 font-semibold text-ns-primary-lt shadow-xs'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-ns-text'
            )}
          >
            <LayoutDashboard
              size={13}
              className={cn(
                'shrink-0 transition-colors',
                isHomeActive
                  ? 'text-ns-primary-lt'
                  : 'text-ns-ghost group-hover:text-white'
              )}
            />
            <span className="truncate whitespace-nowrap">Dashboard</span>
            {isHomeActive && (
              <span className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-ns-primary" />
            )}
          </Link>

          {/* Permanent Folders Tab */}
          <Link
            to="/workspace/folder"
            className={cn(
              'group relative flex h-7.5 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all',
              isFoldersActive
                ? 'bg-ns-primary/15 font-semibold text-ns-primary-lt shadow-xs'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-ns-text'
            )}
          >
            <Folder
              size={13}
              className={cn(
                'shrink-0 transition-colors',
                isFoldersActive
                  ? 'text-ns-primary-lt'
                  : 'text-ns-ghost group-hover:text-white'
              )}
            />
            <span className="truncate whitespace-nowrap">Folders</span>
            {isFoldersActive && (
              <span className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-ns-primary" />
            )}
          </Link>

          <div className="mx-1 h-3.5 w-px shrink-0 bg-ns-border/60" />

          {/* Dynamic Note Tabs */}
          {tabs.map((tab) => {
            const isTabActive =
              !isHomeActive &&
              (location.pathname === `/workspace/notes/${tab.id}` ||
                activeTabId === tab.id)

            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                className={cn(
                  'group relative flex h-7.5 max-w-[200px] min-w-[110px] cursor-pointer items-center justify-between gap-1.5 rounded-lg px-2.5 text-xs transition-all',
                  isTabActive
                    ? 'border border-ns-border-md bg-ns-surface font-medium text-white shadow-xs'
                    : 'text-ns-ghost hover:border-ns-border-soft hover:bg-ns-hover/40 hover:text-ns-text'
                )}
                title={tab.title}
              >
                {/* Left icon + Title */}
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                  {tab.isPinned ? (
                    <Pin
                      size={11}
                      className="shrink-0 rotate-45 fill-ns-primary-lt text-ns-primary-lt"
                    />
                  ) : (
                    <FileText
                      size={12}
                      className={cn(
                        'shrink-0',
                        isTabActive ? 'text-ns-primary-lt' : 'text-ns-ghost'
                      )}
                    />
                  )}
                  <span className="truncate text-xs">{tab.title}</span>
                </div>

                {/* Right Tab Actions: Pin toggle & Close */}
                <div className="flex shrink-0 items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePinTab(tab.id)
                        }}
                        className={cn(
                          'flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded transition-opacity',
                          tab.isPinned
                            ? 'opacity-80 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-60 hover:opacity-100!'
                        )}
                        aria-label={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
                      >
                        <Pin
                          size={10}
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
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className={cn(
                      'flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover hover:text-white',
                      isTabActive
                        ? 'opacity-80 hover:opacity-100'
                        : 'opacity-0 group-hover:opacity-80 hover:opacity-100!'
                    )}
                    aria-label="Close tab"
                  >
                    <X size={11} />
                  </button>
                </div>

                {/* Active Underline indicator */}
                {isTabActive && (
                  <span className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-ns-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
              </div>
            )
          })}

          {/* Plus (+) New Note Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => useNewNoteDialogStore.getState().open()}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                aria-label="New Note"
              >
                <Plus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Note</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
