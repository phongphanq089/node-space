import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  Columns,
  Edit3,
  Eye,
  FileText,
  Folder,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Plus,
  X,
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import type { NODES } from '@/shared/mocks/mock-data'
import { cn } from '@/shared/lib/utils'
import { useDragScroll } from '@/shared/lib/use-drag-scroll'
import { Button } from '@/shared/ui/core/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'
import type { NoteTab } from './folder-note-tabs-bar'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface NoteDetailHeaderProps {
  node: NodeWithThumbnail
  tabs: NoteTab[]
  activeTabId: string | null
  sidebarOpen: boolean
  isFocusMode: boolean
  viewMode: 'edit' | 'preview' | 'split'
  onToggleSidebar: () => void
  onToggleFocusMode: () => void
  onChangeViewMode: (mode: 'edit' | 'preview' | 'split') => void
  onSelectTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  onTogglePinTab: (tabId: string) => void
  onClose: () => void
  onNewNote?: () => void
  onEditActiveNote?: () => void
  onDeleteActiveNote?: () => void
}

export function NoteDetailHeader({
  node,
  tabs,
  activeTabId,
  sidebarOpen,
  isFocusMode,
  viewMode,
  onToggleSidebar,
  onToggleFocusMode,
  onChangeViewMode,
  onSelectTab,
  onCloseTab,
  onTogglePinTab,
  onClose,
  onNewNote,
  onEditActiveNote,
  onDeleteActiveNote,
}: NoteDetailHeaderProps) {
  const { containerRef, isDragging, shouldCancelClick, dragEvents } =
    useDragScroll<HTMLDivElement>()
  const { open: openNewNoteDialog } = useNewNoteDialogStore()

  const handleTabClick = (tabId: string) => {
    if (shouldCancelClick()) return
    onSelectTab(tabId)
  }

  const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      e.preventDefault()
      onCloseTab(tabId)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="flex h-11 shrink-0 items-center justify-between gap-1.5 border-b border-ns-border-soft bg-ns-surface-alt/90 px-2.5 backdrop-blur-md select-none dark:border-white/10 dark:bg-[#0c0a15]/95">
        <div className="flex shrink-0 items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/workspace/folder"
                className="flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-ns-border/80 bg-ns-surface text-ns-primary shadow-xs transition-all hover:scale-105 hover:border-ns-primary/50 hover:bg-ns-primary/10 dark:border-white/15 dark:bg-white/5 dark:text-ns-primary-lt dark:hover:border-white/30 dark:hover:bg-white/10"
                aria-label="Back to Folders"
              >
                <Folder
                  size={14}
                  className="text-ns-primary dark:text-ns-primary-lt"
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Back to Folders ({node.title})</p>
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={onToggleSidebar}
            variant="ghost"
            size="icon-xs"
            className="h-7.5 w-7.5 shrink-0 rounded-lg text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            title={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
            aria-label={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
          </Button>

          <div className="mx-0.5 hidden h-4 w-px shrink-0 bg-ns-border-soft sm:block dark:bg-white/10" />
        </div>

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
          <AnimatePresence initial={false}>
            {tabs.map((tab, index) => {
              const isActive = tab.id === activeTabId
              const nextTab = tabs[index + 1]
              const showDivider =
                !isActive && nextTab && nextTab.id !== activeTabId

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
                      isActive
                        ? 'z-10 rounded-t-xl border-x border-t border-ns-border-md bg-ns-surface font-bold text-ns-text shadow-xs dark:border-white/15 dark:bg-[#161426] dark:text-white'
                        : 'rounded-t-lg font-medium text-ns-muted hover:bg-ns-hover/60 hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100'
                    )}
                    title={tab.title}
                  >
                    {/* Active Tab Top Highlight */}
                    {isActive && (
                      <span className="absolute top-0 right-2 left-2 h-[2px] rounded-full bg-ns-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                    )}

                    {/* Note Icon & Title */}
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
                            isActive
                              ? 'text-ns-primary dark:text-ns-primary-lt'
                              : 'text-ns-muted group-hover:text-ns-text dark:text-zinc-400 dark:group-hover:text-zinc-200'
                          )}
                        />
                      )}
                      <span className="truncate text-xs">{tab.title}</span>
                    </div>

                    {/* Actions: Pin & Close */}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          onCloseTab(tab.id)
                        }}
                        className={cn(
                          'flex h-4 w-4 cursor-pointer items-center justify-center rounded text-ns-muted transition-all hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white',
                          isActive
                            ? 'opacity-80 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-80 hover:opacity-100!'
                        )}
                        aria-label="Close note tab"
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
        </div>

        {/* Right: Fixed Tab Controls & Global Action Buttons (Always visible, never scrolled) */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Plus (+) New Note Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => (onNewNote ? onNewNote() : openNewNoteDialog())}
                className="flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ns-muted transition-colors hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="New Note in Folder"
              >
                <Plus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Note in this folder</p>
            </TooltipContent>
          </Tooltip>

          {/* More Tabs (...) Dropdown Menu Button */}
          {tabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ns-muted transition-colors hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                  title="Tab actions & list"
                >
                  <MoreHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-2xl border border-ns-border-soft bg-ns-surface/95 p-1.5 text-ns-text shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121118]/95 dark:text-white"
              >
                <DropdownMenuLabel className="px-2 py-1 text-[0.7rem] font-bold tracking-wider text-ns-muted uppercase dark:text-zinc-400">
                  Open Tabs ({tabs.length})
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-ns-border-soft dark:bg-white/10" />

                <div className="no-scrollbar max-h-48 overflow-y-auto">
                  {tabs.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => onSelectTab(t.id)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors',
                        t.id === activeTabId
                          ? 'bg-ns-primary/10 font-bold text-ns-primary dark:bg-white/10 dark:text-white'
                          : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText
                          size={12}
                          className="flex-shrink-0 text-ns-primary"
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                      {t.isPinned && (
                        <Pin
                          size={10}
                          className="flex-shrink-0 fill-ns-primary text-ns-primary"
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator className="my-1 bg-ns-border-soft dark:bg-white/10" />

                <DropdownMenuItem
                  onClick={() =>
                    onNewNote ? onNewNote() : openNewNoteDialog()
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-ns-primary hover:bg-ns-primary/10 dark:text-ns-primary-lt dark:hover:bg-white/10"
                >
                  <Plus size={13} />
                  <span>New Note in Folder</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="mx-0.5 h-3.5 w-px shrink-0 bg-ns-border-soft dark:bg-white/10" />

          {/* View Mode Switcher Pills */}
          <div className="flex items-center rounded-xl border border-ns-border-soft bg-ns-surface p-0.5 shadow-inner dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => onChangeViewMode('edit')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-0.5 text-[0.68rem] font-semibold whitespace-nowrap transition-all sm:px-2',
                viewMode === 'edit'
                  ? 'bg-ns-primary/20 text-ns-primary shadow-xs dark:bg-ns-primary/30 dark:text-ns-primary-lt'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:text-white'
              )}
              title="Edit Mode"
            >
              <Edit3 size={11} />
              <span className="hidden lg:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('preview')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-0.5 text-[0.68rem] font-semibold whitespace-nowrap transition-all sm:px-2',
                viewMode === 'preview'
                  ? 'bg-ns-primary/20 text-ns-primary shadow-xs dark:bg-ns-primary/30 dark:text-ns-primary-lt'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:text-white'
              )}
              title="Preview Mode"
            >
              <Eye size={11} />
              <span className="hidden lg:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('split')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-0.5 text-[0.68rem] font-semibold whitespace-nowrap transition-all sm:px-2',
                viewMode === 'split'
                  ? 'bg-ns-primary/20 text-ns-primary shadow-xs dark:bg-ns-primary/30 dark:text-ns-primary-lt'
                  : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:text-white'
              )}
              title="Split Mode"
            >
              <Columns size={11} />
              <span className="hidden lg:inline">Split</span>
            </button>
          </div>

          {/* Active Note Actions (Edit Properties & Delete) */}
          {activeTabId && (
            <div className="flex items-center gap-0.5 border-l border-ns-border-soft pl-1 dark:border-white/10">
              {onEditActiveNote && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={onEditActiveNote}
                      className="text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Edit Note Properties"
                    >
                      <Pencil size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit Note Properties</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onDeleteActiveNote && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={onDeleteActiveNote}
                      className="text-ns-muted hover:bg-red-500/10 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                      aria-label="Delete Note"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Delete Note</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleFocusMode}
            className="text-ns-muted hover:bg-ns-hover hover:text-ns-text dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="text-ns-muted hover:bg-red-500/10 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            title="Back to Folders"
          >
            <X size={14} />
          </Button>
        </div>
      </header>
    </TooltipProvider>
  )
}
