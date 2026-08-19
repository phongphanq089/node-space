import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  BrandLogo,
} from '@/shared/ui'

import { Logout } from './logout'
import { SidebarGroupLayout } from './sidebar-group-layout'
import { NAVIGATION_LIST } from './navigation-list'
import { useThemeStore } from '@/shared/stores/use-theme-store'
import { Paintbrush } from 'lucide-react'

import FavoriteFolders from './favorite-folders'

const WorkSpaceSidebar = () => {
  const openDrawer = useThemeStore((s) => s.openDrawer)
  const mode = useThemeStore((s) => s.mode)
  const accent = useThemeStore((s) => s.accent)

  return (
    <>
      <Sidebar variant="inset" className="border-none bg-ns-bg">
        <SidebarHeader className="flex flex-col gap-3 px-4 py-4">
          <BrandLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroupLayout
            className="px-4 pb-4"
            items={NAVIGATION_LIST}
            mapItem={(item) => ({
              label: item.label,
              to: item.to,
              icon: item.icon,
              exact: item.exact,
            })}
          />

          <FavoriteFolders />
        </SidebarContent>
        <SidebarFooter className="gap-2 border-t border-white/5 bg-ns-bg/30 px-3 py-2">
          <button
            type="button"
            onClick={openDrawer}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-ns-border-soft bg-ns-surface/50 px-2.5 py-1.5 text-xs font-medium text-ns-muted transition-colors hover:border-ns-border hover:bg-ns-surface hover:text-ns-text"
            title="Open Appearance & Theme Settings"
          >
            <div className="flex items-center gap-2">
              <Paintbrush className="size-3.5 text-ns-primary-lt" />
              <span className="capitalize">Theme ({mode})</span>
            </div>
            <span
              className="flex size-2 rounded-full ring-1 ring-white/20"
              style={{
                backgroundColor:
                  accent === 'custom' ? 'var(--ns-primary)' : undefined,
              }}
            />
          </button>
          <Logout />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

export { WorkSpaceSidebar }
