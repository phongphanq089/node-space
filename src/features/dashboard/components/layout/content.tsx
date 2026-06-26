import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/core/breadcrumb'
import { Separator } from '@/components/ui/core/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/core/sidebar'
import { Outlet } from '@tanstack/react-router'

const Content = () => {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 bg-black">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex w-full flex-1 flex-col gap-4 bg-ns-bg p-4">
        <Outlet />
      </div>
    </SidebarInset>
  )
}

export default Content
