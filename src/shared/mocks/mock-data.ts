export interface WorkspaceItem {
  color: string
  name: string
}

export interface FolderItem {
  id: string
  name: string
  color?: string
  count?: number
}

export interface NodeItem {
  title: string
  count: number
  updated: string
  tag?: string
  tagColor?: string
  folderId?: string
  folderName?: string
  active?: boolean
  starred?: boolean
}

export interface NoteItem {
  id?: string
  title: string
  tags: string[]
  updated: string
  starred?: boolean
  content?: string
  isFavorite?: boolean
}

export interface FeatureItem {
  title: string
  desc: string
  color: string
}

export interface PlaylistItem {
  title: string
  artist: string
  active?: boolean
}

export const WORKSPACES: readonly WorkspaceItem[] = [
  { color: '#f97316', name: 'Personal' },
  { color: '#ec4899', name: 'Dev Projects' },
  { color: '#a855f7', name: 'Study' },
  { color: '#eab308', name: 'Ideas' },
  { color: '#3b82f6', name: 'Archive' },
]

export const FOLDERS: readonly FolderItem[] = [
  { id: 'f-1', name: 'Documentation', color: '#a78bfa', count: 2 },
  { id: 'f-2', name: 'Algorithms', color: '#34d399', count: 1 },
  { id: 'f-3', name: 'DevOps & Systems', color: '#60a5fa', count: 1 },
  { id: 'f-4', name: 'Reading List', color: '#f87171', count: 1 },
  { id: 'f-5', name: 'Database & Architecture', color: '#f97316', count: 2 },
]

export const NODES: readonly (NodeItem & { thumbnail?: string })[] = [
  {
    title: 'Node-based Note System',
    count: 6,
    updated: 'Updated 2 hours ago',
    tag: '#productivity',
    tagColor: '#a78bfa',
    folderId: 'f-1',
    folderName: 'Documentation',
    active: true,
    starred: true,
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Dijkstra Algorithm Explained',
    count: 8,
    updated: 'Updated 5 hours ago',
    tag: '#algorithm',
    tagColor: '#34d399',
    folderId: 'f-2',
    folderName: 'Algorithms',
    starred: true,
    thumbnail:
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Setup Dev Environment 2024',
    count: 10,
    updated: 'Updated 1 day ago',
    tag: '#devops',
    tagColor: '#60a5fa',
    folderId: 'f-3',
    folderName: 'DevOps & Systems',
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Must-read Books for Devs',
    count: 12,
    updated: 'Updated 2 days ago',
    tag: '#book',
    tagColor: '#f87171',
    folderId: 'f-4',
    folderName: 'Reading List',
    thumbnail:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Database Design Patterns',
    count: 15,
    updated: 'Updated 3 days ago',
    tag: '#database',
    tagColor: '#f97316',
    folderId: 'f-5',
    folderName: 'Database & Architecture',
    thumbnail:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Clean Code Note',
    count: 7,
    updated: 'Updated 3 days ago',
    tag: '#clean-code',
    tagColor: '#3b82f6',
    folderId: 'f-1',
    folderName: 'Documentation',
    thumbnail:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Linux Commands Cheatsheet',
    count: 9,
    updated: 'Updated 4 days ago',
    tag: '#linux',
    tagColor: '#a855f7',
    folderId: 'f-5',
    folderName: 'Database & Architecture',
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=60',
  },
]

export const NOTES: readonly NoteItem[] = [
  {
    title: 'Key Features',
    tags: ['#overview', '#feature'],
    updated: '2 hours ago',
    starred: true,
  },
  {
    title: 'Technologies Used',
    tags: ['#tech', '#stack'],
    updated: '2 hours ago',
  },
  {
    title: 'Development Roadmap',
    tags: ['#roadmap', '#plan'],
    updated: '1 day ago',
  },
  {
    title: 'Use Cases',
    tags: ['#usecase', '#example'],
    updated: '1 day ago',
  },
  {
    title: 'Benefits & Value',
    tags: ['#benefit', '#value'],
    updated: '2 days ago',
  },
]

