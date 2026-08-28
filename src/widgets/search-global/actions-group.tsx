// No React import needed - react-jsx handles JSX transformation
import {
  FilePlus,
  FolderPlus,
  Music,
  Star,
  Tag,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { CommandGroup, CommandItem, CommandShortcut } from '@/shared/ui'
import type { QuickAction } from './types'

interface ActionsGroupProps {
  actions: QuickAction[]
}

export function ActionsGroup({ actions }: ActionsGroupProps) {
  if (actions.length === 0) return null

  return (
    <CommandGroup heading="Quick Actions">
      {actions.map((act) => {
        const Icon = act.icon
        return (
          <CommandItem
            key={act.id}
            onSelect={act.onSelect}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 data-[selected=true]:bg-accent dark:data-[selected=true]:bg-ns-hover/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-colors group-data-[selected=true]:border-primary/50 group-data-[selected=true]:bg-primary/10 dark:border-ns-border-soft dark:bg-ns-bg/60 dark:text-ns-primary-lt dark:group-data-[selected=true]:border-ns-primary/50 dark:group-data-[selected=true]:bg-ns-primary/20">
                <Icon className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground group-data-[selected=true]:text-accent-foreground dark:text-ns-text dark:group-data-[selected=true]:text-white">
                  {act.title}
                </span>
                <span className="text-[0.68rem] text-muted-foreground dark:text-ns-muted">
                  {act.subtitle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CommandShortcut className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-muted-foreground dark:border-ns-border-soft dark:bg-ns-bg/60 dark:text-ns-ghost">
                {act.shortcut}
              </CommandShortcut>
              <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-data-[selected=true]:opacity-100 dark:text-ns-ghost" />
            </div>
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}

export function buildQuickActions(opts: {
  navigate: (args: { to: string }) => void
  setOpen: (val: boolean) => void
  setIsPlaying: (val: boolean) => void
  setYoutubePlayerMode: (mode: 'modal' | 'pip' | 'closed') => void
}): QuickAction[] {
  const { navigate, setOpen, setIsPlaying, setYoutubePlayerMode } = opts
  return [
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
}
