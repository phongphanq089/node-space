import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { toast } from 'sonner'

export const Route = createFileRoute('/_workspace/workspace/trash')({
  component: TrashPage,
})

interface DeletedItem {
  id: string
  type: 'node' | 'note'
  title: string
  deletedAt: string
  detail: string
}

const INITIAL_DELETED_ITEMS: readonly DeletedItem[] = [
  {
    id: 'd-1',
    type: 'node',
    title: 'Old System Architecture Blueprint',
    deletedAt: 'Deleted 12 days ago',
    detail: 'Contains 3 notes · Documentation',
  },
  {
    id: 'd-2',
    type: 'note',
    title: 'Dijkstra Sketch Drafts',
    deletedAt: 'Deleted 4 days ago',
    detail: 'Belongs to node "Dijkstra Algorithm Explained"',
  },
  {
    id: 'd-3',
    type: 'note',
    title: 'January Meeting Scratchpad',
    deletedAt: 'Deleted 22 days ago',
    detail: 'Personal archive',
  },
  {
    id: 'd-4',
    type: 'node',
    title: 'Deprecated API Specifications',
    deletedAt: 'Deleted 18 days ago',
    detail: 'Contains 5 notes · DevOps & Systems',
  },
]

function TrashPage() {
  const [items, setItems] = useState<DeletedItem[]>(() => [
    ...INITIAL_DELETED_ITEMS,
  ])
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false)

  const handleRestore = (id: string, title: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.success(`Restored "${title}" to your workspace`, {
      position: 'top-center',
    })
  }

  const handleDeletePermanent = (id: string, title: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.error(`Permanently deleted "${title}"`, {
      position: 'top-center',
    })
  }

  const handleEmptyTrash = () => {
    setItems([])
    setConfirmEmptyOpen(false)
    toast.success('Trash emptied completely', {
      position: 'top-center',
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg p-4 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Header ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="ns-orb-amber-25 pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[0.7rem] font-semibold text-amber-400">
              <Trash2 className="size-3.5" />
              <span>Temporary Archive</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Trash Bin
            </h1>
            <p className="max-w-xl text-xs text-ns-muted sm:text-sm">
              Deleted items are stored here temporarily. Restore them anytime or
              purge them permanently.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-lg font-bold text-amber-400">
                {items.length}
              </span>
              <span className="text-[0.65rem] font-semibold text-ns-ghost uppercase">
                Deleted Items
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Warning Alert Banner ───────────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 shadow-lg backdrop-blur-xl">
        <AlertTriangle className="size-5 shrink-0 animate-pulse text-amber-400" />
        <div className="flex-1">
          <span className="font-bold">Auto-Purge Warning:</span> Items remaining
          in the trash will be automatically and permanently removed after 30
          days.
        </div>
      </div>

      {/* ── Actions Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
          Archived Items ({items.length})
        </span>

        {items.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmEmptyOpen(true)}
            className="flex items-center gap-2 bg-red-600/90 font-semibold text-white hover:bg-red-500"
          >
            <Trash2 className="size-3.5" />
            <span>Empty Trash</span>
          </Button>
        )}
      </div>

      {/* ── Items List ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-panel/70 p-4 transition-all hover:border-ns-border-md hover:bg-ns-panel hover:shadow-xl"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl border border-ns-border-soft ${
                  item.type === 'node'
                    ? 'bg-ns-primary/20 text-ns-primary-lt'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {item.type === 'node' ? (
                  <Folder size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-ns-bg/60 px-2 py-0.5 text-[0.625rem] font-semibold text-ns-ghost uppercase">
                    {item.type}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-ns-muted">
                  <span>{item.detail}</span>
                  <span>•</span>
                  <span className="text-red-400/90">{item.deletedAt}</span>
                </div>
              </div>
            </div>

            {/* Item Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(item.id, item.title)}
                className="flex items-center gap-1.5 border-ns-border-soft text-xs text-ns-muted hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300"
                title="Restore item to workspace"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Restore</span>
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeletePermanent(item.id, item.title)}
                className="text-ns-ghost hover:bg-red-500/20 hover:text-red-400"
                title="Delete permanently"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ns-border-soft bg-ns-panel/30 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-ns-border-soft bg-ns-bg/50 text-emerald-400">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                Trash is Completely Empty
              </p>
              <p className="text-xs text-ns-muted">
                No deleted nodes or notes. Everything is clean!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Empty Trash Confirmation Modal ──────────────────────────── */}
      <Dialog open={confirmEmptyOpen} onOpenChange={setConfirmEmptyOpen}>
        <DialogContent className="border-red-500/30 bg-ns-surface/95 shadow-2xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-ns-text">
              Empty Entire Trash?
            </DialogTitle>
            <DialogDescription className="text-xs text-ns-muted">
              This action cannot be undone. All {items.length} items will be
              permanently deleted from your NodeSpace workspace.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmEmptyOpen(false)}
              className="border-ns-border-soft text-ns-muted hover:bg-ns-hover hover:text-ns-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmptyTrash}
              className="flex items-center gap-2 bg-red-600 font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500"
            >
              <Trash2 className="size-4" />
              <span>Empty Trash Now</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
