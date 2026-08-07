import {
  Star,
  Edit2,
  Trash2,
  FileText,
  Clock,
  ArrowRight,
  Folder,
} from 'lucide-react'

import { GlowCard } from '@/components/shared/glow-card-grid'
import type { NODES } from '@/constants/moc-data'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface NodeCardProps {
  node: NodeWithThumbnail
  onSelect: (node: NodeWithThumbnail) => void
  onToggleStar: (e: React.MouseEvent, title: string) => void
}

export function NodeCard({ node, onSelect, onToggleStar }: NodeCardProps) {
  return (
    <GlowCard avatar={node.thumbnail} className="cursor-pointer">
      <div
        onClick={() => onSelect(node)}
        className="group flex items-stretch gap-4 p-4"
      >
        {/* Left: Thumbnail */}
        {node.thumbnail ? (
          <img
            src={node.thumbnail}
            alt={node.title}
            className="h-24 w-24 flex-shrink-0 rounded-2xl border border-ns-border object-cover shadow-sm transition-all group-hover:border-ns-border-md"
          />
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border border-ns-border bg-gradient-to-br from-ns-active to-ns-hover text-lg font-bold text-white transition-all group-hover:border-ns-border-md">
            N
          </div>
        )}

        {/* Right: Info Area */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* Row 1: Title & Star */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-ns-primary-lt">
              {node.title}
            </h3>
            <button
              onClick={(e) => onToggleStar(e, node.title)}
              className="flex-shrink-0 cursor-pointer rounded p-1 text-ns-ghost transition-all hover:bg-ns-hover/80 hover:text-amber-400"
              title={node.starred ? 'Unstar' : 'Star'}
            >
              <Star
                size={13}
                fill={node.starred ? '#fbbf24' : 'none'}
                className={node.starred ? 'text-amber-400' : 'text-ns-ghost'}
              />
            </button>
          </div>

          {/* Row 2: Time Updated & Folder Badge */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.68rem] text-ns-faint">
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="flex-shrink-0" />
              <span>{node.updated}</span>
            </div>
            {node.folderName && (
              <span className="flex items-center gap-1 rounded border border-ns-border-soft/60 bg-ns-hover/60 px-1.5 py-0.5 text-[0.6rem] font-semibold text-ns-primary-lt">
                <Folder size={10} className="text-ns-primary-lt" />
                {node.folderName}
              </span>
            )}
          </div>

          {/* Row 3: Notes count & Tag */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded border border-ns-border-soft bg-ns-active/40 px-2 py-0.5 text-[0.62rem] font-bold text-ns-muted">
              <FileText size={10} className="text-ns-ghost" />
              <span>{node.count} notes</span>
            </span>
            {node.tag && (
              <span
                className="text-[0.68rem] font-bold tracking-wider uppercase"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            )}
          </div>

          {/* Row 4: View Details & Edit/Delete actions */}
          <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/60 pt-2.5">
            <span className="group/link flex items-center gap-1.5 text-[0.68rem] font-bold text-ns-primary-lt transition-colors hover:text-white">
              <span>View details</span>
              <ArrowRight
                size={11}
                className="transition-transform group-hover/link:translate-x-0.5"
              />
            </span>
            <div className="flex gap-1 text-ns-ghost">
              <button
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-ns-text-2"
                title="Edit"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  )
}
