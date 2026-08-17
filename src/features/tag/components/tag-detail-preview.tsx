import { useNavigate } from '@tanstack/react-router'
import { Hash, Folder, ArrowRight, FileText } from 'lucide-react'
import type { TagRecord } from '../tag.fns'
import { useFoldersQuery } from '@/features/folder'

interface TagDetailPreviewProps {
  selectedTag: string
  activeTagObj?: TagRecord
}

export function TagDetailPreview({
  selectedTag,
  activeTagObj,
}: TagDetailPreviewProps) {
  const navigate = useNavigate()
  const { data: allFolders = [], isLoading } = useFoldersQuery()

  const matchingFolders = allFolders.filter((f: any) =>
    f.tags?.some((t: string) => t.toLowerCase() === selectedTag.toLowerCase())
  )

  const handleOpenFolder = (workspaceId?: string | null) => {
    void navigate({
      to: '/workspace/folder',
      search: {
        workspaceId: workspaceId || undefined,
        tag: selectedTag,
      },
    })
  }

  return (
    <section className="mt-4 flex flex-col gap-4 rounded-2xl border border-ns-border-md bg-ns-panel/80 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-ns-border-soft pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex size-7 items-center justify-center rounded-lg border border-white/10 shadow-inner"
            style={{
              backgroundColor: activeTagObj?.bg ?? 'rgba(59, 130, 246, 0.12)',
              color: activeTagObj?.color ?? '#3b82f6',
            }}
          >
            <Hash size={14} />
          </div>
          <h2 className="text-base font-bold text-white">
            Items tagged with{' '}
            <span style={{ color: activeTagObj?.color ?? '#3b82f6' }}>
              #{selectedTag}
            </span>
          </h2>
        </div>
        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-purple-300">
          {matchingFolders.length} matching folders
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Matching Real DB Folders */}
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[0.68rem] font-bold text-ns-ghost uppercase">
            <Folder size={12} className="text-ns-primary-lt" />
            <span>Matching Folders</span>
          </span>

          {isLoading ? (
            <div className="py-4 text-center text-xs text-ns-faint">
              Loading matching folders...
            </div>
          ) : matchingFolders.length > 0 ? (
            matchingFolders.map((f: any) => (
              <div
                key={f.id}
                onClick={() => handleOpenFolder(f.workspace_id)}
                className="group flex cursor-pointer items-center justify-between rounded-xl border border-ns-border-soft bg-ns-bg/40 p-3 text-xs font-semibold text-ns-text transition-all hover:border-purple-500/40 hover:bg-ns-hover/50 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: f.color || '#a78bfa' }}
                  />
                  <span>{f.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.68rem] text-ns-primary-lt group-hover:text-white">
                  <span>View</span>
                  <ArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="py-2 text-xs text-ns-ghost italic">
              No folders tagged with #{selectedTag} yet
            </p>
          )}
        </div>

        {/* Info & Direct Filter Shortcut */}
        <div className="flex flex-col gap-2 rounded-xl border border-ns-border-soft/60 bg-ns-bg/30 p-4">
          <span className="flex items-center gap-1.5 font-mono text-[0.68rem] font-bold text-ns-ghost uppercase">
            <FileText size={12} className="text-purple-400" />
            <span>Quick Filter Shortcut</span>
          </span>
          <p className="text-xs leading-relaxed text-ns-muted">
            Click any matching folder above or use the button below to open the
            complete folder workspace filtered by{' '}
            <strong className="text-purple-300">#{selectedTag}</strong>.
          </p>
          <button
            type="button"
            onClick={() => handleOpenFolder(null)}
            className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/20 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-purple-500/30 active:scale-95"
          >
            <span>Open All Folders Tagged #{selectedTag}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  )
}
