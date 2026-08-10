import { Tag } from 'lucide-react'
import { POPULAR_TAGS } from '@/shared/constants/moc-data'
import { Link } from '@tanstack/react-router'

export function PopularTagsWidget() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <Tag size={14} />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white">
            Popular Tags
          </h2>
        </div>
        <Link
          to="/workspace/tags"
          className="rounded-lg border border-ns-border/40 bg-ns-surface px-2.5 py-1 text-[0.65rem] font-bold whitespace-nowrap text-ns-ghost no-underline transition-all hover:border-sky-500/40 hover:text-sky-300"
        >
          Manage
        </Link>
      </div>

      {/* Tag Badges Grid */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_TAGS.map((tag) => (
          <Link
            key={tag.id}
            to="/workspace/tags"
            className="group flex items-center gap-1.5 rounded-xl border border-ns-border/40 bg-ns-surface px-2.5 py-1.5 text-[0.68rem] font-bold text-ns-ghost no-underline transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
          >
            <span className="font-mono text-sky-400/80 group-hover:text-sky-300">
              #
            </span>
            <span>{tag.name}</span>
            <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[0.55rem] font-extrabold text-ns-faint group-hover:text-white">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
