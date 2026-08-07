/* eslint-disable import/consistent-type-specifier-style */
import { useState } from 'react'
import { NOTES, type NODES, type NoteItem } from '@/constants/moc-data'
import { NoteDetailHeader } from './note-detail-header'
import { NotesSidebar } from './notes-sidebar'
import { NoteEditor } from './note-editor'

interface NodeDetailModalProps {
  node: (typeof NODES)[number] & { thumbnail?: string }
  onClose: () => void
}

const MOCK_CONTENT: Record<string, string> = {
  'Key Features': `# Key Features\n\nThis node contains the key features of the Node-based Note System.\n\n## Core Capabilities\n\n- **Bi-directional links** between notes\n- **Graph visualization** of all connections\n- **Markdown support** with live preview\n- **Focus mode** for distraction-free writing\n\n## Design Philosophy\n\nEvery note is a node. Every node can connect to any other node, creating a web of knowledge that grows organically over time.`,
  'Technologies Used': `# Technologies Used\n\n## Frontend\n\n- **React 19** with TanStack Router\n- **TailwindCSS v4** for styling\n- **Zustand** for global state\n- **shadcn/ui** component library\n\n## Backend\n\n- **TanStack Start** (SSR framework)\n- **Cloudflare Workers** for edge deployment\n- **Nitro** as server engine`,
  'Development Roadmap': `# Development Roadmap\n\n## Phase 1 — Core ✅\n- [x] Node & Note CRUD\n- [x] Markdown editor\n- [x] Music player integration\n\n## Phase 2 — In Progress 🚧\n- [ ] Graph view\n- [ ] Real-time collaboration\n- [ ] Mobile app\n\n## Phase 3 — Planned\n- [ ] AI-powered note suggestions\n- [ ] Export to PDF/Notion`,
  default: `# Untitled Note\n\nStart writing your note here...\n\nThis is a **markdown** editor with support for:\n- *italic text*\n- **bold text**\n- \`inline code\`\n- [links](https://example.com)\n\n## Heading Example\n\nYour content goes here.`,
}

export function NoteDetailModal({ node, onClose }: NodeDetailModalProps) {
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
      <NoteDetailHeader
        node={node}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onClose={onClose}
      />

      <div className="flex flex-1 overflow-hidden">
        <NotesSidebar
          open={sidebarOpen}
          notes={NOTES}
          selectedNote={selectedNote}
          onSelectNote={handleSelectNote}
        />

        <NoteEditor
          note={selectedNote}
          content={content}
          onContentChange={setContent}
        />
      </div>
    </div>
  )
}
