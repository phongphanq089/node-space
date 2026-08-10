import { Folder, ChevronRight } from 'lucide-react'
import { NOTEBOOKS } from '@/shared/mocks/mock-data'
import type { NotebookItem } from '@/shared/mocks/mock-data'
import { Link } from '@tanstack/react-router'

interface NotebooksGridBlockProps {
  onSelectNotebook?: (notebook: NotebookItem) => void
}

export function NotebooksGridBlock({
  onSelectNotebook,
}: NotebooksGridBlockProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Folder size={14} />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white">
            Notebooks
          </h2>
        </div>
        <Link
          to="/workspace/folder"
          className="flex items-center gap-1 text-[0.7rem] font-bold whitespace-nowrap text-ns-ghost no-underline transition-colors hover:text-emerald-400"
        >
          <span>View all</span>
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Grid of Notebooks: 2-column grid on mobile, 4-column grid on sm+ */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {NOTEBOOKS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNotebook?.(item)}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-ns-border/40 bg-ns-surface p-2.5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-95"
          >
            {/* Image Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Title & Count */}
            <div className="mt-2 flex min-w-0 flex-col">
              <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-emerald-300">
                {item.name}
              </h3>
              <p className="text-[0.65rem] font-medium text-ns-faint">
                {item.count} notes
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
