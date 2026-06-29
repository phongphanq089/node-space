import { NODES, NOTES } from '@/constants/moc-data'
import { createFileRoute } from '@tanstack/react-router'
import { Star, FileText, ArrowUpRight, Heart } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const starredNodes = NODES.filter((n) => n.starred)
  const starredNotes = NOTES.filter((n) => n.starred)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg">
        <div className="ns-hero-blur-purple-25 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-25" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-pink uppercase">
            Quick Reminders
          </p>
          <h1 className="mb-2 flex items-center gap-2 text-xl font-bold text-ns-text">
            <span>Favorites List</span>
            <Heart size={18} fill="#e05c9a" className="text-ns-pink" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Quick access to knowledge nodes and important notes that have been
            starred.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Starred Nodes */}
        <div className="flex flex-col gap-3.5">
          <h2 className="flex items-center gap-2 px-1 text-xs font-bold tracking-wider text-ns-muted uppercase">
            <Star size={13} fill="#fbbf24" className="text-amber-400" />
            <span>Starred Nodes ({starredNodes.length})</span>
          </h2>
          <div className="flex flex-col gap-3">
            {starredNodes.map((node) => (
              <div
                key={node.title}
                className="group animate-fade-in flex items-center gap-3 rounded-xl border border-ns-border bg-ns-panel p-3.5 transition-all hover:border-ns-border-md"
              >
                {node.thumbnail ? (
                  <img
                    src={node.thumbnail}
                    alt={node.title}
                    className="h-10 w-10 flex-shrink-0 rounded-lg border border-ns-border object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-hover" />
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-bold text-ns-text transition-colors group-hover:text-ns-accent-lt">
                    {node.title}
                  </h3>
                  <span className="mt-0.5 block text-[0.62rem] text-ns-faint">
                    {node.count} notes · {node.updated}
                  </span>
                </div>

                <button className="cursor-pointer rounded-lg p-2 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-ns-accent-lt">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
            {starredNodes.length === 0 && (
              <p className="rounded-xl border border-dashed border-ns-border bg-ns-panel/30 p-4 text-center text-xs text-ns-faint">
                No starred nodes yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Starred Notes */}
        <div className="flex flex-col gap-3.5">
          <h2 className="flex items-center gap-2 px-1 text-xs font-bold tracking-wider text-ns-muted uppercase">
            <FileText size={13} className="text-ns-accent-lt" />
            <span>Important Notes ({starredNotes.length})</span>
          </h2>
          <div className="flex flex-col gap-3">
            {starredNotes.map((note) => (
              <div
                key={note.title}
                className="group animate-fade-in flex items-start gap-3 rounded-xl border border-ns-border bg-ns-panel p-3.5 transition-all hover:border-ns-border-md"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ns-active text-ns-accent-lt shadow-inner">
                  <FileText size={14} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-bold text-ns-text transition-colors group-hover:text-ns-accent-lt">
                    {note.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-ns-hover px-1.5 py-0.5 text-[0.58rem] font-bold text-ns-accent-lt"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="cursor-pointer rounded-lg p-2 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-ns-accent-lt">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
            {starredNotes.length === 0 && (
              <p className="rounded-xl border border-dashed border-ns-border bg-ns-panel/30 p-4 text-center text-xs text-ns-faint">
                No starred notes yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
