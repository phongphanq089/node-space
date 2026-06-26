import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/core/sidebar'
import { NavNodeList } from './nav-node-list'
import { data_note } from '../../data/mock'
import BrandLogo from '@/components/shared/logo'
import NavMenu from './nav-menu'

const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <BrandLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu />
        <NavNodeList favorites={data_note} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default DashboardSidebar
