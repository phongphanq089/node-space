import { useState } from 'react'
import { FOLDERS, NODES } from '@/constants/moc-data'
import {
  Search,
  Plus,
  Star,
  Edit2,
  Trash2,
  X,
  FileText,
  Clock,
  ArrowRight,
  Folder,
  FolderOpen,
  Filter,
  Layers,
} from 'lucide-react'
import { GlowCard, GlowCardGrid } from '@/components/shared/glow-card-grid'
import { EmptyState } from '@/components/shared/empty-state'
import { CreateFolderModal } from './create-folder-modal'
import { NoteDetailModal } from '@/components/shared/note-detail-modal'

type NodeWithThumbnail = (typeof NODES)[number] & { thumbnail?: string }

export default function FoldersList() {
  const [nodes, setNodes] = useState<NodeWithThumbnail[]>(() =>
    NODES.map((n) => ({ ...n }))
  )
  const [selectedNode, setSelectedNode] = useState<NodeWithThumbnail | null>(
    null
  )
  const [search, setSearch] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  const toggleStar = (e: React.MouseEvent, title: string) => {
    e.stopPropagation()
    setNodes((prev) =>
      prev.map((n) => (n.title === title ? { ...n, starred: !n.starred } : n))
    )
  }

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase())
    const matchesFolder = selectedFolderId
      ? n.folderId === selectedFolderId
      : true
    return matchesSearch && matchesFolder
  })

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-ns-border bg-ns-panel px-3 py-2 transition-all focus-within:border-ns-border-md">
            <Search size={13} className="flex-shrink-0 text-ns-ghost" />
            <input
              type="search"
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
            />
          </div>
          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-ns-primary to-ns-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-ns-primary/10 transition-all hover:opacity-90"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>

        {/* ── Folder Filter Pills Bar ── */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-ns-border-soft pr-2">
            <Filter size={11} className="text-ns-ghost" />
            <span className="text-[0.62rem] font-bold tracking-wider text-ns-muted uppercase">
              Folders:
            </span>
          </div>

          {/* "All Folders" Pill */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.65rem] font-bold transition-all ${
              selectedFolderId === null
                ? 'border-ns-primary/50 bg-ns-primary/15 text-ns-primary-lt shadow-sm'
                : 'border-ns-border-soft bg-ns-panel/60 text-ns-ghost hover:border-ns-border hover:text-ns-text-2'
            }`}
          >
            <Layers size={11} />
            <span>All ({nodes.length})</span>
          </button>

          {/* Folder Chips */}
          {FOLDERS.map((f) => {
            const isSelected = selectedFolderId === f.id
            const count = nodes.filter((n) => n.folderId === f.id).length
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(isSelected ? null : f.id)}
                className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.65rem] font-semibold transition-all ${
                  isSelected
                    ? 'border-ns-border-em bg-ns-active/80 text-ns-primary-lt shadow-sm'
                    : 'border-ns-border-soft bg-ns-panel/40 text-ns-muted hover:border-ns-border hover:bg-ns-hover/40 hover:text-ns-text'
                }`}
              >
                {isSelected ? (
                  <FolderOpen
                    size={11}
                    style={{ color: f.color ?? '#a78bfa' }}
                  />
                ) : (
                  <Folder size={11} style={{ color: f.color ?? '#94a3b8' }} />
                )}
                <span>{f.name}</span>
                <span className="py-0.2 rounded-full bg-ns-border-soft/60 px-1.5 text-[0.55rem] font-bold text-ns-faint">
                  {count}
                </span>
              </button>
            )
          })}

          {selectedFolderId && (
            <button
              onClick={() => setSelectedFolderId(null)}
              className="flex flex-shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[0.62rem] font-bold text-red-400 hover:bg-red-500/20"
              title="Clear folder filter"
            >
              <X size={10} />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Nodes Grid ── */}
      {filteredNodes.length === 0 ? (
        <EmptyState
          variant={selectedFolderId ? 'folder' : search ? 'search' : 'default'}
          title={
            selectedFolderId
              ? 'No nodes found in this folder'
              : search
                ? `No nodes found for "${search}"`
                : 'No nodes available'
          }
          description="Try clearing your search query or selecting another folder filter."
          action={
            (selectedFolderId || search) && (
              <button
                onClick={() => {
                  setSelectedFolderId(null)
                  setSearch('')
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-ns-border bg-ns-panel px-3 py-1.5 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
              >
                <X size={12} />
                <span>Reset Filters</span>
              </button>
            )
          }
        />
      ) : (
        <GlowCardGrid className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
          {filteredNodes.map((node) => (
            <GlowCard
              key={node.title}
              avatar={node.thumbnail}
              className="cursor-pointer"
            >
              <div
                onClick={() => setSelectedNode(node)}
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
                      onClick={(e) => toggleStar(e, node.title)}
                      className="flex-shrink-0 cursor-pointer rounded p-1 text-ns-ghost transition-all hover:bg-ns-hover/80 hover:text-amber-400"
                      title={node.starred ? 'Unstar' : 'Star'}
                    >
                      <Star
                        size={13}
                        fill={node.starred ? '#fbbf24' : 'none'}
                        className={
                          node.starred ? 'text-amber-400' : 'text-ns-ghost'
                        }
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
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="cursor-pointer rounded p-1 transition-colors hover:bg-ns-hover hover:text-ns-text-2"
                        title="Edit"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
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
          ))}
        </GlowCardGrid>
      )}

      {/* Node Detail Modal */}
      {selectedNode && (
        <NoteDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </>
  )
}
