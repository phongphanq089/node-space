import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Search,
  FileText,
  Folder,
  Hexagon,
  Sparkles,
  Music,
  Star,
  Tag,
  Trash2,
  FolderPlus,
  FilePlus,
  ArrowRight,
} from 'lucide-react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/shared/ui'

import { NODES, NOTES, WORKSPACES } from '@/shared/mocks/mock-data'
import { useNoteTabsStore } from '@/features/notes'
import type { NoteItem, WorkspaceItem } from '@/shared/mocks/mock-data'
import { useMusicStore } from '@/features/music-player'
import { useFoldersQuery } from '@/features/folder'

type FilterCategory =
  'all' | 'nodes' | 'folders' | 'notes' | 'workspaces' | 'actions'

interface SearchGlobalProps {
  /** Optional custom trigger button style override */
  className?: string
  /** Optional placeholder text for the inline trigger button */
  triggerPlaceholder?: string
}

export function SearchGlobal({
  className,
  triggerPlaceholder = 'Search nodes, notes, actions...',
}: SearchGlobalProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<FilterCategory>('all')
  const navigate = useNavigate()
  const { openTab } = useNoteTabsStore()
  const { setYoutubePlayerMode, setIsPlaying } = useMusicStore()
  const { data: dbFolders = [] } = useFoldersQuery()

  // Global Ctrl+K / Cmd+K listener
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

  // Filtered dataset
  const filteredNodes = React.useMemo(() => {
    if (category !== 'all' && category !== 'nodes') return []
    if (!search.trim()) return NODES.slice(0, 4)
    const q = search.toLowerCase()
    return NODES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.tag?.toLowerCase().includes(q) ||
        n.folderName?.toLowerCase().includes(q)
    )
  }, [search, category])

  const filteredFolders = React.useMemo(() => {
    if (category !== 'all' && category !== 'folders') return []
    if (!search.trim()) return dbFolders.slice(0, 4)
    const q = search.toLowerCase()
    return dbFolders.filter((f) => f.name.toLowerCase().includes(q))
  }, [search, category, dbFolders])

  const filteredNotes = React.useMemo(() => {
    if (category !== 'all' && category !== 'notes') return []
    if (!search.trim()) return NOTES.slice(0, 3)
    const q = search.toLowerCase()
    return NOTES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [search, category])

  const filteredWorkspaces = React.useMemo(() => {
    if (category !== 'all' && category !== 'workspaces') return []
    if (!search.trim()) return WORKSPACES.slice(0, 3)
    const q = search.toLowerCase()
    return WORKSPACES.filter((w) => w.name.toLowerCase().includes(q))
  }, [search, category])

  const quickActions = React.useMemo(() => {
    if (category !== 'all' && category !== 'actions') return []
    const actions = [
      {
        id: 'act-new-note',
        title: 'Create New Note',
        subtitle: 'Open editor with fresh draft',
        icon: FilePlus,
        shortcut: '⌘N',
        onSelect: () => {
          setOpen(false)
          navigate({ to: '/workspace' })
        },
      },
      {
        id: 'act-new-folder',
        title: 'New Folder',
        subtitle: 'Group related nodes together',
        icon: FolderPlus,
        shortcut: '⇧⌘N',
        onSelect: () => {
          setOpen(false)
          navigate({ to: '/workspace/folder' })
        },
      },
      {
        id: 'act-lofi',
        title: 'Toggle Soundscape / Lofi',
        subtitle: 'Play background focus music',
        icon: Music,
        shortcut: '⌘M',
        onSelect: () => {
          setOpen(false)
          setIsPlaying(true)
          setYoutubePlayerMode('modal')
        },
      },
      {
        id: 'act-fav',
        title: 'Starred & Favorites',
        subtitle: 'View bookmarked notes',
        icon: Star,
        shortcut: '⌘F',
        onSelect: () => {
          setOpen(false)
          navigate({ to: '/workspace/favorites' })
        },
      },
      {
        id: 'act-tags',
        title: 'Manage Tags',
        subtitle: 'Browse all tagged items',
        icon: Tag,
        shortcut: '⌘T',
        onSelect: () => {
          setOpen(false)
          navigate({ to: '/workspace/tags' })
        },
      },
      {
        id: 'act-trash',
        title: 'Trash Bin',
        subtitle: 'Recently deleted notes & folders',
        icon: Trash2,
        shortcut: '⌘⌫',
        onSelect: () => {
          setOpen(false)
          navigate({ to: '/workspace/trash' })
        },
      },
    ]

    if (!search.trim()) return actions
    const q = search.toLowerCase()
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
    )
  }, [search, category, navigate, setIsPlaying, setYoutubePlayerMode])

  const totalResults =
    filteredNodes.length +
    filteredFolders.length +
    filteredNotes.length +
    filteredWorkspaces.length +
    quickActions.length

  const filterTabs: { id: FilterCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'nodes', label: 'Nodes', count: filteredNodes.length },
    { id: 'folders', label: 'Folders', count: filteredFolders.length },
    { id: 'notes', label: 'Notes', count: filteredNotes.length },
    { id: 'workspaces', label: 'Workspaces', count: filteredWorkspaces.length },
    { id: 'actions', label: 'Actions', count: quickActions.length },
  ]

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'group relative flex w-full max-w-xl items-center gap-3 rounded-md border border-ns-border bg-ns-input/50 px-3.5 py-2 text-left shadow-lg backdrop-blur-xl transition-all hover:border-ns-primary/60 hover:bg-ns-hover/30 focus:outline-none'
        }
      >
        <Search className="size-4 shrink-0 text-ns-ghost transition-colors group-hover:text-ns-primary-lt" />
        <span className="flex-1 truncate text-xs text-ns-muted sm:text-sm">
          {triggerPlaceholder}
        </span>
        <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-ns-border-soft bg-ns-bg/60 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-ns-faint shadow-inner sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      {/* Global Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global Search & Command Palette"
        description="Search nodes, notes, folders, or run quick workspace actions"
      >
        <Command className="bg-transparent" shouldFilter={false}>
          {/* Header Search Input */}
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Type to search nodes, notes, tags or commands..."
          />

          {/* Filter Category Pills Header */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-ns-border-soft/60 px-4 py-2 text-xs">
            <span className="mr-1 text-[0.65rem] font-bold text-ns-faint uppercase">
              Filter:
            </span>
            {filterTabs.map((tab) => {
              const isActive = category === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-ns-primary text-white shadow-md'
                      : 'text-ns-ghost hover:bg-ns-hover hover:text-ns-text'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`py-0.2 ml-0.5 rounded-full px-1.5 text-[0.6rem] ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-ns-border-soft text-ns-muted'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Results List */}
          <CommandList className="max-h-[420px] p-2">
            {totalResults === 0 && (
              <CommandEmpty className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-ns-border-soft bg-ns-bg/40 text-ns-ghost">
                    <Search className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-ns-text">
                    No results found
                  </p>
                  <p className="max-w-xs text-xs text-ns-muted">
                    We couldn&apos;t find anything matching &quot;{search}
                    &quot;. Try adjusting your keywords or filter.
                  </p>
                </div>
              </CommandEmpty>
            )}

            {/* Quick Actions Group */}
            {quickActions.length > 0 && (
              <CommandGroup heading="Quick Actions">
                {quickActions.map((act) => {
                  const Icon = act.icon
                  return (
                    <CommandItem
                      key={act.id}
                      onSelect={act.onSelect}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ns-hover/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-ns-border-soft bg-ns-bg/60 text-ns-primary-lt transition-colors group-hover:border-ns-primary/50 group-hover:bg-ns-primary/20">
                          <Icon className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-ns-text group-hover:text-white">
                            {act.title}
                          </span>
                          <span className="text-[0.68rem] text-ns-muted">
                            {act.subtitle}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CommandShortcut className="rounded border border-ns-border-soft bg-ns-bg/60 px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-ns-ghost">
                          {act.shortcut}
                        </CommandShortcut>
                        <ArrowRight className="size-3.5 text-ns-ghost opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {/* Nodes Group */}
            {filteredNodes.length > 0 && (
              <>
                {quickActions.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Nodes">
                  {filteredNodes.map((node) => (
                    <CommandItem
                      key={node.title}
                      onSelect={() => {
                        setOpen(false)
                        const noteId = encodeURIComponent(node.title)
                        openTab({
                          id: noteId,
                          title: node.title,
                          folderId: node.folderId,
                          folderName: node.folderName,
                          thumbnail: node.thumbnail,
                          updatedAt: node.updated,
                        })
                        navigate({ to: `/workspace/folder/${noteId}` as any })
                      }}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {node.thumbnail ? (
                          <img
                            src={node.thumbnail}
                            alt=""
                            className="size-8 shrink-0 rounded-lg border border-ns-border-soft object-cover"
                          />
                        ) : (
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-ns-border-soft bg-ns-bg/60 text-ns-primary-lt">
                            <Hexagon className="size-4" />
                          </div>
                        )}
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-semibold text-ns-text group-hover:text-white">
                              {node.title}
                            </span>
                            {node.starred && (
                              <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[0.68rem] text-ns-muted">
                            <span>{node.folderName || 'Unorganized'}</span>
                            <span>•</span>
                            <span>{node.count} notes inside</span>
                          </div>
                        </div>
                      </div>

                      {node.tag && (
                        <span
                          className="shrink-0 rounded-md border border-ns-border-soft bg-ns-hover/40 px-2 py-0.5 font-mono text-[0.65rem] font-semibold"
                          style={{
                            color:
                              node.tagColor || 'var(--color-ns-primary-lt)',
                          }}
                        >
                          {node.tag}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Folders Group */}
            {filteredFolders.length > 0 && (
              <>
                {(quickActions.length > 0 || filteredNodes.length > 0) && (
                  <CommandSeparator />
                )}
                <CommandGroup heading="Folders">
                  {filteredFolders.map((folder) => (
                    <CommandItem
                      key={folder.id}
                      onSelect={() => {
                        setOpen(false)
                        navigate({ to: '/workspace/folder' })
                      }}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-ns-border-soft bg-ns-bg/60"
                          style={{ color: folder.color || '#a78bfa' }}
                        >
                          <Folder className="size-4" />
                        </div>
                        <span className="text-xs font-semibold text-ns-text group-hover:text-white">
                          {folder.name}
                        </span>
                      </div>

                      <span className="rounded-full bg-ns-border-soft px-2 py-0.5 text-[0.65rem] font-medium text-ns-muted">
                        {(folder as { count?: number }).count ?? 0} nodes
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Notes Group */}
            {filteredNotes.length > 0 && (
              <>
                {(quickActions.length > 0 ||
                  filteredNodes.length > 0 ||
                  filteredFolders.length > 0) && <CommandSeparator />}
                <CommandGroup heading="Notes">
                  {filteredNotes.map((note: NoteItem) => (
                    <CommandItem
                      key={note.title}
                      onSelect={() => {
                        setOpen(false)
                        const noteId = encodeURIComponent(note.title)
                        openTab({
                          id: noteId,
                          title: note.title,
                          updatedAt: note.updated,
                          isPinned: note.starred,
                        })
                        navigate({ to: `/workspace/folder/${noteId}` as any })
                      }}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-ns-border-soft bg-ns-bg/60 text-emerald-400">
                          <FileText className="size-4" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-ns-text group-hover:text-white">
                              {note.title}
                            </span>
                            {note.starred && (
                              <Star className="size-3 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <span className="text-[0.68rem] text-ns-muted">
                            Updated {note.updated}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-ns-border-soft bg-ns-bg/50 px-1.5 py-0.5 text-[0.625rem] text-ns-ghost"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Workspaces Group */}
            {filteredWorkspaces.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Workspaces">
                  {filteredWorkspaces.map((ws: WorkspaceItem) => (
                    <CommandItem
                      key={ws.name}
                      onSelect={() => {
                        setOpen(false)
                        navigate({ to: '/workspace' })
                      }}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="size-3 rounded-full border border-white/20"
                          style={{ backgroundColor: ws.color }}
                        />
                        <span className="text-xs font-semibold text-ns-text group-hover:text-white">
                          {ws.name} Workspace
                        </span>
                      </div>
                      <span className="text-[0.65rem] text-ns-ghost">
                        Active space
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {/* Dialog Footer Bar with Shortcuts Hints */}
          <div className="flex shrink-0 items-center justify-between border-t border-ns-border-soft/60 bg-ns-panel/95 px-4 py-2 text-[0.68rem] text-ns-muted backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="py-0.2 rounded border border-ns-border-soft bg-ns-bg/60 px-1 font-mono text-[0.6rem]">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="py-0.2 rounded border border-ns-border-soft bg-ns-bg/60 px-1 font-mono text-[0.6rem]">
                  ↵
                </kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="py-0.2 rounded border border-ns-border-soft bg-ns-bg/60 px-1 font-mono text-[0.6rem]">
                  Esc
                </kbd>
                <span>Close</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-ns-ghost">
              <Sparkles className="size-3 animate-pulse text-ns-primary-lt" />
              <span>NodeSpace Intelligence</span>
            </div>
          </div>
        </Command>
      </CommandDialog>
    </div>
  )
}
