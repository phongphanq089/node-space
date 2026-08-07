import { Bold, Code2, Heading2, Italic, Link2 } from 'lucide-react'
import type { NoteItem } from '@/constants/moc-data'

const TOOLBAR_TOOLS = [
  { icon: Heading2, title: 'Heading' },
  { icon: Bold, title: 'Bold' },
  { icon: Italic, title: 'Italic' },
  { icon: Code2, title: 'Code' },
  { icon: Link2, title: 'Link' },
]

interface NoteEditorProps {
  note: NoteItem
  content: string
  onContentChange: (value: string) => void
}

// Very simple line-by-line markdown renderer
function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-invert">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# '))
          return (
            <h1
              key={i}
              className="mt-0 mb-3 text-xl font-extrabold text-ns-text"
            >
              {line.slice(2)}
            </h1>
          )
        if (line.startsWith('## '))
          return (
            <h2
              key={i}
              className="mt-4 mb-2 text-base font-bold text-ns-text-2"
            >
              {line.slice(3)}
            </h2>
          )
        if (line.startsWith('- [x] '))
          return (
            <li
              key={i}
              className="ml-4 text-xs leading-6 text-ns-muted line-through opacity-60"
            >
              {line.slice(6)}
            </li>
          )
        if (line.startsWith('- [ ] '))
          return (
            <li key={i} className="ml-4 text-xs leading-6 text-ns-muted">
              {line.slice(6)}
            </li>
          )
        if (line.startsWith('- '))
          return (
            <li key={i} className="ml-4 text-xs leading-6 text-ns-muted">
              {line.slice(2)}
            </li>
          )
        if (line === '') return <br key={i} />
        return (
          <p key={i} className="text-xs leading-6 text-ns-muted">
            {line}
          </p>
        )
      })}
    </div>
  )
}

export function NoteEditor({
  note,
  content,
  onContentChange,
}: NoteEditorProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-ns-border-soft bg-ns-panel/60 px-4 py-2 backdrop-blur-sm">
        <span className="mr-2 truncate text-xs font-bold text-ns-text">
          {note.title}
        </span>
        <div className="mx-2 h-4 w-px bg-ns-border-soft" />
        {TOOLBAR_TOOLS.map(({ icon: Icon, title }) => (
          <button
            key={title}
            title={title}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover hover:text-ns-primary-lt"
          >
            <Icon size={13} />
          </button>
        ))}
        <div className="flex-1" />
        <span className="rounded border border-ns-border-soft/50 bg-ns-active/40 px-2 py-0.5 text-[0.55rem] font-semibold text-ns-faint">
          Markdown · Auto-saved
        </span>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Raw markdown editor */}
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
          className="flex-1 resize-none border-0 bg-transparent p-6 font-mono text-sm leading-7 text-ns-text-2 placeholder-ns-placeholder outline-none selection:bg-ns-primary/20"
          placeholder="Start writing your note in Markdown..."
          style={{ fontFamily: "'Geist Variable', 'Courier New', monospace" }}
        />

        {/* Divider */}
        <div className="w-px bg-ns-border-soft" />

        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <MarkdownPreview content={content} />
        </div>
      </div>
    </div>
  )
}
