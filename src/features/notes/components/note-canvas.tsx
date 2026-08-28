import { useState, useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { NoteItem } from '../types'
import type { ViewMode } from './use-note-editor'

interface NoteCanvasProps {
  note?: NoteItem | null
  content: string
  viewMode: ViewMode
  wordCount: number
  readingTime: number
  onContentChange: (value: string) => void
  onTitleChange?: (title: string) => void
  onAddTag?: (tag: string) => void
  onRemoveTag?: (tag: string) => void
}

export function NoteCanvas({
  note,
  content,
  viewMode,
  wordCount,
  readingTime,
  onContentChange,
  onTitleChange,
  onAddTag,
  onRemoveTag,
}: NoteCanvasProps) {
  const [title, setTitle] = useState(note?.title || 'Untitled Note')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  const tagInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTitle(note?.title || 'Untitled Note')
  }, [note?.id, note?.title])

  useEffect(() => {
    if (isAddingTag) {
      tagInputRef.current?.focus()
    }
  }, [isAddingTag])

  const handleTitleBlur = () => {
    const trimmed = title.trim()
    const finalTitle = trimmed || 'Untitled Note'
    if (finalTitle !== title) {
      setTitle(finalTitle)
    }
    if (onTitleChange) {
      onTitleChange(finalTitle)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const handleAddTagSubmit = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '')
    if (trimmed && onAddTag) {
      onAddTag(trimmed)
    }
    setNewTagInput('')
    setIsAddingTag(false)
  }

  const displayUpdated = note?.updated || 'Draft'
  const displayTags = note?.tags || []

  return (
    <div className="relative no-scrollbar flex flex-1 overflow-y-auto">
      <div
        className={cn(
          'mx-auto w-full px-4 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16',
          viewMode === 'split' ? 'max-w-7xl' : 'max-w-3xl'
        )}
      >
        {/* Note header: editable title + meta */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              onTitleChange?.(e.target.value)
            }}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled Note"
            className="w-full rounded-lg bg-transparent text-3xl leading-tight font-bold text-white transition-colors outline-none placeholder:text-ns-ghost/50 hover:bg-ns-hover/20 focus:bg-ns-surface/30 focus:px-2 focus:ring-1 focus:ring-ns-primary/30 sm:text-4xl md:text-[2.75rem]"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ns-muted">
            <span className="rounded-full bg-ns-active/80 px-2.5 py-0.5 text-[0.65rem] font-semibold text-ns-primary-lt">
              {displayUpdated}
            </span>

            {/* Tags Badges */}
            {displayTags.map((t) => (
              <span
                key={t}
                className="group/tag inline-flex items-center gap-1 rounded-md border border-ns-border-soft bg-ns-hover/40 px-2 py-0.5 text-[0.65rem] text-ns-ghost transition-colors hover:border-ns-border hover:text-white"
              >
                <span>#{t}</span>
                {onRemoveTag && (
                  <button
                    type="button"
                    onClick={() => onRemoveTag(t)}
                    className="opacity-0 transition-opacity group-hover/tag:opacity-100 hover:text-red-400"
                    title={`Remove tag #${t}`}
                  >
                    <X size={10} />
                  </button>
                )}
              </span>
            ))}

            {/* Optional Inline Tag Adder */}
            {onAddTag && (
              <>
                {isAddingTag ? (
                  <div className="inline-flex items-center gap-1 rounded-md border border-ns-primary/40 bg-ns-surface/80 px-2 py-0.5 shadow-xs">
                    <span className="text-[0.65rem] text-ns-primary-lt">#</span>
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTagSubmit()
                        if (e.key === 'Escape') setIsAddingTag(false)
                      }}
                      onBlur={handleAddTagSubmit}
                      placeholder="tag…"
                      className="w-16 bg-transparent text-[0.65rem] text-white outline-none placeholder:text-ns-ghost"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingTag(true)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-dashed border-ns-border-soft/80 px-2 py-0.5 text-[0.65rem] text-ns-ghost/70 transition-all hover:border-ns-primary/40 hover:bg-ns-hover/30 hover:text-ns-primary-lt"
                    title="Add optional tag"
                  >
                    <Plus size={10} />
                    <span>Tag</span>
                  </button>
                )}
              </>
            )}

            <span className="text-[0.65rem] text-ns-ghost/60">
              {wordCount} words · ~{readingTime} min read
            </span>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-ns-border-soft/70 via-ns-border-soft/30 to-transparent" />
        </div>

        {/* Editor area */}
        <div
          className={cn(
            'flex gap-6',
            viewMode === 'split' ? 'flex-col lg:flex-row' : 'flex-col'
          )}
        >
          {/* Lexical editor host slot */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div
              id="lexical-editor-container"
              data-lexical-host="true"
              className={cn(
                'flex flex-1 flex-col',
                viewMode === 'split' && 'lg:w-1/2'
              )}
            >
              <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                placeholder="Start writing… (Lexical editor will mount here)"
                className="no-scrollbar min-h-[60vh] w-full flex-1 resize-none bg-transparent font-sans text-base leading-8 text-ns-text/90 outline-none placeholder:text-ns-ghost/40"
              />
            </div>
          )}

          {/* Preview panel */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={cn(
                'flex flex-1 flex-col',
                viewMode === 'split' &&
                  'border-t border-ns-border-soft/30 pt-6 lg:w-1/2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6'
              )}
            >
              <div className="mb-4 text-[0.65rem] font-semibold tracking-widest text-ns-primary-lt/70 uppercase">
                Preview
              </div>
              <div className="prose max-w-none flex-1 font-sans text-sm leading-relaxed text-ns-text/90 prose-invert">
                {content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1
                        key={idx}
                        className="mb-4 text-2xl font-bold text-white"
                      >
                        {paragraph.replace('# ', '')}
                      </h1>
                    )
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={idx}
                        className="mt-5 mb-2 text-xl font-semibold text-ns-primary-lt"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3
                        key={idx}
                        className="mt-4 mb-1.5 text-base font-semibold text-ns-text"
                      >
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n- ')
                    return (
                      <ul
                        key={idx}
                        className="my-3 list-inside list-disc space-y-1.5 text-ns-text/80"
                      >
                        {items.map((it, i) => (
                          <li key={i}>{it.replace(/^- /, '')}</li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={idx} className="mb-3 text-ns-text/80">
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
  )
}
