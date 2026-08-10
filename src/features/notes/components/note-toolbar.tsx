import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquareCode,
  Minus,
  PanelLeft,
  Quote,
  RotateCcw,
  RotateCw,
  Sparkles,
  Strikethrough,
  TableIcon,
  Type,
  Underline,
} from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core'

import type { ActiveFormats, ActiveFormatKey } from './use-note-editor'

const BLOCK_TYPES = [
  { id: 'paragraph', label: 'Paragraph', icon: Type },
  { id: 'h1', label: 'Heading 1', icon: Heading1 },
  { id: 'h2', label: 'Heading 2', icon: Heading2 },
  { id: 'h3', label: 'Heading 3', icon: Heading3 },
  { id: 'quote', label: 'Quote', icon: Quote },
  { id: 'code', label: 'Code Block', icon: Code2 },
]

interface NoteToolbarProps {
  selectedBlockType: string
  activeFormats: ActiveFormats
  onToggleSidebar: () => void
  onToggleFormat: (fmt: ActiveFormatKey) => void
  onSelectBlockType: (id: string) => void
}

export function NoteToolbar({
  selectedBlockType,
  activeFormats,
  onToggleSidebar,
  onToggleFormat,
  onSelectBlockType,
}: NoteToolbarProps) {
  const selectedBlockObj =
    BLOCK_TYPES.find((b) => b.id === selectedBlockType) ?? BLOCK_TYPES[0]
  const SelectedBlockIcon = selectedBlockObj.icon

  return (
    <div className="relative flex shrink-0 items-center justify-between border-b border-ns-border-soft bg-ns-panel/90 px-2 py-1.5 backdrop-blur-md sm:px-4">
      {/* Scrollable tool items */}
      <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-0.5 whitespace-nowrap sm:gap-1.5">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ns-ghost hover:bg-ns-hover hover:text-white md:hidden"
          title="Toggle sidebar"
        >
          <PanelLeft size={14} />
        </button>

        {/* Undo / Redo */}
        <div className="flex shrink-0 items-center gap-0.5 border-r border-ns-border-soft/60 pr-1.5">
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Block type selector */}
        <div className="shrink-0 border-r border-ns-border-soft/60 pr-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-ns-border-soft bg-ns-bg/40 px-2 text-xs font-medium text-ns-text transition-all hover:bg-ns-hover focus:outline-none"
              >
                <SelectedBlockIcon size={13} className="text-ns-primary-lt" />
                <span className="hidden sm:inline">
                  {selectedBlockObj.label}
                </span>
                <ChevronDown size={12} className="text-ns-ghost" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="z-ns-dropdown w-44 rounded-lg border border-ns-border-soft bg-ns-panel p-1 shadow-2xl backdrop-blur-xl dark:border-ns-border-soft dark:bg-ns-panel"
            >
              {BLOCK_TYPES.map((type) => {
                const Icon = type.icon
                const isSelected = selectedBlockType === type.id
                return (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => onSelectBlockType(type.id)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                      isSelected
                        ? 'bg-ns-primary/30 font-semibold text-ns-primary-lt dark:bg-ns-primary/30 dark:text-ns-primary-lt'
                        : 'text-ns-text hover:bg-ns-hover hover:text-white dark:text-ns-text'
                    )}
                  >
                    <Icon
                      size={13}
                      className={
                        isSelected ? 'text-ns-primary-lt' : 'text-ns-ghost'
                      }
                    />
                    <span>{type.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Inline formatting */}
        <div className="flex items-center gap-0.5 border-r border-ns-border-soft/60 pr-1.5">
          {(
            [
              { fmt: 'bold', icon: Bold, title: 'Bold (Ctrl+B)' },
              { fmt: 'italic', icon: Italic, title: 'Italic (Ctrl+I)' },
              {
                fmt: 'underline',
                icon: Underline,
                title: 'Underline (Ctrl+U)',
              },
              {
                fmt: 'strikethrough',
                icon: Strikethrough,
                title: 'Strikethrough',
              },
              { fmt: 'code', icon: Code2, title: 'Inline Code' },
            ] as const
          ).map(({ fmt, icon: Icon, title }) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onToggleFormat(fmt)}
              className={cn(
                'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                activeFormats[fmt]
                  ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                  : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
              )}
              title={title}
            >
              <Icon size={13} />
            </button>
          ))}
          {/* Highlight — distinct active color */}
          <button
            type="button"
            onClick={() => onToggleFormat('highlight')}
            className={cn(
              'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
              activeFormats.highlight
                ? 'bg-amber-500/30 font-bold text-amber-300'
                : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
            )}
            title="Highlight text"
          >
            <Highlighter size={13} />
          </button>
        </div>

        {/* Alignment & lists (hidden on mobile) */}
        <div className="hidden items-center gap-0.5 border-r border-ns-border-soft/60 pr-1.5 sm:flex">
          {(
            [
              { icon: AlignLeft, title: 'Align Left' },
              { icon: AlignCenter, title: 'Align Center' },
              { icon: AlignRight, title: 'Align Right' },
              { icon: List, title: 'Bullet List' },
              { icon: ListOrdered, title: 'Numbered List' },
              { icon: CheckSquare, title: 'Checklist' },
            ] as const
          ).map(({ icon: Icon, title }) => (
            <button
              key={title}
              type="button"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
              title={title}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>

        {/* Insert tools */}
        <div className="flex items-center gap-0.5">
          {(
            [
              { icon: Link2, title: 'Insert Link' },
              { icon: ImageIcon, title: 'Insert Image' },
              { icon: TableIcon, title: 'Insert Table' },
              { icon: MessageSquareCode, title: 'Insert Callout' },
              { icon: Minus, title: 'Horizontal Divider' },
            ] as const
          ).map(({ icon: Icon, title }) => (
            <button
              key={title}
              type="button"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
              title={title}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Engine status badge */}
      <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-emerald-400 lg:flex">
        <Sparkles size={11} className="animate-pulse" />
        <span>Lexical Host Ready</span>
      </div>
    </div>
  )
}
