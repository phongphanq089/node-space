import BannerMusic from '@/features/dashboard-home/components/banner-music'
import NodesList from '@/features/dashboard-home/components/nodes-list'
import NotesList from '@/features/dashboard-home/components/notes-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="relative flex-1 flex flex-col bg-ns-bg lg:overflow-hidden">
      <div className="grid grid-cols-1 gap-6 lg:flex-1 lg:grid-cols-3">
        <NodesList />
        <NotesList />
        <BannerMusic />
      </div>
    </div>
  )
}
