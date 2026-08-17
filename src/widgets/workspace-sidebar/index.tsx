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
        <SidebarFooter className="gap-3 border-t border-white/5 bg-ns-bg/30 px-0 py-2">
          <Logout />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

export { WorkSpaceSidebar }
