import { useState, useRef } from 'react'
import {
  Sparkles,
  ArrowUpRight,
  Folder as FolderIcon,
  Check,
  Star,
  CornerDownLeft,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import { useCreateNoteMutation, useNoteTabsStore } from '@/features/notes'
import { useFoldersQuery } from '@/features/folder'
import { toast } from 'sonner'

export function QuickScratchpadWidget() {
  const navigate = useNavigate()
  const createNoteMutation = useCreateNoteMutation()
  const { openNoteTab, setActiveNoteTab } = useNoteTabsStore()
  const { data: folders = [] } = useFoldersQuery()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string>('')
  const [isPinned, setIsPinned] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = async (openImmediately = false) => {
    const rawContent = content.trim()
    const rawTitle = title.trim()

    if (!rawTitle && !rawContent) {
      toast.error('Please write something in the scratchpad before saving.')
      return
    }

    // If title is empty, infer from first non-empty line of content or use default
    const noteTitle =
      rawTitle ||
      (rawContent.split('\n')[0]
        ? rawContent
            .split('\n')[0]
            .replace(/^[#\s*-_]+/, '')
            .slice(0, 40)
        : 'Quick Scratchpad Note')

    const formattedContent = rawContent
      ? rawContent.startsWith('#')
        ? rawContent
        : `# ${noteTitle}\n\n${rawContent}`
      : `# ${noteTitle}\n\nStart writing your note content...`

    try {
      const created = await createNoteMutation.mutateAsync({
        name: noteTitle,
        content: formattedContent,
        folderId: selectedFolderId || undefined,
        isPinned,
      })

      if (created) {
        // Reset scratchpad state
        setTitle('')
        setContent('')
        setIsPinned(false)
        setIsExpanded(false)

        const folderKey = created.folder_id || 'default'

        openNoteTab(folderKey, {
          id: created.id,
          title: created.name,
          folderId: created.folder_id ?? undefined,
          isPinned: created.isPinned ?? false,
          updated: 'Just now',
          content: created.content ?? formattedContent,
        })
        setActiveNoteTab(folderKey, created.id)

        if (openImmediately) {
          navigate({
            to: `/workspace/folder/${created.folder_id || encodeURIComponent(created.name)}` as any,
          })
        }
      }
    } catch (err) {
      console.error('Failed to save scratchpad note:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      void handleSave(false)
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#120f24]/90 via-[#0e0c1a]/95 to-[#09070f] p-4 shadow-xl backdrop-blur-xl transition-all hover:border-violet-500/35 sm:p-5">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-violet-600/10 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-600/10 blur-3xl transition-opacity group-hover:opacity-100" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/15 text-violet-400 shadow-sm">
            <Sparkles size={14} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white">
              Quick Scratchpad
            </h2>
            <p className="hidden text-[0.65rem] text-ns-faint sm:block">
              Capture a thought instantly • Ctrl + Enter to save
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border transition-all ${
              isPinned
                ? 'border-amber-500/40 bg-amber-500/20 text-amber-400 shadow-sm'
                : 'border-white/10 bg-white/5 text-ns-ghost hover:bg-white/10 hover:text-white'
            }`}
            title={isPinned ? 'Will be pinned to top' : 'Pin note to top'}
          >
            <Star size={13} className={isPinned ? 'fill-amber-400' : ''} />
          </button>
        </div>
      </div>

      {/* Scratchpad Form */}
      <div className="relative z-10 mt-3 flex flex-col gap-2.5">
        {/* Optional Title input */}
        {(isExpanded || title.length > 0) && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)..."
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white placeholder-ns-ghost/60 transition-colors outline-none focus:border-violet-500/50"
            onKeyDown={handleKeyDown}
          />
        )}

        {/* Content Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            rows={isExpanded ? 4 : 2}
            placeholder="Jot down an idea, task, or note snippet..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs leading-relaxed text-white placeholder-ns-ghost/60 transition-all outline-none focus:border-violet-500/50 focus:bg-black/60 focus:ring-1 focus:ring-violet-500/30"
          />
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Left: Folder Picker */}
          <div className="flex items-center gap-1.5">
            <Select
              value={selectedFolderId || 'uncategorized'}
              onValueChange={(val) =>
                setSelectedFolderId(val === 'uncategorized' ? '' : val)
              }
            >
              <SelectTrigger className="h-7.5 rounded-lg border-white/10 bg-black/40 px-2.5 text-[0.7rem] font-semibold text-ns-text-2 shadow-xs transition-colors hover:border-white/20 focus:border-violet-500/40">
                <div className="flex items-center gap-1.5">
                  <FolderIcon size={12} className="text-ns-ghost" />
                  <SelectValue placeholder="Folder" />
                </div>
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="border-white/15 bg-[#120f24] text-white shadow-xl"
              >
                <SelectItem value="uncategorized">📁 Uncategorized</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    📂 {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right: Save Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleSave(true)}
              disabled={createNoteMutation.isPending}
              className="flex h-7.5 cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-[0.7rem] font-bold text-ns-ghost transition-all hover:border-violet-400/30 hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-50"
              title="Save & Open in Full Note Editor"
            >
              <span>Open in Editor</span>
              <ArrowUpRight size={12} />
            </button>

            <button
              type="button"
              onClick={() => void handleSave(false)}
              disabled={createNoteMutation.isPending}
              className="flex h-7.5 cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-600/25 px-3 text-[0.7rem] font-extrabold text-emerald-300 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-600/40 active:scale-95 disabled:opacity-50"
            >
              {createNoteMutation.isPending ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={13} />
                  <span>Save Note</span>
                  <span className="py-0.2 hidden items-center gap-0.5 rounded bg-emerald-500/20 px-1 text-[0.55rem] text-emerald-300 sm:inline-flex">
                    <CornerDownLeft size={9} />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
