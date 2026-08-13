import { SidebarTrigger } from '@/shared/ui/core/sidebar'
import { Plus, Bell, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

interface HomeTopbarProps {
  onNewNote?: () => void
}

export function HomeTopbar({ onNewNote }: HomeTopbarProps) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="flex h-14 w-full items-center justify-between gap-4 border-b border-ns-border/30 bg-ns-bg/80 px-2 backdrop-blur-md sm:px-4">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <SidebarTrigger className="h-9 w-9 rounded-xl border border-ns-border/40 text-ns-ghost transition-all hover:border-ns-border hover:bg-ns-hover hover:text-white" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* + New Note Button */}
        <button
          onClick={onNewNote}
          type="button"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-emerald-400 backdrop-blur-md transition-all hover:border-emerald-500/60 hover:bg-emerald-500/20 active:scale-95"
        >
          <Plus size={15} />
          <span>New Note</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-ns-border/40 text-ns-ghost transition-all hover:border-ns-border hover:bg-ns-hover hover:text-white"
        >
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[0.55rem] font-extrabold text-white shadow-[0_0_8px_rgba(124,58,237,0.8)]">
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          title="Toggle Theme"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-ns-border/40 text-ns-ghost transition-all hover:border-ns-border hover:bg-ns-hover hover:text-white"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Avatar */}
        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-600 to-indigo-700 text-xs font-extrabold text-white shadow-md transition-all hover:ring-2 hover:ring-violet-400/50">
          ET
        </div>
      </div>
    </header>
  )
}
