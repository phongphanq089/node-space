import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard')({ component: DashboardLayout })

const NAV = [
  { icon: '⌂', label: 'Trang chủ', to: '/dashboard', exact: true },
  { icon: '⬡', label: 'Tất cả nodes', to: '/dashboard/nodes' },
  { icon: '★', label: 'Yêu thích', to: '/dashboard/favorites' },
  { icon: '◷', label: 'Gần đây', to: '/dashboard/recent' },
  { icon: '⬙', label: 'Thẻ', to: '/dashboard/tags' },
  { icon: '⊘', label: 'Thùng rác', to: '/dashboard/trash' },
]

const WORKSPACES = [
  { color: '#e05c5c', name: 'Personal' },
  { color: '#5c9fe0', name: 'Dev Projects' },
  { color: '#e0a05c', name: 'Study' },
  { color: '#a05ce0', name: 'Ideas' },
  { color: '#5ce08a', name: 'Archive' },
]

const IconBtn = ({ children, id, title, onClick }: { children: React.ReactNode; id?: string; title?: string; onClick?: () => void }) => (
  <button
    id={id}
    title={title}
    onClick={onClick}
    className="flex h-8 w-8 items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover-md hover:text-ns-accent-lt"
  >
    {children}
  </button>
)

function DashboardLayout() {
  const [open, setOpen] = useState(true)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="flex h-screen overflow-hidden bg-ns-bg font-sans text-ns-text-2">

      {/* ── Sidebar ── */}
      <aside
        className={`flex h-full flex-shrink-0 flex-col overflow-y-auto border-r border-ns-border-soft bg-ns-surface-alt backdrop-blur transition-all duration-300 ${open ? 'w-[220px]' : 'w-0 overflow-hidden'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-ns-border-soft px-4 py-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ns-accent to-ns-purple shadow-[0_0_12px_var(--color-ns-accent)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ns-on-accent)" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="21" y2="12" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="12" y1="15" x2="12" y2="21" />
            </svg>
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-ns-text">NodeSpace</span>
            <span className="text-[0.62rem] text-ns-muted-sm">Your thoughts. Connected.</span>
          </div>
        </div>

        {/* Create button */}
        <div className="px-3 pt-4 pb-2">
          <button
            id="btn-create-node"
            className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-ns-accent to-ns-accent-lt px-3 py-2 text-sm font-bold text-ns-on-accent shadow-[0_0_16px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-ns-accent)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="flex-1 text-left">Tạo node mới</span>
            <kbd className="rounded bg-black/15 px-1 font-mono text-[0.6rem]">⌘N</kbd>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 py-2">
          {NAV.map((item) => {
            const isActive = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to) && item.to !== '/dashboard'
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium no-underline transition-all ${
                  isActive
                    ? 'bg-ns-active text-ns-accent-lt shadow-[inset_0_0_0_1px_var(--color-ns-border-em)]'
                    : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text-2'
                }`}
              >
                <span className="w-4 text-center text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Workspaces */}
        <div className="mt-4 px-2">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ns-faint">
              Workspaces
            </span>
            <button
              id="btn-add-workspace"
              className="flex h-5 w-5 items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover-md hover:text-ns-accent-lt"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          {WORKSPACES.map((ws) => (
            <button
              key={ws.name}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-ns-muted transition-all hover:bg-ns-hover hover:text-ns-text-2"
            >
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: ws.color, boxShadow: `0 0 6px ${ws.color}80` }}
              />
              {ws.name}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-[52px] flex-shrink-0 items-center gap-3 border-b border-ns-border-soft bg-ns-topbar px-4 backdrop-blur">
          <IconBtn id="btn-toggle-sidebar" title="Toggle sidebar" onClick={() => setOpen((v) => !v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconBtn>

          {/* Search */}
          <div
            id="search-bar"
            className="flex max-w-[420px] flex-1 items-center gap-2 rounded-xl border border-ns-border bg-ns-input px-3 py-1.5 transition-all hover:border-ns-border-md"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ns-ghost" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="input-search"
              type="search"
              placeholder="Tìm kiếm nodes, notes, tags…"
              className="flex-1 border-none bg-transparent text-sm text-ns-text-2 placeholder-ns-placeholder outline-none"
            />
            <kbd className="rounded border border-ns-border px-1 font-mono text-[0.6rem] text-ns-faint">⌘K</kbd>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            <IconBtn id="btn-create-top" title="Tạo mới">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </IconBtn>
            <IconBtn id="btn-notifications" title="Thông báo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </IconBtn>
            <IconBtn id="btn-settings" title="Cài đặt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </IconBtn>
            <button
              id="btn-user-menu"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ns-accent to-ns-purple text-xs font-bold text-ns-on-accent shadow-[0_0_10px_var(--color-ns-accent)]"
            >
              K
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
