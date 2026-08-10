interface NoteStatusBarProps {
  wordCount: number
  charCount: number
  isFocusMode: boolean
}

export function NoteStatusBar({
  wordCount,
  charCount,
  isFocusMode,
}: NoteStatusBarProps) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-ns-border-soft bg-ns-panel/90 px-4 py-2 text-[0.65rem] text-ns-muted backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
          Lexical Engine Ready
        </span>
        <span>•</span>
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{charCount} characters</span>
      </div>

      <div className="flex items-center gap-3">
        {isFocusMode ? (
          <span className="text-amber-300">Focus Mode Active</span>
        ) : (
          <span className="text-ns-ghost">Press ESC to exit modal</span>
        )}
        <span>•</span>
        <span className="text-ns-ghost">Auto-saved local draft</span>
      </div>
    </footer>
  )
}
