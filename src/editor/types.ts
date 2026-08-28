export type EditorVariant = 'default' | 'basic' | 'frameless' | 'mobile'

export interface EditorChangeData {
  /** Serialized Lexical JSON state string - ideal for database storage and restoring */
  json: string
  /** Parsed JSON state object */
  state: Record<string, unknown>
  /** Exported HTML string */
  html: string
  /** Exported Markdown string */
  markdown: string
  /** Plain text content */
  text: string
  /** Boolean indicating whether the editor has any meaningful content */
  isEmpty: boolean
}

export interface EditorFeatures {
  /** Toggle top toolbar */
  toolbar?: boolean
  /** Toggle floating bubble menu on text selection */
  floatingToolbar?: boolean
  /** Toggle slash command '/' block picker */
  slashCommand?: boolean
  /** Toggle bottom status bar with counters and action tools */
  statusBar?: boolean
  /** Toggle vertical right action dock */
  floatingDock?: boolean
  /** Toggle slide-out insert tools sidebar */
  sidebarInsert?: boolean
  /** Toggle markdown shortcuts like '# ' for heading */
  markdown?: boolean
  /** Toggle table editing */
  tables?: boolean
  /** Toggle undo/redo history */
  history?: boolean
  /** Toggle auto focus on mount */
  autoFocus?: boolean
}

export interface EditorProps {
  /**
   * Visual preset variant:
   * - 'default': Full rich text editor with top toolbar, footer status bar & side dock
   * - 'basic': Compact mini editor for comments & simple forms
   * - 'frameless': Notion / Medium-like canvas (no border, no card bg) powered by Slash (/) & Bubble Menu
   * - 'mobile': Mobile-optimized editor with touch-friendly bottom dock toolbar
   */
  variant?: EditorVariant
  /** Initial or controlled value (JSON string or Lexical State) */
  value?: string
  /** Callback emitted on content change */
  onChange?: (data: EditorChangeData) => void
  /** Placeholder text when empty */
  placeholder?: string
  /** Read only / view mode */
  readOnly?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** Feature flags override */
  features?: EditorFeatures
  /** Custom image upload handler */
  onUploadImage?: (file: File) => Promise<string>
  /** Document ID displayed in the footer status bar */
  documentId?: string | number
  /** Quick save handler */
  onSave?: (data: EditorChangeData | null) => void
  /** Share handler */
  onShare?: (data: EditorChangeData | null) => void
  /** Container CSS className */
  className?: string
  /** ContentEditable area CSS className */
  contentClassName?: string
  /** Minimum height of the editor input */
  minHeight?: string | number
  /** Namespace identifier for the editor instance */
  namespace?: string
}
