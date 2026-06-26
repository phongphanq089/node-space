import { NODES } from '../data/mock'

const iconBtnSm =
  'flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost hover:bg-ns-hover-md hover:text-ns-accent-lt transition-all'

export default function NodesList() {
  return (
    <div className="overflow-hidden rounded-xl border border-ns-border bg-ns-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <span className="text-sm font-semibold text-ns-text-2">Nodes List</span>
        <div className="flex gap-1">
          <button id="btn-search-node" className={iconBtnSm}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button id="btn-add-node" className={iconBtnSm}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mx-3 my-2 flex items-center gap-2 rounded-lg border border-ns-border-soft bg-ns-input px-3 py-1.5">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-ns-ghost"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="input-node-search"
          type="search"
          placeholder="Search nodes..."
          className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
        />
      </div>

      {/* List */}
      <div className="divide-y divide-ns-border-soft">
        {NODES.map((node) => (
          <button
            key={node.title}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-ns-hover ${node.active ? 'border-l-2 border-ns-accent bg-ns-active' : ''}`}
          >
            <span className="block h-9 w-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-active" />
            <span className="block min-w-0 flex-1">
              <span className="mb-0.5 block truncate text-xs font-semibold text-ns-text">
                {node.title}
              </span>
              <span className="block text-[0.65rem] text-ns-faint">
                {node.count} notes · {node.updated}
              </span>
              <span
                className="block text-[0.65rem] font-semibold"
                style={{ color: node.tagColor }}
              >
                {node.tag}
              </span>
            </span>
            {'starred' in node && node.starred && (
              <span className="text-sm text-yellow-400">★</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
