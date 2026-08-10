import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuAction,
  useSidebar,
} from '@/shared/ui/core/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/core/dropdown-menu'

import BrandLogo from '@/shared/ui/system/brand-logo'
import {
  Plus,
  MoreHorizontal,
  StarOff,
  Link2,
  ArrowUpRight,
  Trash2,
} from 'lucide-react'
import Logout from './logout'
import { data_workspaces, WORKSPACES } from '@/shared/constants/moc-data'
import SidebarGroupLayout from './sidebar-group-layout'
import { Button } from '@/shared/ui/core/button'
import { NAVIGATION_LIST } from './navigation-list'

const WorkSpaceSidebar = () => {
  const { isMobile } = useSidebar()

  return (
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
        <SidebarGroupLayout
          className="mt-2 px-4 pb-4"
          title="Workspaces"
          headerAction={
            <Button
              variant="outline"
              size="icon-xs"
              className="cursor-pointer text-ns-ghost transition-colors hover:text-ns-primary-lt"
              title="Add Workspace"
            >
              <Plus size={12} />
            </Button>
          }
          items={WORKSPACES}
          mapItem={(workspace) => ({
            label: workspace.name,
            color: workspace.color,
            href: '#',
          })}
          showMoreButton
        />
        <SidebarGroupLayout
          className="mt-2 px-4"
          title="Favorites"
          items={data_workspaces}
          mapItem={(item) => ({
            label: item.name,
            href: item.url,
          })}
          showMoreButton
          renderActions={() => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link2 className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t border-white/5 bg-ns-bg/30 p-4">
        <Logout />
      </SidebarFooter>
    </Sidebar>
  )
}

export default WorkSpaceSidebar
