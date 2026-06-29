import { SidebarInset } from '@/components/ui/core/sidebar'
import { Outlet } from '@tanstack/react-router'
import DashboardTopbar from './dashboard-topbar'

const Content = () => {
  return (
    <SidebarInset className="flex h-svh flex-col bg-ns-bg overflow-hidden">
      <DashboardTopbar />
      <div className="flex w-full flex-1 flex-col gap-4 bg-ns-bg p-6 overflow-y-auto">
        <Outlet />
      </div>
    </SidebarInset>
  )
}

export default Content
