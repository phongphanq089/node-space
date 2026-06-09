import { createFileRoute } from '@tanstack/react-router'

import DashboardSection from '@/components/DashboardSection'

export const Route = createFileRoute('/dashboard/recent')({
  component: RecentPage,
})

function RecentPage() {
  return (
    <DashboardSection
      title="Recent activity"
      description="Recently opened and updated nodes will appear here."
    />
  )
}
