import { createFileRoute } from '@tanstack/react-router'
import { Tag, Search, Hash } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/tags')({
  component: TagsPage,
})

function TagsPage() {
  const tagsData = [
    { name: 'productivity', count: 3, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)' },
    { name: 'algorithm', count: 2, color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)' },
    { name: 'devops', count: 1, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.08)' },
    { name: 'book', count: 4, color: '#f87171', bg: 'rgba(248, 113, 113, 0.08)' },
    { name: 'database', count: 2, color: '#f97316', bg: 'rgba(249, 115, 22, 0.08)' },
    { name: 'clean-code', count: 5, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)' },
    { name: 'linux', count: 2, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
    { name: 'overview', count: 3, color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.08)' },
    { name: 'feature', count: 4, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)' },
    { name: 'tech', count: 6, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)' },
    { name: 'stack', count: 2, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)' },
    { name: 'roadmap', count: 1, color: '#eab308', bg: 'rgba(234, 179, 8, 0.08)' },
    { name: 'usecase', count: 2, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.08)' },
    { name: 'example', count: 2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg relative overflow-hidden">
        <div className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-accent-lt uppercase">
            Content Classification
          </p>
          <h1 className="mb-2 text-xl font-bold text-ns-text flex items-center gap-2">
            <span>Manage Tags</span>
            <Tag size={16} className="text-ns-accent-lt" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Manage and filter your knowledge nodes using custom tags.
          </p>
        </div>
      </section>

      {/* Search tag bar */}
      <div className="flex items-center gap-2 rounded-xl border border-ns-border bg-ns-panel px-3 py-2 w-full sm:max-w-xs focus-within:border-ns-accent transition-all">
        <Search size={14} className="text-ns-ghost" />
        <input
          type="search"
          placeholder="Search tags..."
          className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
        />
      </div>

      {/* Tags Cloud Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tagsData.map((tag) => (
          <button
            key={tag.name}
            className="flex items-center justify-between rounded-xl border border-ns-border bg-ns-panel p-3 hover:border-ns-border-md hover:bg-ns-hover/30 transition-all cursor-pointer group text-left animate-fade-in"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div 
                className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
                style={{ backgroundColor: tag.bg, color: tag.color }}
              >
                <Hash size={13} />
              </div>
              <span className="text-xs font-bold text-ns-text truncate group-hover:text-ns-accent-lt transition-colors">
                {tag.name}
              </span>
            </div>
            <span className="rounded bg-ns-input border border-ns-border/40 px-2 py-0.5 text-[0.58rem] font-bold text-ns-muted">
              {tag.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
