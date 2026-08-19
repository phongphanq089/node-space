export { NoteCanvas } from './components/note-canvas'
export { NoteDetailHeader } from './components/note-detail-header'
export { NoteDetailView } from './components/note-detail-view'
export { NoteEditor } from './components/note-editor'
export { NoteStatusBar } from './components/note-status-bar'
export { NoteToolbar } from './components/note-toolbar'
export { NotesSidebar } from './components/notes-sidebar'
export { NoteModal } from './components/note-modal'
export { NewNotePanel } from './components/new-note-panel'
export { FolderNoteTabsBar } from './components/folder-note-tabs-bar'
export type { NoteTab } from './components/folder-note-tabs-bar'
export { useNoteEditor } from './components/use-note-editor'
export type {
  ActiveFormatKey,
  ActiveFormats,
  ViewMode,
} from './components/use-note-editor'

// Server Functions & Query Hooks
export * from './note.fns'
export * from './hooks/use-notes'

// Stores
export { useNewNoteDialogStore } from './store/use-new-note-dialog-store'
export { useNoteDetailModalStore } from './store/use-note-detail-modal-store'
export { useNoteTabsStore } from './store/use-note-tabs-store'
export type { NoteDetailNode } from './store/use-note-detail-modal-store'
export type { NoteTabItem } from './store/use-note-tabs-store'
