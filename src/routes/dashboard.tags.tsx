import { createFileRoute } from '@tanstack/react-router'

import DashboardSection from '@/components/DashboardSection'

export const Route = createFileRoute('/dashboard/tags')({
  component: TagsPage,
})

function TagsPage() {
  return (
    <DashboardSection
      title="Tags"
      description="Organize nodes by tags and discover related notes."
    />
  )
}
