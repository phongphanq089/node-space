import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'

import DashboardSidebar from './components/DashboardSidebar'
import DashboardTopbar from './components/DashboardTopbar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-ns-bg font-sans text-ns-text-2">
      <DashboardSidebar open={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
