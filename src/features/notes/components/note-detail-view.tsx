import { useEffect, useState, useMemo } from 'react'
import { Minimize2, FileText, Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { NODES } from '@/shared/mocks/mock-data'
import { NoteDetailHeader } from './note-detail-header'
import { NotesSidebar } from './notes-sidebar'
import { NoteEditor } from './note-editor'
import { NewNotePanel } from './new-note-panel'
import type { NoteTab } from './folder-note-tabs-bar'
import { Button, EmptyState } from '@/shared/ui'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'
import { useNoteTabsStore } from '../store/use-note-tabs-store'
import {
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useTogglePinNoteMutation,
} from '../hooks/use-notes'
import type { NoteItem } from '@/shared/mocks/mock-data'
import type { NewNoteValues } from '../note.validate'

const MOCK_CONTENT: Record<string, string> = {
  default: `# Untitled Note\n\nStart writing your note here...\n\nThis is a **rich text / Lexical-ready** editor layout with support for:\n- *italic text*\n- **bold text**\n- \`inline code\`\n- [links](https://example.com)\n\n## Heading Example\n\nYour content goes here. Type '/' to invoke Lexical slash commands...`,
}

interface NoteDetailViewProps {
  noteId: string
}

export function NoteDetailView({ noteId }: NoteDetailViewProps) {
  const navigate = useNavigate()
  const { open: openNewNoteDialog } = useNewNoteDialogStore()

  // Find node/folder by id or title matching
  const node = useMemo(() => {
    const decodedId = decodeURIComponent(noteId)
    const found = NODES.find(
      (n) =>
        n.title.toLowerCase().replace(/\s+/g, '-') ===
          decodedId.toLowerCase() ||
        n.title.toLowerCase() === decodedId.toLowerCase()
    )

    if (found) {
      return {
        ...found,
        thumbnail:
          found.thumbnail ??
          'https://images.unsplash.com/photo-1517842645767-c639042777db?w=150&auto=format&fit=crop&q=60',
      }
    }

    return {
      title: decodedId,
      count: 0,
      updated: 'Recently',
      folderId: decodedId,
      folderName: decodedId,
      thumbnail: undefined,
    }
  }, [noteId])

  const folderKey = node.folderId || node.title

  // Folder-scoped tabs persisted in localStorage via Zustand store
  const {
    folderTabsMap,
    openNoteTab,
    closeNoteTab,
    setActiveNoteTab,
    togglePinNoteTab,
  } = useNoteTabsStore()

  const currentFolderTabsData = folderTabsMap[folderKey] ?? {
    tabs: [],
    activeTabId: null,
  }

  const openNoteTabs: NoteTab[] = currentFolderTabsData.tabs
  const activeTabId = currentFolderTabsData.activeTabId

  // Fetch server notes for this folder
  const { data: serverNotes = [], isLoading } = useNotesQuery({
    folderId: folderKey,
  })

  const createNoteMutation = useCreateNoteMutation()
  const updateNoteMutation = useUpdateNoteMutation()
  const togglePinNoteMutation = useTogglePinNoteMutation()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [contents, setContents] = useState<Record<string, string>>({})
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit')

  // Map server notes to NoteItem format
  const notesList: NoteItem[] = useMemo(() => {
    return serverNotes.map((n) => ({
      id: n.id,
      title: n.name,
      tags: (n.tags as string[]) || [],
      updated: n.updatedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(new Date(n.updatedAt))
        : 'Just now',
      starred: n.isPinned,
      content: n.content ?? undefined,
    }))
  }, [serverNotes])

  // Find active note object from active tab ID
  const activeTab = useMemo(
    () => openNoteTabs.find((t) => t.id === activeTabId) ?? null,
    [openNoteTabs, activeTabId]
  )

  const activeNoteItem: NoteItem | null = useMemo(() => {
    if (!activeTab) return null
    return (
      notesList.find(
        (n) => (n.id && n.id === activeTab.id) || n.title === activeTab.title
      ) ?? {
        id: activeTab.id,
        title: activeTab.title,
        tags: activeTab.tags ?? [],
        updated: activeTab.updated ?? 'Just now',
        starred: activeTab.isPinned,
      }
    )
  }, [activeTab, notesList])

  const currentContent = useMemo(() => {
    if (!activeTabId) return MOCK_CONTENT.default
    return (
      contents[activeTabId] ??
      activeNoteItem?.content ??
      activeTab?.content ??
      MOCK_CONTENT[activeTabId] ??
      `# ${activeTab?.title || activeTabId}\n\nStart writing your note content...`
    )
  }, [activeTabId, contents, activeNoteItem, activeTab])

  // Focus mode ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode])

  const handleSelectNote = (item: NoteItem) => {
    const tabId = item.id || item.title
    openNoteTab(folderKey, {
      id: tabId,
      title: item.title,
      tags: item.tags,
      isPinned: item.starred,
      updated: item.updated,
      content: item.content,
    })

    if (item.content) {
      setContents((prev) => ({ ...prev, [tabId]: item.content! }))
    }

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleCloseNoteTab = (tabId: string) => {
    closeNoteTab(folderKey, tabId)
  }

  const handleSelectTab = (tabId: string) => {
    setActiveNoteTab(folderKey, tabId)
  }

  const handleTogglePinTab = (tabId: string) => {
    // If it's a server note, trigger mutation
    if (tabId && !tabId.includes(' ')) {
      togglePinNoteMutation.mutate(tabId)
    }
    togglePinNoteTab(folderKey, tabId)
  }

  const handleCreateNote = async (values: NewNoteValues) => {
    try {
      const created = await createNoteMutation.mutateAsync({
        name: values.name,
        folderId: folderKey,
        tags: values.tags || [],
        isPinned: !!values.isPinned,
        content: `# ${values.name}\n\nStart writing your note content...`,
      })

      if (created) {
        openNoteTab(folderKey, {
          id: created.id,
          title: created.name,
          tags: (created.tags as string[]) || [],
          isPinned: created.isPinned,
          updated: 'Just now',
          content: created.content ?? undefined,
        })

        setContents((prev) => ({
          ...prev,
          [created.id]:
            created.content ??
            `# ${created.name}\n\nStart writing your note content...`,
        }))
      }
    } catch (err) {
      console.error('Failed to create note on server:', err)
    }
  }

  const handleContentChange = (value: string) => {
    if (activeTabId) {
      setContents((prev) => ({
        ...prev,
        [activeTabId]: value,
      }))

      // Persist note content to server if ID is valid
      if (activeTabId && !activeTabId.includes(' ')) {
        updateNoteMutation.mutate({
          id: activeTabId,
          content: value,
        })
      }
    }
  }

  const handleCloseFolder = () => {
    navigate({ to: '/workspace/folder' })
  }

  return (
    <div
      className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-ns-border/40 bg-ns-panel/95 text-ns-text shadow-xl backdrop-blur-xl transition-all duration-300 ${
        isFocusMode
          ? 'fixed inset-0 z-ns-supreme rounded-none border-none'
          : 'h-[calc(100vh-140px)] min-h-[560px] w-full'
      }`}
    >
      {/* Folder Detail Header Bar with Integrated Note Tabs */}
      {!isFocusMode && (
        <NoteDetailHeader
          node={node}
          tabs={openNoteTabs}
          activeTabId={activeTabId}
          sidebarOpen={sidebarOpen}
          isFocusMode={isFocusMode}
          viewMode={viewMode}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onToggleFocusMode={() => setIsFocusMode((v) => !v)}
          onChangeViewMode={setViewMode}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseNoteTab}
          onTogglePinTab={handleTogglePinTab}
          onClose={handleCloseFolder}
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

      {/* Main Workspace Area (Sidebar + Note Editor) */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Mobile Backdrop for Notes Sidebar */}
        {!isFocusMode && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Notes Sidebar Drawer / Panel (All Notes in this Folder) */}
        {!isFocusMode && (
          <NotesSidebar
            open={sidebarOpen}
            notes={notesList}
            selectedNote={activeNoteItem}
            onSelectNote={handleSelectNote}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Editor Canvas Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {openNoteTabs.length > 0 && activeNoteItem ? (
            <NoteEditor
              note={activeNoteItem}
              content={currentContent}
              viewMode={viewMode}
              isFocusMode={isFocusMode}
              onContentChange={handleContentChange}
              onChangeViewMode={setViewMode}
              onToggleSidebar={() => setSidebarOpen((v) => !v)}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <EmptyState
                icon={FileText}
                title={
                  isLoading
                    ? 'Loading notes...'
                    : 'No note opened in this folder'
                }
                description={
                  isLoading
                    ? 'Retrieving notes from server...'
                    : `Choose a note from the left sidebar or create a new note in "${node.title}" to start editing.`
                }
                action={
                  <Button
                    onClick={() => openNewNoteDialog()}
                    disabled={createNoteMutation.isPending}
                    className="cursor-pointer gap-2 bg-ns-primary font-semibold text-white shadow-lg hover:bg-ns-primary/85"
                  >
                    <Plus size={15} />
                    <span>
                      {createNoteMutation.isPending
                        ? 'Creating...'
                        : 'Create Note'}
                    </span>
                  </Button>
                }
                className="max-w-md py-12"
              />
            </div>
          )}
        </div>
      </div>

      {/* Slide-in New Note Panel */}
      <NewNotePanel
        onSubmit={handleCreateNote}
        defaultFolderId={node.folderId}
      />
    </div>
  )
}
