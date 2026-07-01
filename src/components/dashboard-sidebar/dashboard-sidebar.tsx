import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/core/sidebar'

import BrandLogo from '@/components/shared/brand-logo '
import { Plus } from 'lucide-react'
import Logout from './logout'
import NavMenu from './nav-menu'
import { WORKSPACES } from '@/constants/moc-data'

const DashboardSidebar = () => {
  return (
    <Sidebar className="bg-ns-sidebar border-r border-ns-border">
      <SidebarHeader className="flex flex-col gap-3 px-4 py-4">
        <BrandLogo />
      </SidebarHeader>

      <SidebarContent>
        <NavMenu />

        {/* Workspaces Group */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="flex items-center justify-between px-3 text-[0.65rem] font-bold tracking-wider text-ns-faint uppercase">
            <span>Workspaces</span>
            <button className="hover:text-ns-primary-lt cursor-pointer text-ns-ghost transition-colors">
              <Plus size={12} />
            </button>
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5 px-2">
            {WORKSPACES.map((workspace) => (
              <SidebarMenuItem key={workspace.name}>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ns-muted transition-all hover:bg-ns-hover hover:text-ns-text-2"
                  >
                    <span
                      className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full"
                      style={{ backgroundColor: workspace.color }}
                    />
                    <span>{workspace.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-ns-border/60 bg-ns-bg/30 p-4">
        <Logout />
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSidebar
