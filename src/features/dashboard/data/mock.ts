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
  { icon: '⌂', label: 'Home', to: '/dashboard', exact: true },
  { icon: '⬡', label: 'All Nodes', to: '/dashboard/nodes' },
  { icon: '★', label: 'Favorites', to: '/dashboard/favorites' },
  { icon: '◷', label: 'Recent', to: '/dashboard/recent' },
  { icon: '⬙', label: 'Tags', to: '/dashboard/tags' },
  { icon: '⊘', label: 'Trash', to: '/dashboard/trash' },
]

// ── Workspaces ──────────────────────────────────────────────────
export const WORKSPACES: readonly WorkspaceItem[] = [
  { color: '#e05c5c', name: 'Personal' },
  { color: '#5c9fe0', name: 'Dev Projects' },
  { color: '#e0a05c', name: 'Study' },
  { color: '#a05ce0', name: 'Ideas' },
  { color: '#5ce08a', name: 'Archive' },
]

// ── Nodes ───────────────────────────────────────────────────────
export const NODES: readonly NodeItem[] = [
  {
    title: 'Node-based Note System',
    count: 6,
    updated: '2 hours ago',
    tag: '#productivity',
    tagColor: '#a78bfa',
    active: true,
  },
  {
    title: 'Dijkstra Algorithm Explained',
    count: 8,
    updated: '5 hours ago',
    tag: '#algorithm',
    tagColor: '#34d399',
    starred: true,
  },
  {
    title: 'Setup Dev Environment 2024',
    count: 10,
    updated: '1 day ago',
    tag: '#devops',
    tagColor: '#60a5fa',
  },
  {
    title: 'Must-read Books for Developers',
    count: 12,
    updated: '2 days ago',
    tag: '#book',
    tagColor: '#f87171',
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
  { title: 'Deep Focus', artist: 'Chillhop Music', active: true },
  { title: 'Coding Vibes', artist: 'Lo-fi Hip Hop' },
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
