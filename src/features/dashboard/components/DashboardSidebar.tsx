import { Link, useRouterState } from '@tanstack/react-router'

import BrandLogo from '@/components/ui/BrandLogo'

import { NAV, WORKSPACES } from '../data/mock'

type DashboardSidebarProps = {
  open: boolean
}

export default function DashboardSidebar({ open }: DashboardSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col overflow-y-auto border-r border-ns-border-soft bg-ns-surface-alt backdrop-blur transition-all duration-300 ${open ? 'w-[220px]' : 'w-0 overflow-hidden'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-ns-border-soft px-4 py-4">
        <BrandLogo size="sm" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-ns-text">
            NodeSpace
          </span>
          <span className="text-[0.62rem] text-ns-muted-sm">
            Your thoughts. Connected.
          </span>
        </div>
      </div>

      {/* Create button */}
      <div className="px-3 pt-4 pb-2">
        <button
          id="btn-create-node"
          className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-ns-accent to-ns-accent-lt px-3 py-2 text-sm font-bold text-ns-on-accent shadow-[0_0_16px_var(--color-ns-accent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-ns-accent)]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="flex-1 text-left">Tạo node mới</span>
          <kbd className="rounded bg-black/15 px-1 font-mono text-[0.6rem]">
            ⌘N
          </kbd>
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
          <span className="text-[0.62rem] font-bold tracking-[0.12em] text-ns-faint uppercase">
            Workspaces
          </span>
          <button
            id="btn-add-workspace"
            className="flex h-5 w-5 items-center justify-center rounded text-ns-ghost transition-all hover:bg-ns-hover-md hover:text-ns-accent-lt"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
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
              style={{
                background: ws.color,
                boxShadow: `0 0 6px ${ws.color}80`,
              }}
            />
            {ws.name}
          </button>
        ))}
      </div>
    </aside>
  )
}
