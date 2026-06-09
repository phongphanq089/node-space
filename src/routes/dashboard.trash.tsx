import { createFileRoute } from '@tanstack/react-router'

import DashboardSection from '@/components/DashboardSection'

export const Route = createFileRoute('/dashboard/trash')({
  component: TrashPage,
})

function TrashPage() {
  return (
    <DashboardSection
      title="Trash"
      description="Deleted nodes are kept here before permanent removal."
    />
  )
}
