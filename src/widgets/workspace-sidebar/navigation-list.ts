export interface NavItem {
  icon: string
  label: string
  to: string
  exact?: boolean
}

export const NAVIGATION_LIST: readonly NavItem[] = [
  { icon: 'home', label: 'Home', to: '/workspace', exact: true },
  { icon: 'layers', label: 'Workspaces', to: '/workspace/workspaces' },
  { icon: 'folder', label: 'Folder', to: '/workspace/folder' },
  { icon: 'star', label: 'Favorites', to: '/workspace/favorites' },
  { icon: 'tag', label: 'Tags', to: '/workspace/tags' },
  { icon: 'trash', label: 'Trash', to: '/workspace/trash' },
  { icon: 'music', label: 'Music Manager', to: '/workspace/music' },
]
