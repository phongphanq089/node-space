import { createFileRoute } from '@tanstack/react-router'
import { Trash2, RotateCcw, AlertTriangle, Folder, FileText } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/trash')({
  component: TrashPage,
})

function TrashPage() {
  const deletedItems = [
    { id: 1, type: 'node', title: 'Old project draft', deletedAt: 'Deleted 12 days ago', detail: 'Contains 3 notes' },
    { id: 2, type: 'note', title: 'Dijkstra sketch ideas', deletedAt: 'Deleted 4 days ago', detail: 'Belongs to node "Dijkstra Algorithm Explained"' },
    { id: 3, type: 'note', title: 'January meeting notes', deletedAt: 'Deleted 22 days ago', detail: 'Personal archive' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg relative overflow-hidden">
        <div className="ns-hero-blur-purple-25 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-amber uppercase">
            Temporary Archive
          </p>
          <h1 className="mb-2 text-xl font-bold text-ns-text flex items-center gap-2">
            <span>Trash</span>
            <Trash2 size={16} className="text-ns-muted" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            View and restore deleted nodes or notes.
          </p>
        </div>
      </section>

      {/* Warning Box */}
      <div className="flex items-center gap-3 rounded-xl border border-ns-amber/30 bg-ns-amber/5 p-4 text-xs text-ns-amber shadow-sm backdrop-blur-sm">
        <AlertTriangle size={16} className="flex-shrink-0 animate-pulse" />
        <p className="font-semibold">
          Items in the trash will be permanently deleted after 30 days.
        </p>
      </div>

      {/* Controls: Empty Trash */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
          <Trash2 size={13} />
          <span>Empty Trash</span>
        </button>
      </div>

      {/* Deleted Items List */}
      <div className="rounded-xl border border-ns-border bg-ns-panel p-4 shadow-md flex flex-col gap-2">
        {deletedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-3 rounded-xl border border-ns-border bg-ns-bg/30 hover:border-ns-border-md transition-all group animate-fade-in"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.type === 'node' ? 'bg-ns-active/40 text-ns-accent-lt' : 'bg-ns-hover/60 text-ns-secondary'
              }`}>
                {item.type === 'node' ? <Folder size={14} /> : <FileText size={14} />}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-ns-text truncate group-hover:text-ns-accent-lt transition-colors">
                  {item.title}
                </h3>
                <span className="block text-[0.58rem] text-ns-faint mt-0.5 font-medium">
                  {item.detail} · <span className="text-red-400/80">{item.deletedAt}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-ns-ghost">
              <button 
                className="p-2 rounded-lg hover:bg-ns-hover hover:text-ns-accent-lt transition-colors cursor-pointer"
                title="Restore"
              >
                <RotateCcw size={13} />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-ns-hover hover:text-red-400 transition-colors cursor-pointer"
                title="Delete permanently"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {deletedItems.length === 0 && (
          <p className="text-xs text-ns-faint p-6 text-center border border-dashed border-ns-border bg-ns-bg/10 rounded-xl">
            Trash is empty.
          </p>
        )}
      </div>
    </div>
  )
}
