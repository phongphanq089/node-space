import { createFileRoute } from '@tanstack/react-router'

import DashboardSection from '@/components/DashboardSection'

export const Route = createFileRoute('/dashboard/nodes')({
  component: NodesPage,
})

function NodesPage() {
  return (
    <DashboardSection
      title="All nodes"
      description="Browse and manage every node in the workspace."
    />
  )
}
