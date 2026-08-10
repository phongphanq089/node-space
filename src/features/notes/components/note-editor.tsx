import { useState } from 'react'
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
  Table as TableIcon,
  Type,
  Underline,
} from 'lucide-react'
import type { NoteItem } from '@/shared/constants/moc-data'

import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'

interface NoteEditorProps {
  note: NoteItem
  content: string
  viewMode: 'edit' | 'preview' | 'split'
  isFocusMode: boolean
  onContentChange: (value: string) => void
  onChangeViewMode: (mode: 'edit' | 'preview' | 'split') => void
  onToggleSidebar: () => void
}

const BLOCK_TYPES = [
  { id: 'paragraph', label: 'Paragraph', icon: Type },
  { id: 'h1', label: 'Heading 1', icon: Heading1 },
  { id: 'h2', label: 'Heading 2', icon: Heading2 },
  { id: 'h3', label: 'Heading 3', icon: Heading3 },
  { id: 'quote', label: 'Quote', icon: Quote },
  { id: 'code', label: 'Code Block', icon: Code2 },
]

export function NoteEditor({
  note,
  content,
  viewMode,
  isFocusMode,
  onContentChange,
  onToggleSidebar,
}: NoteEditorProps) {
  const [selectedBlockType, setSelectedBlockType] = useState('paragraph')
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    highlight: false,
  })

  // Format stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const toggleFormat = (fmt: string) => {
    setActiveFormats((prev) => ({ ...prev, [fmt]: !prev[fmt] }))
  }

  const selectedBlockObj =
    BLOCK_TYPES.find((b) => b.id === selectedBlockType) ?? BLOCK_TYPES[0]
  const SelectedBlockIcon = selectedBlockObj.icon

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-ns-bg/40 text-ns-text">
      {/* ── Lexical Toolbar Bar ──────────────────────────────────────── */}
      {viewMode !== 'preview' && (
        <div className="relative flex shrink-0 items-center justify-between border-b border-ns-border-soft bg-ns-panel/90 px-2 py-1.5 backdrop-blur-md sm:px-4">
          {/* Scrollable Tool Items Container */}
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-0.5 whitespace-nowrap sm:gap-1.5">
            {/* Quick sidebar button on mobile */}
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

            {/* Block Type Dropdown Selector via Radix Portal */}
            <div className="shrink-0 border-r border-ns-border-soft/60 pr-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-ns-border-soft bg-ns-bg/40 px-2 text-xs font-medium text-ns-text transition-all hover:bg-ns-hover focus:outline-none"
                  >
                    <SelectedBlockIcon
                      size={13}
                      className="text-ns-primary-lt"
                    />
                    <span className="hidden sm:inline">
                      {selectedBlockObj.label}
                    </span>
                    <ChevronDown size={12} className="text-ns-ghost" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={6}
                  className="z-[150] w-44 rounded-lg border border-ns-border-soft bg-ns-panel p-1 shadow-2xl backdrop-blur-xl dark:border-ns-border-soft dark:bg-ns-panel"
                >
                  {BLOCK_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedBlockType === type.id
                    return (
                      <DropdownMenuItem
                        key={type.id}
                        onClick={() => setSelectedBlockType(type.id)}
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

            {/* Inline Formatting Tools */}
            <div className="flex items-center gap-0.5 border-r border-ns-border-soft/60 pr-1.5">
              <button
                type="button"
                onClick={() => toggleFormat('bold')}
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                  activeFormats.bold
                    ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                    : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                )}
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat('italic')}
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                  activeFormats.italic
                    ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                    : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                )}
                title="Italic (Ctrl+I)"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat('underline')}
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                  activeFormats.underline
                    ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                    : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                )}
                title="Underline (Ctrl+U)"
              >
                <Underline size={13} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat('strikethrough')}
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                  activeFormats.strikethrough
                    ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                    : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                )}
                title="Strikethrough"
              >
                <Strikethrough size={13} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat('code')}
                className={cn(
                  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                  activeFormats.code
                    ? 'bg-ns-primary/30 font-bold text-ns-primary-lt'
                    : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                )}
                title="Inline Code"
              >
                <Code2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => toggleFormat('highlight')}
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

            {/* Alignments & Lists */}
            <div className="hidden items-center gap-0.5 border-r border-ns-border-soft/60 pr-1.5 sm:flex">
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Align Center"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Bullet List"
              >
                <List size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Numbered List"
              >
                <ListOrdered size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Checklist"
              >
                <CheckSquare size={13} />
              </button>
            </div>

            {/* Insert Tools */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Insert Link"
              >
                <Link2 size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Insert Image"
              >
                <ImageIcon size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Insert Table"
              >
                <TableIcon size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Insert Callout"
              >
                <MessageSquareCode size={13} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
                title="Horizontal Divider"
              >
                <Minus size={13} />
              </button>
            </div>
          </div>

          {/* Lexical Ready Status Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-emerald-400 lg:flex">
            <Sparkles size={11} className="animate-pulse" />
            <span>Lexical Host Ready</span>
          </div>
        </div>
      )}

      {/* ── Editor Canvas Workspace ──────────────────────────────────── */}
      <div className="relative no-scrollbar flex flex-1 overflow-y-auto p-3 sm:p-6 md:p-10">
        <div
          className={cn(
            'mx-auto w-full transition-all duration-300',
            viewMode === 'split' ? 'max-w-7xl' : 'max-w-4xl'
          )}
        >
          <div
            className={cn(
              'relative flex min-h-[550px] flex-col rounded-xl border border-ns-border-soft/60 bg-ns-panel/40 p-5 shadow-2xl backdrop-blur-md sm:p-8 md:p-12',
              viewMode === 'split'
                ? 'grid grid-cols-1 gap-6 lg:grid-cols-2'
                : ''
            )}
          >
            {/* Note Title & Header Metadata */}
            <div className={cn(viewMode === 'split' ? 'lg:col-span-2' : '')}>
              <input
                type="text"
                value={note.title}
                readOnly
                className="w-full bg-transparent text-2xl font-extrabold text-white outline-none placeholder:text-ns-ghost sm:text-3xl md:text-4xl"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ns-muted">
                <span className="rounded-full bg-ns-active/80 px-2.5 py-0.5 text-[0.65rem] font-semibold text-ns-primary-lt">
                  {note.updated}
                </span>
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-ns-border-soft bg-ns-hover/40 px-2 py-0.5 text-[0.65rem] text-ns-ghost"
                  >
                    {t}
                  </span>
                ))}
                <span className="text-[0.65rem] text-ns-ghost">
                  • {wordCount} words
                </span>
                <span className="text-[0.65rem] text-ns-ghost">
                  • ~{readingTime} min read
                </span>
              </div>

              <div className="my-5 h-px w-full bg-gradient-to-r from-ns-border-soft via-ns-border-soft/50 to-transparent" />
            </div>

            {/* Editor Canvas (Lexical Host Slot) */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div
                id="lexical-editor-container"
                data-lexical-host="true"
                className="relative flex flex-1 flex-col rounded-lg border border-ns-border-soft/40 bg-ns-bg/30 p-4 transition-all focus-within:border-ns-primary/50 focus-within:ring-1 focus-within:ring-ns-primary/30 sm:p-6"
              >
                <div className="mb-2 flex items-center justify-between text-[0.65rem] font-semibold tracking-wider text-ns-ghost uppercase">
                  <span>Lexical Canvas Container</span>
                  <span className="text-emerald-400">ContentEditable Host</span>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  placeholder="Type '/' for Lexical commands or start writing your note content..."
                  className="custom-scrollbar w-full flex-1 resize-none bg-transparent font-mono text-sm leading-relaxed text-ns-text outline-none placeholder:text-ns-ghost/70"
                />

                <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/40 pt-2.5 text-[0.625rem] text-ns-ghost">
                  <span>Slash commands ready (`/`)</span>
                  <span>Lexical State Tree Ready</span>
                </div>
              </div>
            )}

            {/* Preview Canvas */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="relative flex flex-1 flex-col rounded-lg border border-ns-border-soft/40 bg-ns-panel/60 p-4 sm:p-6">
                <div className="mb-3 flex items-center justify-between text-[0.65rem] font-semibold tracking-wider text-ns-primary-lt uppercase">
                  <span>Live Render Preview</span>
                  <span className="text-ns-ghost">Markdown / HTML</span>
                </div>

                <div className="prose max-w-none flex-1 overflow-y-auto font-sans text-sm leading-relaxed text-ns-text prose-invert">
                  {content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('# ')) {
                      return (
                        <h1
                          key={idx}
                          className="mb-3 text-2xl font-bold text-white"
                        >
                          {paragraph.replace('# ', '')}
                        </h1>
                      )
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2
                          key={idx}
                          className="mt-4 mb-2 text-xl font-semibold text-ns-primary-lt"
                        >
                          {paragraph.replace('## ', '')}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n- ')
                      return (
                        <ul
                          key={idx}
                          className="my-2 list-inside list-disc space-y-1 text-ns-text/90"
                        >
                          {items.map((it, i) => (
                            <li key={i}>{it.replace('- ', '')}</li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={idx} className="mb-3 text-ns-text/90">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status & Footer Bar ──────────────────────────────────────── */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-ns-border-soft bg-ns-panel/90 px-4 py-2 text-[0.65rem] text-ns-muted backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
            Lexical Engine Ready
          </span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>

        <div className="flex items-center gap-3">
          {isFocusMode ? (
            <span className="text-amber-300">Focus Mode Active</span>
          ) : (
            <span className="text-ns-ghost">Press ESC to exit modal</span>
          )}
          <span>•</span>
          <span className="text-ns-ghost">Auto-saved local draft</span>
        </div>
      </footer>
    </main>
  )
}
