import { Download, FileCode2, Lock, Mic, Unlock, Share2 } from 'lucide-react'
import { Button } from './ui/button'
import type { EditorChangeData } from '../types'

export interface EditorFooterProps {
  documentId?: string | number
  data: EditorChangeData | null
  readOnly?: boolean
  onToggleReadOnly?: () => void
  onOpenInspector?: () => void
  onExportMarkdown?: () => void
  className?: string
}

export function EditorFooter({
  documentId = '15714558',
  data,
  readOnly = false,
  onToggleReadOnly,
  onOpenInspector,
  onExportMarkdown,
  className = '',
}: EditorFooterProps) {
  const characters = data?.text?.length ?? 0
  const words = data?.text?.trim()
    ? data.text.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div
      className={`flex h-8 items-center justify-between border-t border-border/60 bg-muted/20 px-3 select-none ${className}`}
    >
      {/* Left: Doc ID */}
      <span className="cursor-default font-mono text-[11px] text-muted-foreground/60 transition-colors hover:text-muted-foreground">
        {documentId}
      </span>

      {/* Center: Stats */}
      <span className="font-mono text-[11px] text-muted-foreground/60">
        {characters.toLocaleString()}&thinsp;ch&nbsp;·&nbsp;
        {words.toLocaleString()}&thinsp;w
      </span>

      {/* Right: Actions */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-xs"
          className="size-6 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
          title="Voice Dictation"
        >
          <Mic className="size-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          className="size-6 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
          title="Share"
        >
          <Share2 className="size-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onExportMarkdown}
          className="size-6 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
          title="Export Markdown"
        >
          <Download className="size-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onOpenInspector}
          className="size-6 text-muted-foreground/60 hover:bg-primary/8 hover:text-primary"
          title="Open Inspector"
        >
          <FileCode2 className="size-3" />
        </Button>

        {/* Lock toggle — slightly more visible since it's a status indicator */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleReadOnly}
          className={`size-6 transition-colors ${
            readOnly
              ? 'text-amber-500 hover:bg-amber-500/10'
              : 'text-muted-foreground/60 hover:bg-muted hover:text-foreground'
          }`}
          title={
            readOnly ? 'Locked — click to unlock' : 'Editable — click to lock'
          }
        >
          {readOnly ? (
            <Lock className="size-3" />
          ) : (
            <Unlock className="size-3" />
          )}
        </Button>
      </div>
    </div>
  )
}
