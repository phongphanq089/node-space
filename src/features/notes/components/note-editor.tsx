import type { NoteItem } from '@/shared/mocks/mock-data'
import type { ViewMode } from './use-note-editor'
import { useNoteEditor } from './use-note-editor'
import { NoteToolbar } from './note-toolbar'
import { NoteCanvas } from './note-canvas'
import { NoteStatusBar } from './note-status-bar'

interface NoteEditorProps {
  note: NoteItem
  content: string
  viewMode: ViewMode
  isFocusMode: boolean
  onContentChange: (value: string) => void
  onChangeViewMode: (mode: ViewMode) => void
  onToggleSidebar: () => void
}

export function NoteEditor({
  note,
  content,
  viewMode,
  isFocusMode,
  onContentChange,
  onToggleSidebar,
}: NoteEditorProps) {
  const {
    selectedBlockType,
    activeFormats,
    wordCount,
    charCount,
    readingTime,
    toggleFormat,
    setSelectedBlockType,
  } = useNoteEditor(content)

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-ns-bg/40 text-ns-text">
      {viewMode !== 'preview' && (
        <NoteToolbar
          selectedBlockType={selectedBlockType}
          activeFormats={activeFormats}
          onToggleSidebar={onToggleSidebar}
          onToggleFormat={toggleFormat}
          onSelectBlockType={setSelectedBlockType}
        />
      )}

      <NoteCanvas
        note={note}
        content={content}
        viewMode={viewMode}
        wordCount={wordCount}
        readingTime={readingTime}
        onContentChange={onContentChange}
      />

      <NoteStatusBar
        wordCount={wordCount}
        charCount={charCount}
        isFocusMode={isFocusMode}
      />
    </main>
  )
}
