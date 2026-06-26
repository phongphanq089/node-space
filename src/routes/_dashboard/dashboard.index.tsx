import { createFileRoute } from '@tanstack/react-router'

import DashboardHome from '@/features/dashboard/DashboardHome'

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: DashboardHome,
})
