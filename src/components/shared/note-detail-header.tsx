import {
  Folder,
  MessageSquare,
  Edit2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  X,
} from 'lucide-react'
import type { NODES } from '@/constants/moc-data'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

interface NoteDetailHeaderProps {
  node: NodeWithThumbnail
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onClose: () => void
}

export function NoteDetailHeader({
  node,
  sidebarOpen,
  onToggleSidebar,
  onClose,
}: NoteDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-ns-border-soft bg-ns-panel/80 px-5 py-3 backdrop-blur-sm">
      {/* Node info */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {node.thumbnail ? (
          <img
            src={node.thumbnail}
            alt={node.title}
            className="h-8 w-8 flex-shrink-0 rounded-lg border border-ns-border object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-ns-border bg-gradient-to-br from-ns-active to-ns-hover text-xs font-extrabold text-white shadow-sm">
            N
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-sm font-extrabold text-ns-text">
            {node.title}
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {node.folderName && (
              <span className="flex items-center gap-1 text-[0.58rem] font-semibold text-ns-primary-lt">
                <Folder size={9} />
                {node.folderName}
              </span>
            )}
            {node.tag && (
              <span
                className="text-[0.58rem] font-bold tracking-wider uppercase"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            )}
            {node.starred && (
              <Star size={9} fill="#fbbf24" className="text-amber-400" />
            )}
            <span className="text-[0.58rem] text-ns-faint">
              · {node.updated}
            </span>
            <span className="flex items-center gap-1 text-[0.58rem] text-ns-faint">
              <MessageSquare size={9} />
              {node.count} notes
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-shrink-0 items-center gap-0.5">
        <button
          onClick={onToggleSidebar}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover hover:text-ns-primary-lt"
          title={sidebarOpen ? 'Hide notes panel' : 'Show notes panel'}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={14} />
          ) : (
            <PanelLeftOpen size={14} />
          )}
        </button>
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover hover:text-ns-primary-lt"
          title="Edit node"
        >
          <Edit2 size={13} />
        </button>
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover hover:text-ns-primary-lt"
          title="More options"
        >
          <MoreHorizontal size={14} />
        </button>
        <div className="mx-1.5 h-5 w-px bg-ns-border-soft" />
        <button
          onClick={onClose}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-red-500/10 hover:text-red-400"
          title="Close"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
