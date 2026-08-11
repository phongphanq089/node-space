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
    <footer className="flex shrink-0 items-center justify-between border-t border-ns-border-soft/40 bg-ns-panel/50 px-4 py-1.5 text-[0.6rem] text-ns-ghost backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Lexical ready
        </span>
        <span className="text-ns-border-soft">·</span>
        <span>{wordCount} words</span>
        <span className="text-ns-border-soft">·</span>
        <span>{charCount} chars</span>
      </div>

      <div className="flex items-center gap-3">
        {isFocusMode ? (
          <span className="text-amber-300/80">Focus Mode</span>
        ) : (
          <span>ESC to close</span>
        )}
        <span className="text-ns-border-soft">·</span>
        <span>Auto-saved</span>
      </div>
    </footer>
  )
}
