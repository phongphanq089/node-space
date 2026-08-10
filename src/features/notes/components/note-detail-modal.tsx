/* eslint-disable import/consistent-type-specifier-style */
import { useEffect, useState } from 'react'
import { Minimize2 } from 'lucide-react'
import { NOTES, type NODES, type NoteItem } from '@/shared/constants/moc-data'
import { NoteDetailHeader } from './note-detail-header'
import { NotesSidebar } from './notes-sidebar'
import { NoteEditor } from './note-editor'

interface NodeDetailModalProps {
  node: (typeof NODES)[number] & { thumbnail?: string }
  onClose: () => void
}

const MOCK_CONTENT: Record<string, string> = {
  'Key Features': `# Key Features\n\nThis node contains the key features of the Node-based Note System.\n\n## Core Capabilities\n\n- **Bi-directional links** between notes\n- **Graph visualization** of all connections\n- **Lexical.dev integration** with rich WYSIWYG capabilities\n- **Focus mode** for distraction-free writing\n\n## Design Philosophy\n\nEvery note is a node. Every node can connect to any other node, creating a web of knowledge that grows organically over time.`,
  'Technologies Used': `# Technologies Used\n\n## Frontend\n\n- **React 19** with TanStack Router\n- **TailwindCSS v4** for layout & styling\n- **Lexical.dev Engine** (Host Canvas Ready)\n- **Zustand** for global state management\n- **shadcn/ui** component primitives\n\n## Backend\n\n- **TanStack Start** (SSR framework)\n- **Cloudflare Workers** for edge deployment\n- **Nitro** as server engine`,
  'Development Roadmap': `# Development Roadmap\n\n## Phase 1 — Core ✅\n- [x] Node & Note CRUD\n- [x] Lexical layout canvas integration\n- [x] Music player integration\n\n## Phase 2 — In Progress 🚧\n- [ ] Graph view\n- [ ] Real-time collaboration\n- [ ] Mobile app\n\n## Phase 3 — Planned\n- [ ] AI-powered note suggestions\n- [ ] Export to PDF/Notion`,
  default: `# Untitled Note\n\nStart writing your note here...\n\nThis is a **rich text / Lexical-ready** editor layout with support for:\n- *italic text*\n- **bold text**\n- \`inline code\`\n- [links](https://example.com)\n\n## Heading Example\n\nYour content goes here. Type '/' to invoke Lexical slash commands...`,
}

export function NoteDetailModal({ node, onClose }: NodeDetailModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedNote, setSelectedNote] = useState<NoteItem>(NOTES[0])
  const [content, setContent] = useState<string>(
    MOCK_CONTENT[NOTES[0].title] ?? MOCK_CONTENT.default
  )
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')

  // Body scroll lock & Escape key handling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFocusMode) {
          setIsFocusMode(false)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, isFocusMode])

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note)
    setContent(MOCK_CONTENT[note.title] ?? MOCK_CONTENT.default)
    // Auto-close sidebar drawer on mobile for seamless reading
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-ns-bg/98 text-ns-text backdrop-blur-xl selection:bg-ns-primary/30">
      {/* Top Navigation Header (Hidden during Focus Mode) */}
      {!isFocusMode && (
        <NoteDetailHeader
          node={node}
          selectedNote={selectedNote}
          sidebarOpen={sidebarOpen}
          isFocusMode={isFocusMode}
          viewMode={viewMode}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onToggleFocusMode={() => setIsFocusMode((v) => !v)}
          onChangeViewMode={setViewMode}
          onClose={onClose}
        />
      )}

      {/* Floating Exit Focus Mode Button */}
      {isFocusMode && (
        <button
          type="button"
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 z-50 flex cursor-pointer items-center gap-1.5 rounded-full border border-ns-border bg-ns-panel/90 px-3.5 py-1.5 text-xs font-medium text-ns-primary-lt shadow-xl backdrop-blur-md transition-all hover:bg-ns-hover hover:text-white"
          title="Exit Focus Mode (Esc)"
        >
          <Minimize2 size={13} />
          <span>Exit Focus Mode</span>
        </button>
      )}

      {/* Main Container */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Mobile Backdrop for Notes Sidebar */}
        {!isFocusMode && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Notes Sidebar Drawer / Panel */}
        {!isFocusMode && (
          <NotesSidebar
            open={sidebarOpen}
            notes={NOTES}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Note Editor Workspace */}
        <NoteEditor
          note={selectedNote}
          content={content}
          viewMode={viewMode}
          isFocusMode={isFocusMode}
          onContentChange={setContent}
          onChangeViewMode={setViewMode}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
      </div>
    </div>
  )
}
