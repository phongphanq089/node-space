import BannerMusic from '@/features/dashboard-home/components/banner-music'
import NodesList from '@/features/dashboard-home/components/nodes-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="relative flex flex-1 flex-col gap-5 bg-ns-bg">
      {/* Full-width Music Banner at top */}
      <BannerMusic />

      {/* Compact nodes section below */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-ns-primary-lt text-[0.6rem] font-bold tracking-[0.12em] uppercase">
            Workspace
          </span>
          <div className="h-px flex-1 bg-ns-border-soft" />
        </div>
        <NodesList />
      </div>
    </div>
  )
}
