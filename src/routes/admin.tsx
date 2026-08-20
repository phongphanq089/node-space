import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardView } from '@/features/admin'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin Analytics & Operations Dashboard | Node Space' },
      {
        name: 'description',
        content:
          'Executive administration portal with Google Analytics, MRR revenue metrics, user behavior, and system telemetry.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminDashboardView,
})
