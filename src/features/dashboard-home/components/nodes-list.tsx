import { useState } from 'react'

import { Search, Plus, Star } from 'lucide-react'
import { NODES } from '@/constants/moc-data'

const initialNodes = NODES

export default function NodesList() {
  const [nodes, setNodes] = useState(() => initialNodes.map((n) => ({ ...n })))

  const toggleStar = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    setNodes((prev) =>
      prev.map((n) => (n.title === title ? { ...n, starred: !n.starred } : n))
    )
  }

  const selectNode = (title: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.title === title ? { ...n, active: true } : { ...n, active: false }
      )
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-ns-border bg-ns-panel shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
          Nodes List
        </span>
      </div>

      {/* Search & Add */}
      <div className="mx-4 mt-3 mb-2 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ns-border-soft bg-ns-input px-3 py-2 transition-all focus-within:border-ns-border-md">
          <Search size={13} className="text-ns-ghost" />
          <input
            id="input-node-search"
            type="search"
            placeholder="Search nodes..."
            className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
          />
        </div>
        <button
          id="btn-add-node"
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-ns-border-soft bg-ns-input text-ns-ghost transition-all hover:bg-ns-hover hover:text-ns-accent-lt"
          title="Create node"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* List */}
      <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {nodes.map((node) => (
          <div
            key={node.title}
            onClick={() => selectNode(node.title)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
              node.active
                ? 'border-ns-border-em bg-gradient-to-br from-ns-active/40 to-ns-hover/20 shadow-[0_0_12px_rgba(124,58,237,0.1)]'
                : 'border-transparent hover:bg-ns-hover/50'
            }`}
          >
            {node.thumbnail ? (
              <img
                src={node.thumbnail}
                alt={node.title}
                className="h-14 w-14 flex-shrink-0 rounded-lg border border-ns-border object-cover shadow-sm"
              />
            ) : (
              <span className="block h-14 w-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-hover" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="block truncate text-xs font-bold text-ns-text">
                  {node.title}
                </span>

                {/* Interactive Star Toggle */}
                <button
                  onClick={(e) => toggleStar(e, node.title)}
                  className="group/star flex-shrink-0 cursor-pointer rounded-md p-1 transition-all hover:bg-ns-hover/80"
                  title={node.starred ? 'Unstar node' : 'Star node'}
                >
                  <Star
                    size={13}
                    fill={node.starred ? '#fbbf24' : 'none'}
                    className={
                      node.starred
                        ? 'text-amber-400'
                        : 'text-ns-ghost transition-colors group-hover/star:text-amber-400'
                    }
                  />
                </button>
              </div>
              <span className="mt-0.5 block text-[0.62rem] font-medium text-ns-faint">
                {node.count} notes · {node.updated}
              </span>
              <span
                className="mt-1 block text-[0.62rem] font-bold tracking-wide uppercase"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
