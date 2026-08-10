import { useState } from 'react'
import { FileText, Star, Clock, Layers, ChevronRight } from 'lucide-react'
import { NODES } from '@/shared/constants/moc-data'
import { NoteDetailModal } from '@/features/notes/components/note-detail-modal'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface RecentNotesBlockProps {
  searchQuery?: string
}

export function RecentNotesBlock({ searchQuery = '' }: RecentNotesBlockProps) {
  const [nodes, setNodes] = useState<NodeWithThumbnail[]>(() =>
    NODES.map((n) => ({ ...n }))
  )
  const [selectedNode, setSelectedNode] = useState<NodeWithThumbnail | null>(
    null
  )

  const toggleStar = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    setNodes((prev) =>
      prev.map((n) => (n.title === title ? { ...n, starred: !n.starred } : n))
    )
  }

  const filteredNodes = nodes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <FileText size={14} />
          </div>
          <h2 className="text-sm font-extrabold tracking-wide text-white">
            Recent Notes
          </h2>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-[0.7rem] font-bold whitespace-nowrap text-ns-ghost transition-colors hover:text-violet-400"
        >
          <span>View all</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Stacked list of note items */}
      <div className="flex flex-col gap-2.5">
        {filteredNodes.slice(0, 5).map((node) => (
          <div
            key={node.title}
            onClick={() => setSelectedNode(node)}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-ns-border/30 bg-ns-surface p-3 transition-all hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-ns-hover active:scale-[0.99]"
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex min-w-0 items-center gap-3">
              {node.thumbnail && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <img
                    src={node.thumbnail}
                    alt={node.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-violet-300 sm:text-sm">
                    {node.title}
                  </h3>
                  {node.folderName && (
                    <span className="hidden items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[0.55rem] font-extrabold text-violet-300 sm:inline-flex">
                      {node.folderName}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-3 text-[0.65rem] font-medium text-ns-faint">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-ns-ghost" />
                    {node.updated}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers size={11} className="text-ns-ghost" />
                    {node.count} notes
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Tag & Star */}
            <div className="flex shrink-0 items-center gap-3">
              {node.tag && (
                <span
                  className="hidden font-mono text-[0.65rem] font-extrabold tracking-wide uppercase md:inline-block"
                  style={{ color: node.tagColor || '#a78bfa' }}
                >
                  {node.tag}
                </span>
              )}

              <button
                onClick={(e) => toggleStar(e, node.title)}
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-white/5 hover:text-amber-400"
                title={node.starred ? 'Unstar' : 'Star'}
              >
                <Star
                  size={14}
                  className={
                    node.starred ? 'fill-amber-400 text-amber-400' : ''
                  }
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Detail Modal */}
      {selectedNode && (
        <NoteDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
