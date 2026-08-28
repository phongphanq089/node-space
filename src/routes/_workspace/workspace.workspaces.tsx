import { WorkspacesList } from '@/features/workspace'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/workspace/workspaces')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-3 py-5">
        <WorkspacesList />
      </div>
    </div>
  )
}
