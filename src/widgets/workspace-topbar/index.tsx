import { SidebarTrigger } from '@/shared/ui'
import { SearchGlobal } from '@/widgets/search-global'
import { useNewNoteDialogStore } from '@/features/notes/store/use-new-note-dialog-store'
import { Plus, Bell, Settings } from 'lucide-react'
import { useThemeStore } from '@/shared/stores/use-theme-store'

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
  const openDrawer = useThemeStore((s) => s.openDrawer)
  // const mode = useThemeStore((s) => s.mode)
  const accent = useThemeStore((s) => s.accent)
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between gap-4 border-b border-ns-border/80 bg-ns-topbar px-6 backdrop-blur-xl">
      <div className="w-fit">
        <SidebarTrigger className="h-9.5 w-9.5 rounded-md border border-ns-border bg-ns-primary text-white hover:bg-ns-hover dark:bg-ns-primary/10" />
      </div>
      <div className="w-full max-w-[600px] flex-1">
        <SearchGlobal triggerPlaceholder="Search nodes, notes, tags..." />
      </div>

      <div className="flex items-center gap-1.5">
        <IconBtn
          id="btn-create-top"
          title="Create new note"
          onClick={() => useNewNoteDialogStore.getState().open()}
        >
          <Plus size={16} />
        </IconBtn>

        <IconBtn id="btn-notifications" title="Notifications">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.55rem] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            3
          </span>
        </IconBtn>

        <IconBtn id="btn-settings" title="Settings" onClick={openDrawer}>
          <Settings
            size={16}
            color={accent === 'custom' ? 'var(--ns-primary)' : undefined}
          />
        </IconBtn>
      </div>
    </header>
  )
}
