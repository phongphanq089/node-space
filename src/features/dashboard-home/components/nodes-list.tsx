import { useState } from 'react'
import { NODES, NOTES } from '@/constants/moc-data'
import type { NoteItem } from '@/constants/moc-data'
import {
  Search,
  Plus,
  Star,
  MessageSquare,
  ArrowUpRight,
  Edit2,
  Trash2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  MoreHorizontal,
  Bold,
  Italic,
  Code2,
  Link2,
  Heading2,
} from 'lucide-react'

// ── Node Detail Modal ─────────────────────────────────────────────
interface NodeDetailModalProps {
  node: (typeof NODES)[number] & { thumbnail?: string }
  onClose: () => void
}

const MOCK_CONTENT: Record<string, string> = {
  'Key Features': `# Key Features\n\nThis node contains the key features of the Node-based Note System.\n\n## Core Capabilities\n\n- **Bi-directional links** between notes\n- **Graph visualization** of all connections\n- **Markdown support** with live preview\n- **Focus mode** for distraction-free writing\n\n## Design Philosophy\n\nEvery note is a node. Every node can connect to any other node, creating a web of knowledge that grows organically over time.`,
  'Technologies Used': `# Technologies Used\n\n## Frontend\n\n- **React 19** with TanStack Router\n- **TailwindCSS v4** for styling\n- **Zustand** for global state\n- **shadcn/ui** component library\n\n## Backend\n\n- **TanStack Start** (SSR framework)\n- **Cloudflare Workers** for edge deployment\n- **Nitro** as server engine`,
  'Development Roadmap': `# Development Roadmap\n\n## Phase 1 — Core ✅\n- [x] Node & Note CRUD\n- [x] Markdown editor\n- [x] Music player integration\n\n## Phase 2 — In Progress 🚧\n- [ ] Graph view\n- [ ] Real-time collaboration\n- [ ] Mobile app\n\n## Phase 3 — Planned\n- [ ] AI-powered note suggestions\n- [ ] Export to PDF/Notion`,
  default: `# ${Math.random()}\n\nStart writing your note here...\n\nThis is a **markdown** editor with support for:\n- *italic text*\n- **bold text**\n- \`inline code\`\n- [links](https://example.com)\n\n## Heading Example\n\nYour content goes here.`,
}

