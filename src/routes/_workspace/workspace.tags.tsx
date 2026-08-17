import { TagsList } from '@/features/tag'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/workspace/tags')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TagsList />
}
