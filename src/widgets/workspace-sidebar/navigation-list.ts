export interface NavItem {
  icon: string
  label: string
  to: string
  exact?: boolean
}

export const NAVIGATION_LIST: readonly NavItem[] = [
  { icon: 'folder', label: 'Folders', to: '/workspace/folder' },
  { icon: 'layers', label: 'Workspaces', to: '/workspace/workspaces' },
  { icon: 'star', label: 'Favorites', to: '/workspace/favorites' },
  { icon: 'tag', label: 'Tags', to: '/workspace/tags' },
  { icon: 'music', label: 'Music Manager', to: '/workspace/music' },
  { icon: 'trash', label: 'Trash', to: '/workspace/trash' },
]
