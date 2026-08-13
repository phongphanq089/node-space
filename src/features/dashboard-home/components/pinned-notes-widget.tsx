import { useState } from 'react'
import { Pin, ArrowRight } from 'lucide-react'
import { PINNED_NOTES } from '@/shared/mocks/mock-data'
import type { PinnedNoteItem } from '@/shared/mocks/mock-data'
import { Link } from '@tanstack/react-router'

export function PinnedNotesWidget() {
  const [pinnedList, setPinnedList] = useState<PinnedNoteItem[]>(() => [
    ...PINNED_NOTES,
  ])

  const togglePin = (id: string) => {
    setPinnedList((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
          <Pin size={14} />
        </div>
        <h2 className="text-sm font-extrabold tracking-wide text-white">
          Pinned Notes
        </h2>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {pinnedList.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between gap-2.5 rounded-xl border border-ns-border/30 bg-ns-surface p-2.5 transition-all hover:border-amber-500/40 hover:bg-ns-hover"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-amber-300">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-[0.6rem] font-medium text-ns-faint">
                  <span className="truncate font-semibold text-violet-300">
                    {item.folderName}
                  </span>
                  <span>â€¢</span>
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => togglePin(item.id)}
              type="button"
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-amber-400 transition-colors hover:bg-amber-400/10"
              title="Unpin"
            >
              <Pin size={12} className="fill-amber-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <Link
        to="/workspace/favorites"
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-ns-border/30 bg-ns-surface/50 py-2 text-[0.7rem] font-extrabold text-ns-ghost no-underline transition-all hover:border-amber-500/40 hover:text-amber-300"
      >
        <span>View all pinned</span>
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}
