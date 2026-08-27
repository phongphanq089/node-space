import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { Folder, FileText, X, Plus, Pin } from 'lucide-react'
import { useNoteTabsStore } from '@/features/notes'
import { useNewNoteDialogStore } from '@/features/notes/store/use-new-note-dialog-store'
import { cn } from '@/shared/lib/utils'
import { useDragScroll } from '@/shared/lib/use-drag-scroll'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'

export function WorkspaceTabsBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { containerRef, isDragging, shouldCancelClick, dragEvents } =
    useDragScroll<HTMLDivElement>()

  const { tabs, activeTabId, closeTab, togglePinTab } = useNoteTabsStore()

  const isFoldersActive =
    location.pathname === '/workspace/folder' ||
    location.pathname === '/workspace/folder/' ||
    location.pathname === '/workspace' ||
    location.pathname === '/workspace/'

  const handleTabClick = (tabId: string) => {
    if (shouldCancelClick()) return
    navigate({ to: `/workspace/folder/${tabId}` as any })
  }

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    e.preventDefault()
    closeTab(tabId, (nextTabId) => {
      if (nextTabId) {
        navigate({ to: `/workspace/folder/${nextTabId}` as any })
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
          navigate({ to: `/workspace/folder/${nextTabId}` as any })
        } else {
          navigate({ to: '/workspace/folder' })
        }
      })
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-11 w-full shrink-0 items-center justify-between border-b border-ns-border-soft bg-ns-surface-alt/90 px-2.5 backdrop-blur-md select-none dark:border-white/10 dark:bg-[#0c0a15]/95">
        {/* Scrollable Tabs List with Drag-to-Scroll */}
        <div
          ref={containerRef}
          {...dragEvents}
          className={cn(
            'no-scrollbar flex min-w-0 flex-1 items-end gap-0.5 overflow-x-auto pt-1',
            isDragging
              ? 'cursor-grabbing! select-none [&_*]:cursor-grabbing! [&_*]:select-none'
              : 'cursor-grab'
          )}
        >
          {/* Permanent Folders Tab */}
          <Link
            to="/workspace/folder"
            className={cn(
              'group relative flex h-8.5 items-center gap-1.5 px-3 text-xs font-semibold transition-all',
              isDragging ? 'cursor-grabbing select-none' : 'cursor-pointer',
              isFoldersActive
                ? 'z-10 rounded-t-xl border-x border-t border-ns-border-md bg-ns-surface font-bold text-ns-text shadow-xs dark:border-white/15 dark:bg-[#161426] dark:text-white'
                : 'rounded-t-lg font-medium text-ns-muted hover:bg-ns-hover/60 hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100'
            )}
          >
            {isFoldersActive && (
              <span className="absolute top-0 right-2 left-2 h-[2px] rounded-full bg-ns-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
            )}
            <Folder
              size={13}
              className={cn(
                'shrink-0 transition-colors',
                isFoldersActive
                  ? 'text-ns-primary dark:text-ns-primary-lt'
                  : 'text-ns-muted group-hover:text-ns-text dark:text-zinc-400 dark:group-hover:text-zinc-200'
              )}
            />
            <span className="truncate whitespace-nowrap">Folders</span>
          </Link>

          <div className="mx-0.5 h-3.5 w-px shrink-0 bg-ns-border-soft dark:bg-white/10" />

          {/* Dynamic Note Tabs with Motion */}
          <AnimatePresence initial={false}>
            {tabs.map((tab, index) => {
              const isTabActive =
                location.pathname === `/workspace/folder/${tab.id}` ||
                activeTabId === tab.id
              const nextTab = tabs[index + 1]
              const showDivider =
                !isTabActive && nextTab && nextTab.id !== activeTabId

              return (
                <div key={tab.id} className="flex shrink-0 items-center">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    onClick={() => handleTabClick(tab.id)}
                    onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                    className={cn(
                      'group relative flex h-8.5 max-w-[200px] min-w-[100px] items-center justify-between gap-2 px-3 text-xs transition-all',
                      isDragging
                        ? 'cursor-grabbing select-none'
                        : 'cursor-pointer',
                      isTabActive
                        ? 'z-10 rounded-t-xl border-x border-t border-ns-border-md bg-ns-surface font-bold text-ns-text shadow-xs dark:border-white/15 dark:bg-[#161426] dark:text-white'
                        : 'rounded-t-lg font-medium text-ns-muted hover:bg-ns-hover/60 hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100'
                    )}
                    title={tab.title}
                  >
                    {/* Active Tab Top Highlight */}
                    {isTabActive && (
                      <span className="absolute top-0 right-2 left-2 h-[2px] rounded-full bg-ns-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                    )}

                    {/* Left icon + Title */}
                    <div className="pointer-events-none flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                      {tab.isPinned ? (
                        <Pin
                          size={11}
                          className="shrink-0 rotate-45 fill-ns-primary text-ns-primary dark:fill-ns-primary-lt dark:text-ns-primary-lt"
                        />
                      ) : (
                        <FileText
                          size={12}
                          className={cn(
                            'shrink-0 transition-colors',
                            isTabActive
                              ? 'text-ns-primary dark:text-ns-primary-lt'
                              : 'text-ns-muted group-hover:text-ns-text dark:text-zinc-400 dark:group-hover:text-zinc-200'
                          )}
                        />
                      )}
                      <span className="truncate text-xs">{tab.title}</span>
                    </div>

                    {/* Right Tab Actions: Pin toggle & Close */}
                    <div
                      className="flex shrink-0 items-center gap-0.5"
                      data-no-drag="true"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePinTab(tab.id)
                            }}
                            className={cn(
                              'flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-opacity',
                              tab.isPinned
                                ? 'opacity-90 hover:opacity-100'
                                : 'opacity-0 group-hover:opacity-60 hover:opacity-100!'
                            )}
                            aria-label={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
                          >
                            <Pin
                              size={10}
                              className={
                                tab.isPinned
                                  ? 'fill-ns-primary text-ns-primary dark:fill-ns-primary-lt dark:text-ns-primary-lt'
                                  : 'text-ns-muted dark:text-zinc-400'
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
                          'flex h-4 w-4 cursor-pointer items-center justify-center rounded text-ns-muted transition-all hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white',
                          isTabActive
                            ? 'opacity-80 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-80 hover:opacity-100!'
                        )}
                        aria-label="Close tab"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Vertical separator between inactive tabs */}
                  {showDivider && (
                    <div className="mx-0.5 h-3.5 w-px shrink-0 bg-ns-border-soft dark:bg-white/10" />
                  )}
                </div>
              )
            })}
          </AnimatePresence>

          {/* Plus (+) New Note Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => useNewNoteDialogStore.getState().open()}
                className="flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ns-muted transition-colors hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
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
