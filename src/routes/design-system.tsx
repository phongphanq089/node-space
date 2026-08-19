import { createFileRoute } from '@tanstack/react-router'
import DesignSystemPage from '@/app/design-system'

export const Route = createFileRoute('/design-system')({
  head: () => ({
    meta: [
      { title: 'Design System & UI Components | Node Space' },
      {
        name: 'description',
        content:
          'Interactive design system and component showcase for Node Space.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: DesignSystemPage,
})
