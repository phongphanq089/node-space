import { cn } from '@/shared/lib/utils'
import type { NoteItem } from '@/shared/mocks/mock-data'
import type { ViewMode } from './use-note-editor'

interface NoteCanvasProps {
  note: NoteItem
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
  return (
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
            viewMode === 'split' ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : ''
          )}
        >
          {/* Title & metadata */}
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
                â€¢ {wordCount} words
              </span>
              <span className="text-[0.65rem] text-ns-ghost">
                â€¢ ~{readingTime} min read
              </span>
            </div>

            <div className="my-5 h-px w-full bg-gradient-to-r from-ns-border-soft via-ns-border-soft/50 to-transparent" />
          </div>

          {/* Edit canvas (Lexical host slot) */}
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

          {/* Preview canvas */}
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
  )
}