function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedNote, setSelectedNote] = useState<NoteItem>(NOTES[0])
  const [content, setContent] = useState(
    MOCK_CONTENT[NOTES[0].title] ?? MOCK_CONTENT.default
  )

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note)
    setContent(MOCK_CONTENT[note.title] ?? MOCK_CONTENT.default)
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-ns-bg/98 backdrop-blur-xl">
      {/* Modal Header */}
      <div className="flex items-center gap-3 border-b border-ns-border-soft px-5 py-3">
        {/* Node info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {node.thumbnail && (
            <img
              src={node.thumbnail}
              alt={node.title}
              className="h-8 w-8 flex-shrink-0 rounded-lg border border-ns-border object-cover"
            />
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-extrabold text-ns-text">
              {node.title}
            </h2>
            <div className="mt-0.5 flex items-center gap-2">
              {node.tag && (
                <span
                  className="text-[0.58rem] font-bold tracking-wider uppercase"
                  style={{ color: node.tagColor }}
                >
                  {node.tag}
                </span>
              )}
              <span className="text-[0.58rem] text-ns-faint">
                · {node.updated}
              </span>
              <span className="flex items-center gap-1 text-[0.58rem] text-ns-faint">
                <MessageSquare size={9} />
                {node.count} notes
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover"
            title={sidebarOpen ? 'Hide notes panel' : 'Show notes panel'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
          </button>
          <button
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover"
            title="Edit node"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="hover:text-ns-primary-lt flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover"
            title="More options"
          >
            <MoreHorizontal size={14} />
          </button>
          <div className="mx-1 h-5 w-px bg-ns-border-soft" />
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-red-500/10 hover:text-red-400"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Notes Sidebar (collapsible) ── */}
        <div
          className={`flex flex-col overflow-hidden border-r border-ns-border-soft bg-ns-panel transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-64 min-w-[256px]' : 'w-0 min-w-0'
          }`}
        >
          <div className="flex items-center justify-between border-b border-ns-border-soft px-3 py-2.5">
            <span className="text-[0.6rem] font-bold tracking-wider text-ns-muted uppercase">
              Notes
            </span>
            <span className="text-ns-primary-lt rounded-full bg-ns-active px-1.5 py-0.5 text-[0.55rem] font-bold">
              {NOTES.length}
            </span>
          </div>
          <div className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
            {NOTES.map((note) => {
              const isActive = note.title === selectedNote.title
              return (
                <button
                  key={note.title}
                  onClick={() => handleSelectNote(note)}
                  className={`group flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    isActive
                      ? 'border-ns-border-em bg-gradient-to-br from-ns-active/40 to-ns-hover/10'
                      : 'border-transparent hover:bg-ns-hover/40'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg shadow-inner transition-colors ${
                      isActive
                        ? 'bg-ns-primary/20 text-ns-primary-lt'
                        : 'bg-ns-active/60 text-ns-ghost'
                    }`}
                  >
                    <FileText size={12} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`truncate text-xs font-bold ${isActive ? 'text-ns-primary-lt' : 'text-ns-text'}`}
                      >
                        {note.title}
                      </p>
                      {note.starred && (
                        <Star
                          size={10}
                          fill="#fbbf24"
                          className="flex-shrink-0 text-amber-400"
                        />
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-ns-primary-lt rounded border border-ns-border/30 bg-ns-hover/60 px-1 py-0.5 text-[0.52rem] font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[0.55rem] text-ns-faint">
                      {note.updated}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          {/* Add note button */}
          <div className="border-t border-ns-border-soft p-2">
            <button className="hover:border-ns-primary/40 hover:text-ns-primary-lt flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ns-border-soft py-2 text-[0.65rem] font-bold text-ns-ghost transition-all">
              <Plus size={12} />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* ── Right: Note Editor ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center gap-1 border-b border-ns-border-soft bg-ns-panel/60 px-4 py-2 backdrop-blur-sm">
            <span className="mr-2 truncate text-xs font-bold text-ns-text">
              {selectedNote.title}
            </span>
            <div className="mx-2 h-4 w-px bg-ns-border-soft" />
            {[
              { icon: Heading2, title: 'Heading' },
              { icon: Bold, title: 'Bold' },
              { icon: Italic, title: 'Italic' },
              { icon: Code2, title: 'Code' },
              { icon: Link2, title: 'Link' },
            ].map(({ icon: Icon, title }) => (
              <button
                key={title}
                title={title}
                className="hover:text-ns-primary-lt flex h-6 w-6 cursor-pointer items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover"
              >
                <Icon size={13} />
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-[0.58rem] font-medium text-ns-faint">
              Markdown · Auto-saved
            </span>
          </div>

          {/* Editor Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Raw markdown editor */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              className="selection:bg-ns-primary/20 flex-1 resize-none border-0 bg-transparent p-6 font-mono text-sm leading-7 text-ns-text-2 placeholder-ns-placeholder outline-none"
              placeholder="Start writing your note in Markdown..."
              style={{
                fontFamily: "'Geist Variable', 'Courier New', monospace",
              }}
            />
            {/* Divider */}
            <div className="w-px bg-ns-border-soft" />
            {/* Preview pane */}
            <div className="flex-1 overflow-y-auto p-6">
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
                  if (line.startsWith('- '))
                    return (
                      <li
                        key={i}
                        className="ml-4 text-xs leading-6 text-ns-muted"
                      >
                        {line.slice(2)}
                      </li>
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
                      <li
                        key={i}
                        className="ml-4 text-xs leading-6 text-ns-muted"
                      >
                        {line.slice(6)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── All Nodes List ────────────────────────────────────────────────
type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

export default function NodesList() {
  const [nodes, setNodes] = useState<NodeWithThumbnail[]>(() =>
    NODES.map((n) => ({ ...n }))
  )
  const [selectedNode, setSelectedNode] = useState<NodeWithThumbnail | null>(
    null
  )
  const [search, setSearch] = useState('')

  const toggleStar = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    setNodes((prev) =>
      prev.map((n) => (n.title === title ? { ...n, starred: !n.starred } : n))
    )
  }

  const filteredNodes = nodes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* ── Header Controls ── */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ns-border bg-ns-panel px-3 py-2 transition-all focus-within:border-ns-border-md">
          <Search size={13} className="flex-shrink-0 text-ns-ghost" />
          <input
            type="search"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
          />
        </div>
        <button className="from-ns-primary shadow-ns-primary/10 flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r to-ns-secondary px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-90">
          <Plus size={13} />
          <span className="hidden sm:inline">New Node</span>
        </button>
      </div>

      {/* ── Nodes Grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredNodes.map((node) => (
          <div
            key={node.title}
            onClick={() => setSelectedNode(node)}
            className="group hover:shadow-ns-primary/5 relative flex cursor-pointer flex-col gap-3 rounded-xl border border-ns-border bg-ns-panel p-4 shadow-sm transition-all hover:border-ns-border-md hover:shadow-md"
          >
            {/* Top: thumbnail + title + star */}
            <div className="flex items-start gap-3">
              {node.thumbnail ? (
                <img
                  src={node.thumbnail}
                  alt={node.title}
                  className="h-10 w-10 flex-shrink-0 rounded-lg border border-ns-border object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ns-active to-ns-hover text-sm font-bold text-white">
                  N
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="group-hover:text-ns-primary-lt line-clamp-2 text-xs font-bold text-ns-text transition-colors">
                    {node.title}
                  </h3>
                  <button
                    onClick={(e) => toggleStar(e, node.title)}
                    className="flex-shrink-0 cursor-pointer rounded p-0.5 transition-all hover:bg-ns-hover/80"
                    title={node.starred ? 'Unstar' : 'Star'}
                  >
                    <Star
                      size={12}
                      fill={node.starred ? '#fbbf24' : 'none'}
                      className={
                        node.starred ? 'text-amber-400' : 'text-ns-ghost'
                      }
                    />
                  </button>
                </div>
                <span className="text-[0.6rem] text-ns-faint">
                  {node.updated}
                </span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 rounded border border-ns-border/30 bg-ns-input/60 px-2 py-0.5 text-[0.58rem] font-bold text-ns-muted">
                <MessageSquare size={9} />
                {node.count} notes
              </span>
              {node.tag && (
                <span
                  className="text-[0.6rem] font-bold tracking-wider uppercase"
                  style={{ color: node.tagColor }}
                >
                  {node.tag}
                </span>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-ns-border-soft pt-2.5">
              <span className="text-ns-primary-lt flex cursor-pointer items-center gap-1 text-[0.65rem] font-bold transition-colors hover:text-white">
                View details
                <ArrowUpRight size={11} />
              </span>
              <div className="flex gap-0.5">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer rounded p-1 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-ns-text-2"
                  title="Edit"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer rounded p-1 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  )
}
