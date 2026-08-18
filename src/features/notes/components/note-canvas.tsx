import { cn } from '@/shared/lib/utils'
import type { NoteItem } from '@/shared/mocks/mock-data'
import type { ViewMode } from './use-note-editor'

interface NoteCanvasProps {
  note?: NoteItem | null
  content: string
  viewMode: ViewMode
  wordCount: number
  readingTime: number
  onContentChange: (value: string) => void
}

export function NoteCanvas({
  note,
  content,
  viewMode,
  wordCount,
  readingTime,
  onContentChange,
}: NoteCanvasProps) {
  const displayTitle = note?.title || 'Untitled Note'
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
        {/* Note header: title + meta */}
        <div className="mb-8">
          <input
            type="text"
            value={displayTitle}
            readOnly
            className="w-full bg-transparent text-3xl leading-tight font-bold text-white outline-none placeholder:text-ns-ghost sm:text-4xl md:text-[2.75rem]"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ns-muted">
            <span className="rounded-full bg-ns-active/80 px-2.5 py-0.5 text-[0.65rem] font-semibold text-ns-primary-lt">
              {displayUpdated}
            </span>

            {displayTags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-ns-border-soft bg-ns-hover/40 px-2 py-0.5 text-[0.65rem] text-ns-ghost"
              >
                {t}
              </span>
            ))}

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
