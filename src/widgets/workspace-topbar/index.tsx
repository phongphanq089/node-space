import { SidebarTrigger } from '@/shared/ui'
import { SearchGlobal } from '@/widgets/search-global'
import { Plus, Bell, Settings } from 'lucide-react'

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
      className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-ns-ghost transition-all hover:border-ns-border hover:bg-ns-hover-md hover:text-ns-primary-lt"
    >
      {children}
    </button>
  )
}

export function WorkSpaceTopbar() {
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between gap-4 border-b border-ns-border/80 bg-ns-topbar px-6 backdrop-blur-xl">
      <div className="flex max-w-[420px] flex-1 items-center gap-3">
        {/* Sidebar toggle */}
        <SidebarTrigger className="h-9.5 w-9.5 rounded-md border border-ns-border bg-ns-primary/10 text-white hover:bg-ns-hover" />

        {/* Search */}
        <SearchGlobal triggerPlaceholder="Search nodes, notes, tags..." />
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
