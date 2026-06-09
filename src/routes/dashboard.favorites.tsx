import { createFileRoute } from '@tanstack/react-router'

import DashboardSection from '@/components/DashboardSection'

export const Route = createFileRoute('/dashboard/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  return (
    <DashboardSection
      title="Favorite nodes"
      description="Nodes marked as favorites will appear here."
    />
  )
}
