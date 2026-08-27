import { useState } from 'react'
import { FileText, Plus, Search, X } from 'lucide-react'
import type { NoteItem as NoteItemType } from '@/shared/mocks/mock-data'

import { cn } from '@/shared/lib/utils'
import { Button, Input } from '@/shared/ui'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'
import { NoteItem } from './note-item'

interface NotesSidebarProps {
  open: boolean
  notes: readonly NoteItemType[]
  selectedNote?: NoteItemType | null
  onSelectNote: (note: NoteItemType) => void
  onCloseMobile?: () => void
  onNewNote?: () => void
  onEditNote?: (note: NoteItemType) => void
  onDeleteNote?: (note: NoteItemType) => void
}

export function NotesSidebar({
  open,
  notes,
  selectedNote,
  onSelectNote,
  onCloseMobile,
  onNewNote,
  onEditNote,
  onDeleteNote,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-ns-border-soft bg-ns-surface-alt/75 backdrop-blur-md transition-all duration-300 select-none dark:border-white/10 dark:bg-[#0c0a15]/95',
        open ? 'w-72 shrink-0' : 'w-0 overflow-hidden border-none opacity-0'
      )}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft/60 px-3 py-2.5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-ns-primary/10 text-ns-primary dark:bg-ns-primary/20 dark:text-ns-primary-lt">
            <FileText size={13} />
          </div>
          <span className="text-xs font-bold tracking-wide text-ns-text uppercase dark:text-zinc-200">
            Notes
          </span>
          <span className="py-0.2 rounded-full border border-ns-border-soft bg-ns-surface px-1.5 text-[10px] font-bold text-ns-muted dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            {notes.length}
          </span>
        </div>

        {/* Mobile close */}
        {onCloseMobile && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCloseMobile}
            className="text-ns-muted hover:text-ns-text md:hidden dark:text-zinc-400 dark:hover:text-white"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Filter / Search input */}
      <div className="w-full px-2.5 pt-2.5 pb-1">
        <div className="relative flex items-center">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search notes or #tags..."
            className="h-8 border-ns-border-soft bg-ns-surface pr-7 text-xs dark:border-white/10 dark:bg-white/5"
            suffix={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="flex h-4 w-4 cursor-pointer items-center justify-center rounded text-ns-muted hover:text-ns-text dark:text-zinc-400 dark:hover:text-white"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              ) : (
                <Search
                  size={13}
                  className="text-ns-muted dark:text-zinc-400"
                />
              )
            }
          />
        </div>
      </div>

      {/* Note list */}
      <div className="no-scrollbar flex flex-1 flex-col space-y-1 overflow-y-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ns-border-soft bg-ns-surface text-ns-muted shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
              {searchQuery ? (
                <Search
                  size={18}
                  className="text-ns-muted dark:text-zinc-400"
                />
              ) : (
                <FileText
                  size={18}
                  className="text-ns-primary dark:text-ns-primary-lt"
                />
              )}
            </div>
            <h4 className="mt-2.5 text-xs font-bold text-ns-text dark:text-zinc-100">
              {searchQuery ? 'No matching notes' : 'No notes yet'}
            </h4>
            <p className="mt-1 max-w-[200px] text-[0.7rem] leading-relaxed text-ns-muted dark:text-zinc-400">
              {searchQuery
                ? `No notes match "${searchQuery}". Try a different search keyword.`
                : 'This folder is empty. Create your first note to start writing.'}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-3 cursor-pointer border-ns-border-soft text-xs font-semibold text-ns-muted hover:text-ns-text dark:border-white/10 dark:text-zinc-300 dark:hover:text-white"
              >
                Clear search
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onNewNote
                    ? onNewNote()
                    : useNewNoteDialogStore.getState().open()
                }
                className="mt-3 cursor-pointer gap-1.5 border-ns-border-soft text-xs font-semibold text-ns-primary hover:border-ns-primary/50 hover:bg-ns-primary/10 dark:border-white/10 dark:text-ns-primary-lt dark:hover:bg-white/10"
              >
                <Plus size={12} />
                <span>Create note</span>
              </Button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = selectedNote
              ? note.id && selectedNote.id
                ? note.id === selectedNote.id
                : note.title === selectedNote.title
              : false

            return (
              <NoteItem
                key={note.id || note.title}
                note={note}
                isActive={isActive}
                onSelect={onSelectNote}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
              />
            )
          })
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-ns-border-soft bg-ns-surface/80 p-2 dark:border-white/10 dark:bg-[#0c0a15]/90">
        <button
          type="button"
          onClick={() =>
            onNewNote ? onNewNote() : useNewNoteDialogStore.getState().open()
          }
          className="hover:bg-ns-primary-hover flex h-8.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-ns-primary px-3 text-xs font-bold text-white shadow-md transition-all active:scale-[0.99] dark:shadow-purple-950/50"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>
    </aside>
  )
}
