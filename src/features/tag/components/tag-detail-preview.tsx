import { useNavigate } from '@tanstack/react-router'
import {
  Hash,
  Folder,
  ArrowUpRight,
  FileText,
  Copy,
  X,
  Clock,
} from 'lucide-react'
import type { TagRecord } from '../tag.fns'
import { useFoldersQuery } from '@/features/folder'
import { useNotesQuery, useNoteTabsStore } from '@/features/notes'
import { Button } from '@/shared/ui'
import { toast } from 'sonner'

interface TagDetailPreviewProps {
  selectedTag: string
  activeTagObj?: TagRecord
  onClose?: () => void
}

export function TagDetailPreview({
  selectedTag,
  activeTagObj,
  onClose,
}: TagDetailPreviewProps) {
  const navigate = useNavigate()
  const { openNoteTab, setActiveNoteTab } = useNoteTabsStore()
  const { data: allFolders = [], isLoading: isLoadingFolders } =
    useFoldersQuery()
  const { data: allNotes = [], isLoading: isLoadingNotes } = useNotesQuery()

  const tagLower = selectedTag.toLowerCase()

  const matchingFolders = allFolders.filter((f: any) =>
    Array.isArray(f.tags)
      ? f.tags.some((t: string) => t.toLowerCase() === tagLower)
      : false
  )

  const matchingNotes = allNotes.filter((n: any) =>
    Array.isArray(n.tags)
      ? n.tags.some((t: string) => t.toLowerCase() === tagLower)
      : false
  )

  const tagColor = activeTagObj?.color ?? '#8b5cf6'
  const tagBg = activeTagObj?.bg ?? `${tagColor}15`
  const totalMatches = matchingFolders.length + matchingNotes.length

  const handleOpenFolder = (folderId: string) => {
    navigate({
      to: `/workspace/folder/${folderId}` as any,
    })
  }

  const handleOpenNote = (note: (typeof allNotes)[number]) => {
    const folderKey = note.folderId || 'default'
    openNoteTab(folderKey, {
      id: note.id,
      title: note.name,
      folderId: note.folderId ?? undefined,
      isPinned: true,
      updated: note.updatedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(new Date(note.updatedAt))
        : 'Recently',
      content: note.content ?? undefined,
    })
    setActiveNoteTab(folderKey, note.id)
    navigate({
      to: `/workspace/folder/${note.folderId || encodeURIComponent(note.name)}` as any,
    })
  }

  const handleCopyTag = () => {
    void navigator.clipboard.writeText(`#${selectedTag}`)
    toast.success(`Copied "#${selectedTag}" to clipboard!`)
  }

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return 'Recently'
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateValue))
    } catch {
      return 'Recently'
    }
  }

  return (
    <section className="mt-4 flex flex-col gap-5 rounded-2xl border border-ns-border-md bg-ns-surface/80 p-5 shadow-lg backdrop-blur-xl transition-all sm:p-6 dark:bg-ns-panel/90">
      {/* Top Header */}
      <div className="flex flex-col gap-3 border-b border-ns-border-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-xl shadow-inner"
            style={{ backgroundColor: tagBg, color: tagColor }}
          >
            <Hash size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-ns-text sm:text-lg">
                Tagged with{' '}
                <span style={{ color: tagColor }}>#{selectedTag}</span>
              </h2>
              <span className="rounded-full bg-ns-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold text-ns-primary dark:text-ns-primary-lt">
                {totalMatches} {totalMatches === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-ns-muted">
              Resources categorized under this topic tag
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTag}
            className="gap-1.5 border-ns-border-soft bg-ns-surface text-xs text-ns-text shadow-xs hover:bg-ns-hover"
          >
            <Copy size={13} />
            <span>Copy #{selectedTag}</span>
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-ns-ghost hover:bg-ns-hover hover:text-ns-text"
              title="Close tag preview"
            >
              <X size={15} />
            </Button>
          )}
        </div>
      </div>

      {/* Grid Content: Matching Folders and Notes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Matching Folders Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-ns-muted uppercase">
              <Folder size={13} className="text-blue-500" />
              <span>Matching Folders ({matchingFolders.length})</span>
            </span>
          </div>

          {isLoadingFolders ? (
            <div className="py-6 text-center text-xs text-ns-faint">
              Loading folders...
            </div>
          ) : matchingFolders.length > 0 ? (
            <div className="flex flex-col gap-2">
              {matchingFolders.map((f: any) => {
                const folderColor = f.color || '#6366f1'
                return (
                  <div
                    key={f.id}
                    onClick={() => handleOpenFolder(f.id)}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-ns-border-soft bg-ns-surface p-3 text-xs font-semibold text-ns-text shadow-xs transition-all hover:border-ns-border-md hover:bg-ns-hover"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: folderColor }}
                      />
                      <span className="truncate text-sm font-bold text-ns-text group-hover:text-ns-primary">
                        {f.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-ns-ghost group-hover:text-ns-primary">
                      <span className="text-[11px] font-medium">Open</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ns-border-soft bg-ns-surface-alt/40 p-5 text-center text-xs text-ns-muted">
              No folders tagged with #{selectedTag}
            </div>
          )}
        </div>

        {/* Matching Notes Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-ns-muted uppercase">
              <FileText size={13} className="text-ns-primary" />
              <span>Matching Notes ({matchingNotes.length})</span>
            </span>
          </div>

          {isLoadingNotes ? (
            <div className="py-6 text-center text-xs text-ns-faint">
              Loading notes...
            </div>
          ) : matchingNotes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {matchingNotes.map((note: any) => (
                <div
                  key={note.id}
                  onClick={() => handleOpenNote(note)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-ns-border-soft bg-ns-surface p-3 text-xs font-semibold text-ns-text shadow-xs transition-all hover:border-ns-border-md hover:bg-ns-hover"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ns-primary/10 text-ns-primary dark:text-ns-primary-lt">
                      <FileText size={14} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-ns-text group-hover:text-ns-primary">
                        {note.name}
                      </h4>
                      <span className="flex items-center gap-1 text-[11px] font-normal text-ns-ghost">
                        <Clock size={10} />
                        {formatDate(note.updatedAt || note.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-ns-ghost group-hover:text-ns-primary">
                    <span className="text-[11px] font-medium">Read</span>
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ns-border-soft bg-ns-surface-alt/40 p-5 text-center text-xs text-ns-muted">
              No notes tagged with #{selectedTag}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
