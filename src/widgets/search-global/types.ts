import type * as React from 'react'

export type FilterCategory =
  'all' | 'folders' | 'notes' | 'tags' | 'workspaces' | 'actions'

export interface SearchGlobalProps {
  className?: string
  triggerPlaceholder?: string
}

export interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  shortcut: string
  onSelect: () => void
}
