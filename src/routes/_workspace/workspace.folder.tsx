import FoldersList from '@/features/dashboard-home/components/folder-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/workspace/folder')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex flex-1 flex-col gap-5">
      {/* <BannerMusic /> */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-ns-border-soft" />
        </div>
        <FoldersList />
      </div>
    </div>
  )
}
