// ── Types ───────────────────────────────────────────────────────
export interface NavItem {
  icon: string
  label: string
  to: string
  exact?: boolean
}

export interface WorkspaceItem {
  color: string
  name: string
}

export interface NodeItem {
  title: string
  count: number
  updated: string
  tag?: string
  tagColor?: string
  active?: boolean
  starred?: boolean
}

export interface NoteItem {
  title: string
  tags: string[]
  updated: string
  starred?: boolean
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

// ── Navigation ─────────────────────────────────────────────────
export const NAV: readonly NavItem[] = [
  { icon: 'home', label: 'Home', to: '/dashboard', exact: true },
  { icon: 'hexagon', label: 'All Nodes', to: '/dashboard/nodes' },
  { icon: 'star', label: 'Favorites', to: '/dashboard/favorites' },
  { icon: 'clock', label: 'Recent', to: '/dashboard/recent' },
  { icon: 'tag', label: 'Tags', to: '/dashboard/tags' },
  { icon: 'trash', label: 'Trash', to: '/dashboard/trash' },
  { icon: 'music', label: 'Music Manager', to: '/dashboard/music' },
]

// ── Workspaces ──────────────────────────────────────────────────
export const WORKSPACES: readonly WorkspaceItem[] = [
  { color: '#f97316', name: 'Personal' },
  { color: '#ec4899', name: 'Dev Projects' },
  { color: '#a855f7', name: 'Study' },
  { color: '#eab308', name: 'Ideas' },
  { color: '#3b82f6', name: 'Archive' },
]

// ── Nodes ───────────────────────────────────────────────────────
export const NODES: readonly (NodeItem & { thumbnail?: string })[] = [
  {
    title: 'Node-based Note System',
    count: 6,
    updated: 'Updated 2 hours ago',
    tag: '#productivity',
    tagColor: '#a78bfa',
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
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Must-read Books for Devs',
    count: 12,
    updated: 'Updated 2 days ago',
    tag: '#book',
    tagColor: '#f87171',
    thumbnail:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Database Design Patterns',
    count: 15,
    updated: 'Updated 3 days ago',
    tag: '#database',
    tagColor: '#f97316',
    thumbnail:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Clean Code Note',
    count: 7,
    updated: 'Updated 3 days ago',
    tag: '#clean-code',
    tagColor: '#3b82f6',
    thumbnail:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: 'Linux Commands Cheatsheet',
    count: 9,
    updated: 'Updated 4 days ago',
    tag: '#linux',
    tagColor: '#a855f7',
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=60',
  },
]

// ── Notes ───────────────────────────────────────────────────────
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
  {
    title: 'Integrations & Extensions',
    tags: ['#integration', '#extend'],
    updated: '3 days ago',
  },
  {
    title: 'Benefits & Value',
    tags: ['#benefit', '#value'],
    updated: '2 days ago',
  },
  {
    title: 'Integrations & Extensions',
    tags: ['#integration', '#extend'],
    updated: '3 days ago',
  },
  {
    title: 'Benefits & Value',
    tags: ['#benefit', '#value'],
    updated: '2 days ago',
  },
  {
    title: 'Integrations & Extensions',
    tags: ['#integration', '#extend'],
    updated: '3 days ago',
  },
  {
    title: 'Benefits & Value',
    tags: ['#benefit', '#value'],
    updated: '2 days ago',
  },
  {
    title: 'Integrations & Extensions',
    tags: ['#integration', '#extend'],
    updated: '3 days ago',
  },
  {
    title: 'Benefits & Value',
    tags: ['#benefit', '#value'],
    updated: '2 days ago',
  },
  {
    title: 'Integrations & Extensions',
    tags: ['#integration', '#extend'],
    updated: '3 days ago',
  },
]

// ── Feature highlights ──────────────────────────────────────────
export const FEATURES: readonly FeatureItem[] = [
  {
    title: 'Node Link',
    desc: 'Connect ideas visually',
    color: 'ns-purple',
  },
  {
    title: 'Markdown Editor',
    desc: 'Supports Markdown and syntax highlighting',
    color: 'ns-accent',
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

// ── Playlist ────────────────────────────────────────────────────
export const PLAYLIST: readonly PlaylistItem[] = [
  { title: 'Midnight Coding', artist: 'Lofi Beats', active: true },
  { title: 'Coding Vibes', artist: 'Lofi Beats' },
  { title: 'Rainy Days', artist: 'Chillhop Music' },
  { title: 'Night Drive', artist: 'Synthwave' },
]

export const data_note = [
  {
    name: 'Project Management & Task Tracking',
    url: '#',
    emoji: '📊',
  },
  {
    name: 'Family Recipe Collection & Meal Planning',
    url: '#',
    emoji: '🍳',
  },
  {
    name: 'Fitness Tracker & Workout Routines',
    url: '#',
    emoji: '💪',
  },
  {
    name: 'Book Notes & Reading List',
    url: '#',
    emoji: '📚',
  },
  {
    name: 'Sustainable Gardening Tips & Plant Care',
    url: '#',
    emoji: '🌱',
  },
  {
    name: 'Language Learning Progress & Resources',
    url: '#',
    emoji: '🗣️',
  },
  {
    name: 'Home Renovation Ideas & Budget Tracker',
    url: '#',
    emoji: '🏠',
  },
  {
    name: 'Personal Finance & Investment Portfolio',
    url: '#',
    emoji: '💰',
  },
  {
    name: 'Movie & TV Show Watchlist with Reviews',
    url: '#',
    emoji: '🎬',
  },
  {
    name: 'Daily Habit Tracker & Goal Setting',
    url: '#',
    emoji: '✅',
  },
]
export const data_workspaces = [
  {
    name: 'Personal Life Management',
    emoji: '🏠',
    url: '#',
  },
  {
    name: 'Professional Development',
    emoji: '💼',
    url: '#',
  },
  {
    name: 'Creative Projects',
    emoji: '🎨',
    url: '#',
  },
  {
    name: 'Home Management',
    emoji: '🏡',
    url: '#',
  },
  {
    name: 'Travel & Adventure',
    emoji: '🧳',
    url: '#',
  },
]