export const FEATURES: readonly FeatureItem[] = [
  {
    title: 'Node Link',
    desc: 'Connect ideas visually',
    color: 'ns-purple',
  },
  {
    title: 'Markdown Editor',
    desc: 'Supports Markdown and syntax highlighting',
    color: 'ns-primary',
  },
  {
    title: 'Graph View',
    desc: 'View all connections in a graph view',
    color: 'ns-pink',
  },
  {
    title: 'Focus Mode',
    desc: 'Focus on writing in a quiet space',
    color: 'ns-amber',
  },
]

export const PLAYLIST: readonly PlaylistItem[] = [
  { title: 'Midnight Coding', artist: 'Lofi Beats', active: true },
  { title: 'Coding Vibes', artist: 'Lofi Beats' },
  { title: 'Rainy Days', artist: 'Chillhop Music' },
  { title: 'Night Drive', artist: 'Synthwave' },
]

export const data_workspaces = [
  {
    name: 'Personal Life Management',

    url: '#',
  },
  {
    name: 'Professional Development',

    url: '#',
  },
  {
    name: 'Creative Projects',

    url: '#',
  },
  {
    name: 'Home Management',

    url: '#',
  },
  {
    name: 'Travel & Adventure',

    url: '#',
  },
]

export interface NotebookItem {
  id: string
  workspace_id?: string
  author_id?: string
  name: string
  image: string
  count: number
  createdAt?: string
  updatedAt?: string
}

export const NOTEBOOKS: readonly NotebookItem[] = [
  {
    id: 'nb-1',
    name: 'Personal',
    count: 42,
    image:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-2',
    name: 'Dev Projects',
    count: 28,
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-3',
    name: 'Study',
    count: 35,
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-4',
    name: 'Ideas',
    count: 19,
    image:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-5',
    name: 'Archive',
    count: 15,
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-6',
    name: 'Documentation',
    count: 22,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-7',
    name: 'Algorithms',
    count: 18,
    image:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'nb-8',
    name: 'DevOps & Systems',
    count: 23,
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=60',
  },
]

export interface TagItem {
  id: string
  name: string
  count: number
  workspace_id?: string
}

export const POPULAR_TAGS: readonly TagItem[] = [
  { id: 'tag-1', name: 'productivity', count: 24 },
  { id: 'tag-2', name: 'algorithms', count: 18 },
  { id: 'tag-3', name: 'devops', count: 16 },
  { id: 'tag-4', name: 'book', count: 12 },
  { id: 'tag-5', name: 'clean-code', count: 10 },
  { id: 'tag-6', name: 'database', count: 9 },
  { id: 'tag-7', name: 'linux', count: 8 },
  { id: 'tag-8', name: 'frontend', count: 7 },
  { id: 'tag-9', name: 'tutorial', count: 6 },
  { id: 'tag-10', name: 'backend', count: 5 },
]

export interface PinnedNoteItem {
  id: string
  name: string
  folder_id?: string
  folderName: string
  updatedAt: string
  thumbnail: string
  isPinned: boolean
}

export const PINNED_NOTES: readonly PinnedNoteItem[] = [
  {
    id: 'pn-1',
    name: 'Dijkstra Algorithm Explained',
    folderName: 'Algorithms',
    updatedAt: '5h ago',
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&auto=format&fit=crop&q=60',
    isPinned: true,
  },
  {
    id: 'pn-2',
    name: 'Clean Code Principles',
    folderName: 'Dev Projects',
    updatedAt: '1d ago',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=60',
    isPinned: true,
  },
  {
    id: 'pn-3',
    name: 'Database Design Patterns',
    folderName: 'Database & Architecture',
    updatedAt: '2d ago',
    thumbnail:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=60',
    isPinned: true,
  },
  {
    id: 'pn-4',
    name: 'Linux Commands Cheatsheet',
    folderName: 'DevOps & Systems',
    updatedAt: '4d ago',
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=60',
    isPinned: true,
  },
]
