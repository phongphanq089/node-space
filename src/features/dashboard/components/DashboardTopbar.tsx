type IconBtnProps = {
  id?: string
  title?: string
  onClick?: () => void
  children: React.ReactNode
}

function IconBtn({ id, title, onClick, children }: IconBtnProps) {
  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ns-ghost transition-all hover:bg-ns-hover-md hover:text-ns-accent-lt"
    >
      {children}
    </button>
  )
}

type DashboardTopbarProps = {
  onToggleSidebar: () => void
}

export default function DashboardTopbar({
  onToggleSidebar,
}: DashboardTopbarProps) {
  return (
    <header className="flex h-[52px] flex-shrink-0 items-center gap-3 border-b border-ns-border-soft bg-ns-topbar px-4 backdrop-blur">
      {/* Sidebar toggle */}
      <IconBtn
        id="btn-toggle-sidebar"
        title="Toggle sidebar"
        onClick={onToggleSidebar}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
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
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-ns-ghost"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="input-search"
          type="search"
          placeholder="Search nodes, notes, tags..."
          className="flex-1 border-none bg-transparent text-sm text-ns-text-2 placeholder-ns-placeholder outline-none"
        />
        <kbd className="rounded border border-ns-border px-1 font-mono text-[0.6rem] text-ns-faint">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <IconBtn id="btn-create-top" title="Create new">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </IconBtn>
        <IconBtn id="btn-notifications" title="Notifications">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </IconBtn>
        <IconBtn id="btn-settings" title="Settings">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
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
  )
}
