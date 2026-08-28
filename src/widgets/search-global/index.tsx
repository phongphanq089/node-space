import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/shared/ui'

import { useMusicStore } from '@/features/music-player'
import { useFoldersQuery } from '@/features/folder'
import { useNotesQuery, useNoteTabsStore } from '@/features/notes'
import { useTagsQuery } from '@/features/tag'
import { useWorkspacesQuery } from '@/features/workspace'

import type { FilterCategory, SearchGlobalProps } from './types'
import { SearchTriggerButton } from './search-trigger-button'
import { FilterTabs } from './filter-tabs'
import { FoldersGroup } from './folders-group'
import { NotesGroup } from './notes-group'
import { TagsGroup } from './tags-group'
import { WorkspacesGroup } from './workspaces-group'
import { ActionsGroup, buildQuickActions } from './actions-group'
import { DialogFooter } from './dialog-footer'

export function SearchGlobal({
  className,
  triggerPlaceholder = 'Search workspaces, folders, notes, tags...',
}: SearchGlobalProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<FilterCategory>('all')
  const navigate = useNavigate()
  const { openTab, openNoteTab, setActiveNoteTab } = useNoteTabsStore()
  const { setYoutubePlayerMode, setIsPlaying } = useMusicStore()

  // ── Real API data ──────────────────────────────────────────────────
  const { data: dbFolders = [] } = useFoldersQuery()
  const { data: dbNotes = [] } = useNotesQuery({ search: search || undefined })
  const { data: dbTags = [] } = useTagsQuery(search || undefined)
  const { data: dbWorkspaces = [] } = useWorkspacesQuery(search || undefined)

  // ── Global ⌘K shortcut ────────────────────────────────────────────
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setSearch('')
      setCategory('all')
    }
  }, [open])

  // ── Filtered datasets (respect active category) ────────────────────
  const filteredFolders = React.useMemo(() => {
    if (category !== 'all' && category !== 'folders') return []
    const q = search.toLowerCase().trim()
    if (!q) return dbFolders
    return dbFolders.filter((f) => f.name.toLowerCase().includes(q))
  }, [search, category, dbFolders])

  const filteredNotes = React.useMemo(() => {
    if (category !== 'all' && category !== 'notes') return []
    return dbNotes
  }, [dbNotes, category])

  const filteredTags = React.useMemo(() => {
    if (category !== 'all' && category !== 'tags') return []
    return dbTags
  }, [dbTags, category])

  const filteredWorkspaces = React.useMemo(() => {
    if (category !== 'all' && category !== 'workspaces') return []
    return dbWorkspaces
  }, [dbWorkspaces, category])

  const quickActions = React.useMemo(() => {
    if (category !== 'all' && category !== 'actions') return []
    const all = buildQuickActions({
      navigate,
      setOpen,
      setIsPlaying,
      setYoutubePlayerMode,
    })
    const q = search.toLowerCase().trim()
    if (!q) return all
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
    )
  }, [search, category, navigate, setIsPlaying, setYoutubePlayerMode])

  // ── Tab badge counts (always all, ignoring active category) ────────
  const tabCounts = React.useMemo<Record<FilterCategory, number>>(() => {
    const q = search.toLowerCase().trim()

    const foldersCount = !q
      ? dbFolders.length
      : dbFolders.filter((f) => f.name.toLowerCase().includes(q)).length

    const notesCount = dbNotes.length
    const tagsCount = dbTags.length
    const workspacesCount = dbWorkspaces.length

    const allActions = buildQuickActions({
      navigate,
      setOpen,
      setIsPlaying,
      setYoutubePlayerMode,
    })
    const actionsCount = !q
      ? allActions.length
      : allActions.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.subtitle.toLowerCase().includes(q)
        ).length

    const allCount =
      foldersCount + notesCount + tagsCount + workspacesCount + actionsCount

    return {
      all: allCount,
      folders: foldersCount,
      notes: notesCount,
      tags: tagsCount,
      workspaces: workspacesCount,
      actions: actionsCount,
    }
  }, [
    search,
    dbFolders,
    dbNotes,
    dbTags,
    dbWorkspaces,
    navigate,
    setIsPlaying,
    setYoutubePlayerMode,
  ])

  const totalResults =
    filteredFolders.length +
    filteredNotes.length +
    filteredTags.length +
    filteredWorkspaces.length +
    quickActions.length

  // ── Handlers ───────────────────────────────────────────────────────
  const handleFolderSelect = React.useCallback(
    (folder: { id: string; name: string; color?: string | null }) => {
      setOpen(false)
      // 1. Open the folder tab in workspace tab bar
      openTab({
        id: folder.id,
        title: folder.name,
        folderId: folder.id,
        folderName: folder.name,
      })
      // 2. Navigate into folder detail view
      navigate({ to: `/workspace/folder/${folder.id}` as any })
    },
    [navigate, openTab]
  )

  const handleNoteSelect = React.useCallback(
    (note: {
      id?: string
      name: string
      folderId?: string | null
      folder_id?: string | null
      folderName?: string | null
      content?: string | null
      tags?: string[]
      updatedAt?: string | Date | null
      isPinned?: boolean | null
    }) => {
      setOpen(false)
      const noteId = note.id || encodeURIComponent(note.name)
      const folderKey = note.folderId || note.folder_id || 'default'
      const matchedFolder = dbFolders.find((f) => f.id === folderKey)
      const folderTitle = matchedFolder?.name || note.folderName || 'Folder'

      // 1. Open the parent folder tab in the top workspace tabs bar
      openTab({
        id: folderKey,
        title: folderTitle,
        folderId: folderKey,
        folderName: folderTitle,
        thumbnail: matchedFolder?.image ?? undefined,
      })

      // 2. Open this specific note inside that folder's note tabs & set as active note
      openNoteTab(folderKey, {
        id: noteId,
        title: note.name,
        folderId: folderKey,
        folderName: folderTitle,
        tags: note.tags,
        isPinned: note.isPinned ?? false,
        content: note.content ?? undefined,
        updatedAt:
          note.updatedAt instanceof Date
            ? note.updatedAt.toISOString()
            : (note.updatedAt ?? undefined),
      })
      setActiveNoteTab(folderKey, noteId)

      // 3. Navigate into that folder to view and edit the active note
      navigate({ to: `/workspace/folder/${folderKey}` as any })
    },
    [navigate, openTab, openNoteTab, setActiveNoteTab, dbFolders]
  )

  const handleTagSelect = React.useCallback(
    (_tag: { id: string; name: string }) => {
      setOpen(false)
      navigate({ to: '/workspace/tags' })
    },
    [navigate]
  )

  const handleWorkspaceSelect = React.useCallback(
    (ws: { id: string; name: string }) => {
      setOpen(false)
      navigate({
        to: '/workspace/folder',
        search: { workspaceId: ws.id },
      })
    },
    [navigate]
  )

  // ── Separator helpers ──────────────────────────────────────────────
  const hasActions = quickActions.length > 0
  const hasFolders = filteredFolders.length > 0
  const hasNotes = filteredNotes.length > 0
  const hasTags = filteredTags.length > 0

  return (
    <div className="w-full">
      <SearchTriggerButton
        onClick={() => setOpen(true)}
        className={className}
        placeholder={triggerPlaceholder}
      />

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global Search & Command Palette"
        description="Search folders, notes, tags or run quick workspace actions"
      >
        <Command className="bg-transparent" shouldFilter={false}>
          {/* Search Input */}
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search folders, notes, tags or run a command..."
          />

          {/* Filter Tabs */}
          <FilterTabs
            category={category}
            setCategory={setCategory}
            counts={tabCounts}
          />

          {/* Results */}
          <CommandList className="max-h-[420px] p-2">
            {totalResults === 0 && (
              <CommandEmpty className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background/40 text-muted-foreground dark:border-ns-border-soft dark:bg-ns-bg/40 dark:text-ns-ghost">
                    <Search className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-ns-text">
                    No results found
                  </p>
                  <p className="max-w-xs text-xs text-muted-foreground dark:text-ns-muted">
                    {search
                      ? `Nothing matched "${search}". Try different keywords.`
                      : 'Start typing to search folders, notes, or tags.'}
                  </p>
                </div>
              </CommandEmpty>
            )}

            {/* Quick Actions */}
            <ActionsGroup actions={quickActions} />

            {/* Folders */}
            <FoldersGroup
              folders={filteredFolders}
              hasSeparatorAbove={hasActions}
              onSelect={handleFolderSelect}
            />

            {/* Notes */}
            <NotesGroup
              notes={filteredNotes.map((n) => {
                const parentFolder = dbFolders.find((f) => f.id === n.folderId)
                return {
                  id: n.id,
                  name: n.name,
                  tags: n.tags ?? [],
                  updatedAt: n.updatedAt,
                  isPinned: n.isPinned,
                  isFavorite: n.isFavorite,
                  folderId: n.folderId,
                  folder_id: n.folderId,
                  folderName: parentFolder?.name,
                  content: n.content,
                }
              })}
              hasSeparatorAbove={hasActions || hasFolders}
              onSelect={handleNoteSelect}
            />

            {/* Tags */}
            <TagsGroup
              tags={filteredTags}
              hasSeparatorAbove={hasActions || hasFolders || hasNotes}
              onSelect={handleTagSelect}
            />

            {/* Workspaces */}
            <WorkspacesGroup
              workspaces={filteredWorkspaces}
              hasSeparatorAbove={
                hasActions || hasFolders || hasNotes || hasTags
              }
              onSelect={handleWorkspaceSelect}
            />
          </CommandList>

          {/* Footer */}
          <DialogFooter resultCount={totalResults} />
        </Command>
      </CommandDialog>
    </div>
  )
}
