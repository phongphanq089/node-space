import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

const NODES = [
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

const NOTES = [
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

const FEATURES = [
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

const PLAYLIST = [
  { title: 'Deep Focus', artist: 'Chillhop Music', active: true },
  { title: 'Coding Vibes', artist: 'Lo-fi Hip Hop' },
]

const panelClass =
  'rounded-xl border border-ns-border bg-ns-panel overflow-hidden'
const panelHeadClass =
  'flex items-center justify-between px-4 py-3 border-b border-ns-border-soft'
const iconBtnSm =
  'flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost hover:bg-ns-hover-md hover:text-ns-accent-lt transition-all'

function DashboardHome() {
  return (
    <div className="min-h-full bg-ns-bg p-4">
      {/* Hero banner */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-ns-border bg-gradient-to-br from-ns-surface to-ns-panel p-6 sm:p-8">
        <div
          aria-hidden
          className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-50"
        />
        <div
          aria-hidden
          className="ns-hero-blur-purple-25 pointer-events-none absolute -right-8 -bottom-16 h-48 w-48 rounded-full opacity-40"
        />
        <h1 className="relative mb-2 text-xl font-bold text-ns-text sm:text-2xl">
          Xin chào, Kien 👋
          <br />
          Sẵn sàng kết nối ý tưởng?
        </h1>
        <p className="relative mb-4 max-w-md text-sm text-ns-muted">
          Ghi chú dạng node giúp bạn tư duy tự do, kết nối mọi ý tưởng và xây
          dựng kiến thức.
        </p>
        <button
          id="btn-hero-explore"
          className="relative inline-flex items-center gap-2 rounded-xl border border-ns-border-em bg-ns-active px-5 py-2 text-sm font-semibold text-ns-accent-lt transition-all hover:bg-ns-hover-md"
        >
          Khám phá ngay →
        </button>
        <p className="relative mt-4 text-xs text-ns-faint">
          ✦ "The best way to predict the future is to invent it." – Alan Kay
        </p>
      </div>

      {/* Feature highlight */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-ns-border bg-ns-input p-4 transition-all hover:-translate-y-0.5 hover:border-ns-border-md"
          >
            <div
              className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-${f.color}/15 text-${f.color}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="3" />
                <line x1="3" y1="12" x2="9" y2="12" />
                <line x1="15" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="21" />
              </svg>
            </div>
            <p className="mb-1 text-xs font-bold text-ns-text">{f.title}</p>
            <p className="text-[0.68rem] leading-snug text-ns-ghost">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3-col layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_280px]">
        {/* ── Nodes list ── */}
        <div className={panelClass}>
          <div className={panelHeadClass}>
            <span className="text-sm font-semibold text-ns-text-2">
              Danh sách các node
            </span>
            <div className="flex gap-1">
              <button id="btn-search-node" className={iconBtnSm}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button id="btn-add-node" className={iconBtnSm}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mx-3 my-2 flex items-center gap-2 rounded-lg border border-ns-border-soft bg-ns-input px-3 py-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-ns-ghost"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="input-node-search"
              type="search"
              placeholder="Tìm kiếm node..."
              className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
            />
          </div>
          <div className="divide-y divide-ns-border-soft">
            {NODES.map((node) => (
              <button
                key={node.title}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-ns-hover ${node.active ? 'border-l-2 border-ns-accent bg-ns-active' : ''}`}
              >
                <span className="block h-9 w-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-active" />
                <span className="block min-w-0 flex-1">
                  <span className="mb-0.5 block truncate text-xs font-semibold text-ns-text">
                    {node.title}
                  </span>
                  <span className="block text-[0.65rem] text-ns-faint">
                    {node.count} notes · {node.updated}
                  </span>
                  <span
                    className="block text-[0.65rem] font-semibold"
                    style={{ color: node.tagColor }}
                  >
                    {node.tag}
                  </span>
                </span>
                {node.starred && (
                  <span className="text-sm text-yellow-400">★</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Notes list ── */}
        <div className={panelClass}>
          <div className={panelHeadClass}>
            <div>
              <span className="text-sm font-semibold text-ns-text-2">
                Danh sách notes trong node
              </span>
              <span className="ml-2 text-xs text-ns-faint">6 notes</span>
            </div>
            <div className="flex gap-1">
              {['🗑', '≡', '⊞'].map((ic, i) => (
                <button key={i} className={`${iconBtnSm} text-xs`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-ns-border-soft">
            {NOTES.map((note) => (
              <div
                key={note.title}
                className="flex items-start gap-3 px-4 py-3 transition-all hover:bg-ns-hover"
              >
                <span className="mt-0.5 text-base text-ns-accent">◎</span>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-ns-text">
                    {note.title}
                  </p>
                  <div className="mb-1 flex flex-wrap gap-1">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-ns-active px-1.5 py-0.5 text-[0.62rem] text-ns-accent-lt"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[0.65rem] text-ns-faint">
                    Cập nhật {note.updated}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {note.starred && (
                    <span className="text-xs text-yellow-400">★</span>
                  )}
                  <button className="text-xs text-ns-ghost transition-all hover:text-ns-accent-lt">
                    ···
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Player ── */}
        <div className={panelClass}>
          <div className={panelHeadClass}>
            <span className="text-sm font-semibold text-ns-text-2">
              Chill & Focus
            </span>
          </div>
          {/* Art */}
          <div className="mx-4 mt-4 mb-3 flex aspect-video items-center justify-center rounded-xl border border-ns-border bg-gradient-to-br from-ns-surface to-ns-panel">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-ns-faint"
              strokeWidth="1.5"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          {/* Track info */}
          <div className="mb-3 px-4 text-center">
            <p className="mb-0.5 text-sm font-bold text-ns-text">
              Midnight Coding
            </p>
            <p className="text-xs text-ns-muted-sm">Lo-fi Beats</p>
          </div>
          {/* Progress */}
          <div className="mb-3 flex items-center gap-2 px-4">
            <span className="text-[0.62rem] text-ns-faint">1:24</span>
            <div className="h-1 flex-1 rounded-full bg-ns-input">
              <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-ns-accent to-ns-accent-lt" />
            </div>
            <span className="text-[0.62rem] text-ns-faint">3:45</span>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-2 pb-4">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>
            <button
              id="btn-play-pause"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ns-accent shadow-[0_0_16px_var(--color-ns-accent)] transition-all hover:scale-105"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="var(--color-ns-on-accent)"
                stroke="none"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>
          {/* Playlist */}
          <div className="border-t border-ns-border-soft px-4 py-3">
            <p className="mb-2 text-[0.62rem] font-bold tracking-widest text-ns-faint uppercase">
              Danh sách phát
            </p>
            {PLAYLIST.map((track) => (
              <button
                key={track.title}
                className={`flex w-full items-center gap-3 rounded-lg px-1 py-2 transition-all hover:bg-ns-hover ${track.active ? 'text-ns-accent-lt' : 'text-ns-muted'}`}
              >
                <span className="block h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-hover" />
                <span className="block min-w-0 flex-1 text-left">
                  <span className="block truncate text-xs font-semibold">
                    {track.title}
                  </span>
                  <span className="block text-[0.62rem] text-ns-faint">
                    {track.artist}
                  </span>
                </span>
                {track.active && (
                  <span className="text-xs text-ns-accent">♪</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
