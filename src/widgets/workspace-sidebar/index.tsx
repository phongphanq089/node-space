import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  BrandLogo,
} from '@/shared/ui'
import { ShieldAlert } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Logout } from './logout'
import { SidebarGroupLayout } from './sidebar-group-layout'
import { NAVIGATION_LIST } from './navigation-list'
import FavoriteFolders from './favorite-folders'

const WorkSpaceSidebar = () => {
  return (
    <>
      <Sidebar variant="inset" className="border-none bg-ns-bg">
        <SidebarHeader className="flex flex-col gap-3 px-4 py-4">
          <BrandLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroupLayout
            className="px-2 pb-4"
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
        <SidebarFooter className="flex flex-col gap-2 border-t border-white/5 bg-ns-bg/30 px-3 py-3">
          <Link
            to="/admin"
            className="flex items-center justify-between rounded-lg border border-ns-primary px-3 py-2 text-xs font-bold text-ns-primary uppercase no-underline shadow-xs transition-all hover:border-ns-primary/60 hover:bg-ns-primary/40 hover:text-white active:scale-98 dark:text-white/90"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>Admin Portal</span>
            </div>
            <span className="py-0.2 rounded bg-ns-primary/20 px-1.5 text-[0.55rem] font-extrabold text-ns-primary uppercase dark:text-white/80">
              Live
            </span>
          </Link>
          <Logout />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

export { WorkSpaceSidebar }
