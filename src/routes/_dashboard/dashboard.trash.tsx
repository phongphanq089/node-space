import { createFileRoute } from '@tanstack/react-router'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  FileText,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/trash')({
  component: TrashPage,
})

function TrashPage() {
  const deletedItems = [
    {
      id: 1,
      type: 'node',
      title: 'Old project draft',
      deletedAt: 'Deleted 12 days ago',
      detail: 'Contains 3 notes',
    },
    {
      id: 2,
      type: 'note',
      title: 'Dijkstra sketch ideas',
      deletedAt: 'Deleted 4 days ago',
      detail: 'Belongs to node "Dijkstra Algorithm Explained"',
    },
    {
      id: 3,
      type: 'note',
      title: 'January meeting notes',
      deletedAt: 'Deleted 22 days ago',
      detail: 'Personal archive',
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg">
        <div className="ns-hero-blur-purple-25 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-amber uppercase">
            Temporary Archive
          </p>
          <h1 className="mb-2 flex items-center gap-2 text-xl font-bold text-ns-text">
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
        <button className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/10">
          <Trash2 size={13} />
          <span>Empty Trash</span>
        </button>
      </div>

      {/* Deleted Items List */}
      <div className="flex flex-col gap-2 rounded-xl border border-ns-border bg-ns-panel p-4 shadow-md">
        {deletedItems.map((item) => (
          <div
            key={item.id}
            className="group animate-fade-in flex items-center justify-between gap-4 rounded-xl border border-ns-border bg-ns-bg/30 p-3 transition-all hover:border-ns-border-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                  item.type === 'node'
                    ? 'text-ns-primary-lt bg-ns-active/40'
                    : 'bg-ns-hover/60 text-ns-secondary'
                }`}
              >
                {item.type === 'node' ? (
                  <Folder size={14} />
                ) : (
                  <FileText size={14} />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="group-hover:text-ns-primary-lt truncate text-xs font-bold text-ns-text transition-colors">
                  {item.title}
                </h3>
                <span className="mt-0.5 block text-[0.58rem] font-medium text-ns-faint">
                  {item.detail} ·{' '}
                  <span className="text-red-400/80">{item.deletedAt}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-ns-ghost">
              <button
                className="hover:text-ns-primary-lt cursor-pointer rounded-lg p-2 transition-colors hover:bg-ns-hover"
                title="Restore"
              >
                <RotateCcw size={13} />
              </button>
              <button
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-ns-hover hover:text-red-400"
                title="Delete permanently"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {deletedItems.length === 0 && (
          <p className="rounded-xl border border-dashed border-ns-border bg-ns-bg/10 p-6 text-center text-xs text-ns-faint">
            Trash is empty.
          </p>
        )}
      </div>
    </div>
  )
}
