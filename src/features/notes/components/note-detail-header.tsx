import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
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
} from 'lucide-react'
import type { NODES } from '@/shared/mocks/mock-data'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/core/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'
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
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-ns-border-soft bg-ns-panel/95 px-3 py-1.5 backdrop-blur-md select-none">
        {/* Left: Sidebar Toggle + Back to Folders button + Folder Name */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            onClick={onToggleSidebar}
            variant="ghost"
            size="icon-xs"
            className="shrink-0 text-ns-ghost hover:bg-ns-hover hover:text-white"
            title={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
            aria-label={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={15} />
            ) : (
              <PanelLeftOpen size={15} />
            )}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/workspace/folder"
                className="flex h-7 items-center gap-1.5 rounded-lg border border-ns-border-soft/60 bg-ns-bg/50 px-2 text-xs font-medium text-ns-ghost transition-all hover:border-ns-primary/40 hover:bg-ns-hover hover:text-white"
              >
                <ArrowLeft size={13} className="text-ns-ghost" />
                <Folder size={13} className="text-ns-primary-lt" />
                <span className="max-w-[110px] truncate font-semibold text-white sm:max-w-[150px]">
                  {node.title}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Back to Folders</p>
            </TooltipContent>
          </Tooltip>

          <div className="mx-1 hidden h-4 w-px shrink-0 bg-ns-border-soft sm:block" />
        </div>

        {/* Center: Integrated Note Tabs Strip with Motion */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-0.5"
        >
          <AnimatePresence initial={false}>
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId

              return (
                <motion.div
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 3 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: -3 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onClick={() => onSelectTab(tab.id)}
                  onMouseDown={(e) => handleMiddleClick(e, tab.id)}
                  className={cn(
                    'group relative flex h-7.5 max-w-[170px] min-w-[90px] cursor-pointer items-center justify-between gap-1.5 rounded-md px-2 text-xs transition-all',
                    !isActive &&
                      'text-ns-ghost hover:border-ns-border-soft hover:bg-ns-hover/40 hover:text-ns-text',
                    isActive && 'font-medium text-white'
                  )}
                  title={tab.title}
                >
                  {/* Animated Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="noteDetailActiveTabBg"
                      className="absolute inset-0 rounded-md border border-ns-border-md bg-ns-surface/90 shadow-xs"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Note Icon & Title */}
                  <div className="relative z-10 flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                    {tab.isPinned ? (
                      <Pin
                        size={10}
                        className="shrink-0 rotate-45 fill-ns-primary-lt text-ns-primary-lt"
                      />
                    ) : (
                      <FileText
                        size={11}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-ns-primary-lt' : 'text-ns-ghost'
                        )}
                      />
                    )}
                    <span className="truncate text-[0.72rem]">{tab.title}</span>
                  </div>

                  {/* Actions: Pin & Close */}
                  <div className="relative z-10 flex shrink-0 items-center gap-0.5">
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

                  {/* Active Indicator Underline with Motion */}
                  {isActive && (
                    <motion.span
                      layoutId="noteDetailActiveTabUnderline"
                      className="absolute right-1.5 bottom-0 left-1.5 h-0.5 rounded-full bg-ns-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Plus (+) New Note Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => (onNewNote ? onNewNote() : openNewNoteDialog())}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-colors hover:bg-ns-hover hover:text-white"
                aria-label="New Note in Folder"
              >
                <Plus size={13} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New Note in this folder</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: View Modes Switcher + Focus Mode + Close Button */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {/* View Mode Switcher Pills */}
          <div className="hidden items-center rounded-md border border-ns-border-soft bg-ns-bg/60 p-0.5 shadow-inner sm:flex">
            <button
              type="button"
              onClick={() => onChangeViewMode('edit')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap transition-all',
                viewMode === 'edit'
                  ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                  : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
              )}
              title="Edit Mode"
            >
              <Edit3 size={11} />
              <span className="hidden md:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('preview')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap transition-all',
                viewMode === 'preview'
                  ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                  : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
              )}
              title="Preview Mode"
            >
              <Eye size={11} />
              <span className="hidden md:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('split')}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[0.68rem] font-medium whitespace-nowrap transition-all',
                viewMode === 'split'
                  ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                  : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
              )}
              title="Split Mode"
            >
              <Columns size={11} />
              <span className="hidden md:inline">Split</span>
            </button>
          </div>

          {/* Active Note Actions (Edit Properties & Delete) */}
          {activeTabId && (
            <div className="flex items-center gap-0.5 border-l border-ns-border-soft pl-1">
              {onEditActiveNote && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={onEditActiveNote}
                      className="text-ns-ghost hover:bg-ns-hover hover:text-white"
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
                      className="text-ns-ghost hover:bg-red-500/20 hover:text-red-400"
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

          {/* Focus Mode Button */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleFocusMode}
            className="text-ns-ghost hover:bg-ns-hover hover:text-white"
            title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </Button>

          {/* Close Folder Button */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="text-ns-ghost hover:bg-red-500/20 hover:text-red-400"
            title="Back to Folders"
          >
            <X size={14} />
          </Button>
        </div>
      </header>
    </TooltipProvider>
  )
}
