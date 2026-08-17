import { useState } from 'react'
import { Search, Plus, Layers, ChevronDown, Loader2, X } from 'lucide-react'
import { EmptyState } from '@/shared/ui/system/empty-state'
import { Button, Input } from '@/shared/ui'
import { WorkspaceModal } from './workspace-modal'
import { WorkspaceCard } from './workspace-card'
import { WorkspaceGridSkeleton } from './workspace-skeleton'
import { useInfiniteWorkspacesQuery } from '../hooks/use-workspaces'
import { useDebounce } from '@/shared/hooks'

export function WorkspacesList() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteWorkspacesQuery(12, debouncedSearch)

  // Flatten all fetched pages of workspaces (server-filtered)
  const dbWorkspaces = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <>
      {/* Search Bar & Create Trigger */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center">
          <Input
            placeholder="Search workspaces..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            suffix={
              <Search size={13} className="flex-shrink-0 text-ns-ghost" />
            }
          />
        </div>
        <Button onClick={() => setIsCreateWorkspaceOpen(true)}>
          <Plus size={13} />
          <span className="hidden sm:inline">New Workspace</span>
        </Button>
      </div>

      {isLoading ? (
        <WorkspaceGridSkeleton count={6} />
      ) : dbWorkspaces.length === 0 ? (
        <EmptyState
          variant={search ? 'search' : 'default'}
          title={
            search
              ? `No workspaces found for "${search}"`
              : 'No workspaces available'
          }
          description={
            search
              ? 'Try adjusting your search query or resetting filters.'
              : 'Create your first workspace to organize your folders & notes.'
          }
          action={
            search ? (
              <button
                onClick={() => setSearch('')}
                className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-ns-border bg-ns-panel px-3 py-1.5 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
              >
                <X size={12} />
                <span>Clear Search</span>
              </button>
            ) : (
              <button
                onClick={() => setIsCreateWorkspaceOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-ns-border bg-ns-panel px-3.5 py-2 text-xs font-bold text-ns-primary-lt transition-all hover:bg-ns-hover"
              >
                <Layers size={14} />
                <span>Create Workspace</span>
              </button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3">
            {dbWorkspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspaceItem={ws} />
            ))}
          </div>

          {/* Read More / Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-ns-border/50 bg-ns-panel px-6 py-2.5 text-xs font-bold text-ns-primary-lt shadow-lg transition-all hover:border-ns-border-em hover:bg-ns-hover active:scale-95 disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin text-ns-primary-lt"
                    />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Workspace Modal */}
      <WorkspaceModal
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />
    </>
  )
}
