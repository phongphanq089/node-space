import {
  Columns,
  Edit3,
  Eye,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  X,
} from 'lucide-react'
import type { NODES, NoteItem } from '@/shared/mocks/mock-data'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/core/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/core/breadcrumb'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface NoteDetailHeaderProps {
  node: NodeWithThumbnail
  selectedNote: NoteItem
  sidebarOpen: boolean
  isFocusMode: boolean
  viewMode: 'edit' | 'preview' | 'split'
  onToggleSidebar: () => void
  onToggleFocusMode: () => void
  onChangeViewMode: (mode: 'edit' | 'preview' | 'split') => void
  onClose: () => void
}

export function NoteDetailHeader({
  node,
  selectedNote,
  sidebarOpen,
  isFocusMode,
  viewMode,
  onToggleSidebar,
  onToggleFocusMode,
  onChangeViewMode,
  onClose,
}: NoteDetailHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-ns-border-soft bg-ns-panel/90 px-3 py-2.5 backdrop-blur-md sm:px-5">
      {/* Left Info & Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <Button
          onClick={onToggleSidebar}
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-ns-ghost hover:bg-ns-hover hover:text-white"
          title={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
          aria-label={sidebarOpen ? 'Hide notes list' : 'Show notes list'}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={16} />
          ) : (
            <PanelLeftOpen size={16} />
          )}
        </Button>

        {node.thumbnail ? (
          <img
            src={node.thumbnail}
            alt={node.title}
            className="h-7 w-7 shrink-0 rounded border border-ns-border-soft object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-ns-border-soft bg-gradient-to-br from-ns-active to-ns-hover text-xs font-bold text-white shadow-sm">
            N
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Breadcrumb className="truncate">
            <BreadcrumbList className="flex-nowrap text-xs font-medium">
              <BreadcrumbItem className="hidden max-w-[140px] shrink-0 truncate sm:inline-flex">
                <BreadcrumbLink
                  href="#"
                  className="truncate text-ns-muted hover:text-white"
                >
                  {node.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden shrink-0 sm:inline-flex" />
              <BreadcrumbItem className="min-w-0 truncate">
                <BreadcrumbPage className="truncate font-semibold text-white">
                  {selectedNote.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-0.5 hidden items-center gap-2 text-[0.625rem] text-ns-muted sm:flex">
            {node.tag && (
              <span
                className="font-bold tracking-wide uppercase"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            )}
            <span>{selectedNote.updated}</span>
            {selectedNote.starred && (
              <Star
                size={10}
                fill="#fbbf24"
                className="shrink-0 text-amber-400"
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Controls & View Modes */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* View Mode Switcher Pills */}
        <div className="flex items-center rounded-lg border border-ns-border-soft bg-ns-bg/60 p-0.5 shadow-inner">
          <button
            type="button"
            onClick={() => onChangeViewMode('edit')}
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-all',
              viewMode === 'edit'
                ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
            )}
            title="Edit Mode"
          >
            <Edit3 size={13} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('preview')}
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-all',
              viewMode === 'preview'
                ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
            )}
            title="Preview Mode"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('split')}
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-all',
              viewMode === 'split'
                ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt shadow-xs'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
            )}
            title="Split Mode"
          >
            <Columns size={13} />
            <span className="hidden md:inline">Split</span>
          </button>
        </div>

        <div className="mx-1 hidden h-4 w-px bg-ns-border-soft sm:block" />

        {/* Focus Mode Toggle */}
        <Button
          onClick={onToggleFocusMode}
          variant="outline"
          size="icon-xs"
          className="text-ns-ghost hover:text-white"
          title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
        >
          {isFocusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </Button>

        {/* More options */}
        <Button
          variant="outline"
          size="icon-xs"
          className="hidden text-ns-ghost hover:text-white sm:flex"
          title="More options"
        >
          <MoreHorizontal size={14} />
        </Button>

        {/* Close Button */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={onClose}
          className="text-ns-ghost hover:bg-red-500/20 hover:text-red-400"
          title="Close note"
        >
          <X size={15} />
        </Button>
      </div>
    </header>
  )
}
