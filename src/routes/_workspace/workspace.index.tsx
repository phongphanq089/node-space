import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/workspace/')({
  beforeLoad: () => {
    throw redirect({
      to: '/workspace/folder',
    })
  },
  component: () => null,
})
