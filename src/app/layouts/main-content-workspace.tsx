import { SidebarInset } from '@/shared/ui/core/sidebar'
import { WorkSpaceTopbar } from '@/widgets/workspace-topbar'
import { Outlet, useLocation } from '@tanstack/react-router'

const MainContentWorkspace = () => {
  const location = useLocation()
  const isHome =
    location.pathname === '/workspace' || location.pathname === '/workspace/'
  const isDetailView =
    location.pathname.startsWith('/workspace/notes') ||
    (location.pathname.startsWith('/workspace/folder/') &&
      location.pathname !== '/workspace/folder' &&
      location.pathname !== '/workspace/folder/')

  return (
    <SidebarInset className="flex bg-ns-panel">
      {!isHome && <WorkSpaceTopbar />}
      <div
        className={
          isDetailView
            ? 'flex w-full min-w-0 flex-1 flex-col overflow-hidden bg-transparent p-2 sm:p-4'
            : 'flex w-full min-w-0 flex-1 flex-col gap-4 overflow-y-auto bg-transparent p-4 sm:p-6'
        }
      >
        <div className="mx-auto flex w-full min-w-0 3xl:w-[90%]! 2xl:w-[95%]">
          <Outlet />
        </div>
      </div>
    </SidebarInset>
  )
}

export default MainContentWorkspace
