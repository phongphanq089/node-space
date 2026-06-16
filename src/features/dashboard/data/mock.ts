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
  { icon: '⌂', label: 'Trang chủ', to: '/dashboard', exact: true },
  { icon: '⬡', label: 'Tất cả nodes', to: '/dashboard/nodes' },
  { icon: '★', label: 'Yêu thích', to: '/dashboard/favorites' },
  { icon: '◷', label: 'Gần đây', to: '/dashboard/recent' },
  { icon: '⬙', label: 'Thẻ', to: '/dashboard/tags' },
  { icon: '⊘', label: 'Thùng rác', to: '/dashboard/trash' },
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
    title: 'Hệ thống ghi chú dạng node',
    count: 6,
    updated: '2 giờ trước',
    tag: '#productivity',
    tagColor: '#a78bfa',
    active: true,
  },
  {
    title: 'Thuật toán Dijkstra giải thích',
    count: 8,
    updated: '5 giờ trước',
    tag: '#algorithm',
    tagColor: '#34d399',
    starred: true,
  },
  {
    title: 'Setup Dev Environment 2024',
    count: 10,
    updated: '1 ngày trước',
    tag: '#devops',
    tagColor: '#60a5fa',
  },
  {
    title: 'Sách hay nên đọc cho dev',
    count: 12,
    updated: '2 ngày trước',
    tag: '#book',
    tagColor: '#f87171',
  },
]

// ── Notes ───────────────────────────────────────────────────────
export const NOTES: readonly NoteItem[] = [
  {
    title: 'Tính năng chính',
    tags: ['#overview', '#feature'],
    updated: '2 giờ trước',
    starred: true,
  },
  {
    title: 'Công nghệ sử dụng',
    tags: ['#tech', '#stack'],
    updated: '2 giờ trước',
  },
  {
    title: 'Kế hoạch phát triển',
    tags: ['#roadmap', '#plan'],
    updated: '1 ngày trước',
  },
  {
    title: 'Use case',
    tags: ['#usecase', '#example'],
    updated: '1 ngày trước',
  },
]

// ── Feature highlights ──────────────────────────────────────────
export const FEATURES: readonly FeatureItem[] = [
  {
    title: 'Node Link',
    desc: 'Kết nối các ý tưởng một cách trực quan',
    color: 'ns-purple',
  },
  {
    title: 'Markdown Editor',
    desc: 'Hỗ trợ Markdown và code highlight',
    color: 'ns-accent',
  },
  {
    title: 'Graph View',
    desc: 'Xem toàn bộ mối liên kết dưới dạng đồ thị',
    color: 'ns-pink',
  },
  {
    title: 'Focus Mode',
    desc: 'Tập trung viết với không gian yên tĩnh',
    color: 'ns-amber',
  },
]

// ── Playlist ────────────────────────────────────────────────────
export const PLAYLIST: readonly PlaylistItem[] = [
  { title: 'Deep Focus', artist: 'Chillhop Music', active: true },
  { title: 'Coding Vibes', artist: 'Lo-fi Hip Hop' },
]
