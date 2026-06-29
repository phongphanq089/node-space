import { NODES } from '@/constants/moc-data'
import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  Search,
  Star,
  MessageSquare,
  ArrowUpRight,
  Edit2,
  Trash2,
} from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/nodes')({
  component: NodesPage,
})

function NodesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header section */}
      <section className="relative overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg">
        <div className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-30" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-accent-lt uppercase">
            Workspace Manager
          </p>
          <h1 className="mb-2 text-xl font-bold text-ns-text">All Nodes</h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Browse, manage, and organize your knowledge nodes in this workspace.
          </p>
        </div>
      </section>

      {/* Controls: Search, Filter, Add */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full items-center gap-2 rounded-xl border border-ns-border bg-ns-panel px-3 py-2 transition-all focus-within:border-ns-border-md sm:max-w-xs">
          <Search size={14} className="text-ns-ghost" />
          <input
            type="search"
            placeholder="Search nodes..."
            className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
          />
        </div>
        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ns-accent to-ns-secondary px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-ns-accent/10 transition-all hover:opacity-90 sm:w-auto">
          <Plus size={14} />
          <span>Create new node</span>
        </button>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {NODES.map((node) => (
          <div
            key={node.title}
            className={`group relative flex min-h-[170px] flex-col justify-between rounded-xl border bg-ns-panel p-4 shadow-md transition-all hover:shadow-xl ${
              node.active
                ? 'border-ns-border-em'
                : 'border-ns-border hover:border-ns-border-md'
            }`}
          >
            {/* Thumbnail and Tags */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {node.thumbnail ? (
                  <img
                    src={node.thumbnail}
                    alt={node.title}
                    className="h-11 w-11 flex-shrink-0 rounded-lg border border-ns-border object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ns-active to-ns-hover text-xs font-bold text-white">
                    N
                  </div>
                )}
                <div>
                  <h3 className="line-clamp-1 text-xs font-bold text-ns-text transition-colors group-hover:text-ns-accent-lt">
                    {node.title}
                  </h3>
                  <span className="text-[0.62rem] font-medium text-ns-faint">
                    {node.updated}
                  </span>
                </div>
              </div>

              {node.starred && (
                <Star
                  size={13}
                  fill="#fbbf24"
                  className="mt-1 flex-shrink-0 text-amber-400"
                />
              )}
            </div>

            {/* Note count & Tags */}
            <div className="my-2 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded border border-ns-border/30 bg-ns-input px-2 py-0.5 text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase">
                <MessageSquare size={10} />
                {node.count} notes
              </span>
              <span
                className="text-[0.62rem] font-bold tracking-wider uppercase"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-ns-border-soft" />

            {/* Action buttons footer */}
            <div className="mt-auto flex items-center justify-between pt-1 text-ns-ghost">
              <button className="flex cursor-pointer items-center gap-1 text-[0.68rem] font-bold text-ns-accent-lt hover:underline">
                <span>View details</span>
                <ArrowUpRight size={12} />
              </button>

              <div className="flex items-center gap-1">
                <button
                  className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-ns-hover hover:text-ns-text-2"
                  title="Edit"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-ns-hover hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
