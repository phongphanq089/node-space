import { SidebarInset } from '@/shared/ui/core/sidebar'
import { WorkSpaceTopbar } from '@/widgets/workspace-topbar'
import { Outlet, useLocation } from '@tanstack/react-router'

const MainContentWorkspace = () => {
  const location = useLocation()
  const isHome =
    location.pathname === '/workspace' || location.pathname === '/workspace/'
  return (
    <SidebarInset className="flex bg-ns-panel">
      {!isHome && <WorkSpaceTopbar />}
      <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto bg-transparent p-4 sm:p-6">
        <Outlet />
      </div>
    </SidebarInset>
  )
}

export default MainContentWorkspace
