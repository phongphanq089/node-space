import { useState } from 'react'
import { NODES } from '@/shared/constants/moc-data'
import { X } from 'lucide-react'
import { GlowCardGrid } from '@/shared/ui/system/glow-card-grid'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { CreateFolderModal } from './create-folder-modal'
import { NoteDetailModal } from '@/features/notes/components/note-detail-modal'
import { NodeSearchBar } from './node-search-bar'
import { FolderFilterPills } from './folder-filter-pills'
import { NodeCard } from './node-card'

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

  const resetFilters = () => {
    setSelectedFolderId(null)
    setSearch('')
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <NodeSearchBar
          search={search}
          onSearchChange={setSearch}
          onCreateFolder={() => setIsCreateFolderOpen(true)}
        />

        <FolderFilterPills
          nodes={nodes}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </div>

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
                onClick={resetFilters}
                className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-ns-border bg-ns-panel px-3 py-1.5 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
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
            <NodeCard
              key={node.title}
              node={node}
              onSelect={setSelectedNode}
              onToggleStar={toggleStar}
            />
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
