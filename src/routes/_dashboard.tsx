import { SidebarProvider } from '@/components/ui/core/sidebar'

import Content from '@/features/dashboard/components/layout/content'
import DashboardSidebar from '@/features/dashboard/components/layout/dashboard-sidebar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-ns-bg text-ns-text-2">
        <DashboardSidebar />
        <Content />
      </div>
    </SidebarProvider>
  )
}
