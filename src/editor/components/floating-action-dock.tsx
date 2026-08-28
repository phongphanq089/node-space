import { FileDown, LayoutList, Save, Share2, Trash2 } from 'lucide-react'

export interface FloatingActionDockProps {
  onSave?: () => void
  onShare?: () => void
  onExport?: () => void
  onOpenSidebar?: () => void
  onClear?: () => void
  className?: string
}

// Each action button in the side dock
function DockBtn({
  onClick,
  title,
  children,
  danger = false,
}: {
  onClick?: () => void
  title: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`group flex size-9 items-center justify-center transition-colors ${
        danger
          ? 'text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive'
          : 'text-muted-foreground/50 hover:bg-muted hover:text-foreground'
      }`}
    >
      <span className="transition-transform group-hover:scale-110">
        {children}
      </span>
    </button>
  )
}

export function FloatingActionDock({
  onSave,
  onShare,
  onExport,
  onOpenSidebar,
  onClear,
  className = '',
}: FloatingActionDockProps) {
  return (
    <div
      className={`absolute top-1/2 right-0 z-20 flex -translate-y-1/2 flex-col divide-y divide-border/40 overflow-hidden rounded-l-xl border-y border-l border-border/70 bg-background/90 shadow-lg backdrop-blur-md ${className}`}
    >
      {/* 1. Open Sidebar Tool Palette */}
      {onOpenSidebar && (
        <DockBtn
          onClick={onOpenSidebar}
          title="Open Tool Palette (Drag & Drop Blocks)"
        >
          <LayoutList className="size-4 text-primary" />
        </DockBtn>
      )}

      {/* 2. Quick Save */}
      <DockBtn onClick={onSave} title="Save">
        <Save className="size-4" />
      </DockBtn>

      {/* 3. Share */}
      <DockBtn onClick={onShare} title="Share">
        <Share2 className="size-4" />
      </DockBtn>

      {/* 4. Export / Inspect Output */}
      <DockBtn onClick={onExport} title="Export / Inspect">
        <FileDown className="size-4" />
      </DockBtn>

      {/* 5. Clear Content */}
      <DockBtn onClick={onClear} title="Clear content" danger>
        <Trash2 className="size-4" />
      </DockBtn>
    </div>
  )
}
