import { SidebarTrigger } from '@/components/ui/core/sidebar'
import { Search, Plus, Bell, Settings } from 'lucide-react'

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
      className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-ns-ghost transition-all hover:border-ns-border hover:bg-ns-hover-md hover:text-ns-accent-lt"
    >
      {children}
    </button>
  )
}

export default function DashboardTopbar() {
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between gap-4 border-b border-ns-border bg-ns-topbar px-6 backdrop-blur">
      <div className="flex max-w-[420px] flex-1 items-center gap-3">
        {/* Sidebar toggle */}
        <SidebarTrigger className="h-8 w-8 rounded-xl border border-ns-border text-ns-ghost hover:bg-ns-hover" />

        {/* Search */}
        <div
          id="search-bar"
          className="flex flex-1 items-center gap-2 rounded-xl border border-ns-border bg-ns-input px-3 py-1.5 transition-all focus-within:border-ns-accent hover:border-ns-border-md"
        >
          <Search size={14} className="text-ns-ghost" />
          <input
            id="input-search"
            type="search"
            placeholder="Search nodes, notes, tags..."
            className="flex-1 border-none bg-transparent text-xs text-ns-text-2 placeholder-ns-placeholder outline-none"
          />
          <kbd className="rounded border border-ns-border bg-ns-bg/50 px-1 font-mono text-[0.6rem] text-ns-faint">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <IconBtn id="btn-create-top" title="Create new">
          <Plus size={16} />
        </IconBtn>

        <IconBtn id="btn-notifications" title="Notifications">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.55rem] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            3
          </span>
        </IconBtn>

        <IconBtn id="btn-settings" title="Settings">
          <Settings size={16} />
        </IconBtn>
      </div>
    </header>
  )
}
