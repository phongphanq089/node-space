import {
  ConfirmDeleteModal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenuAction,
  Skeleton,
  useSidebar,
} from '@/shared/ui'
import {
  ArrowUpRight,
  Link2,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react'
import { SidebarGroupLayout } from './sidebar-group-layout'
import {
  useDeleteFolderMutation,
  useFoldersQuery,
  useToggleFavoriteFolderMutation,
} from '@/features/folder'
import { useState } from 'react'
import { toast } from 'sonner'

const FavoriteFolders = () => {
  const { isMobile } = useSidebar()
  const { data: dbFolders = [], isLoading } = useFoldersQuery()
  const toggleFavoriteMutation = useToggleFavoriteFolderMutation()
  const deleteFolderMutation = useDeleteFolderMutation()

  const [deleteTargetFolder, setDeleteTargetFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const favoriteFolders = dbFolders.filter((f) => f.isFavorite)
  return (
    <>
      <div className="mt-2 flex flex-col gap-2 px-4">
        {favoriteFolders.length !== 0 ? (
          <div className="flex items-center justify-between px-3 text-[0.65rem] font-bold tracking-wider text-white/70 uppercase">
            <span className="flex items-center gap-1.5">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/10">
                <Star
                  size={10}
                  strokeWidth={1.8}
                  className="text-amber-400/80"
                />
              </div>
              <span>Favorites</span>
            </span>
            {favoriteFolders.length > 0 && (
              <span className="py-0.2 rounded-full bg-ns-active px-1.5 text-[10px] font-semibold text-ns-muted">
                {favoriteFolders.length}
              </span>
            )}
          </div>
        ) : (
          ''
        )}

        {isLoading ? (
          <LoadingSkeleton count={10} />
        ) : favoriteFolders.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <SidebarGroupLayout
            className="p-0"
            items={favoriteFolders}
            mapItem={(folder: any) => {
              const targetWorkspaceId =
                folder.workspace_id || folder.workspaceId || ''
              return {
                id: `fav-${folder.id}`,
                label: folder.name,
                color: folder.color || '#3b82f6',
                to: targetWorkspaceId
                  ? `/workspace/folder?workspaceId=${targetWorkspaceId}`
                  : '/workspace/folder',
              }
            }}
            renderActions={(rawItem: any) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="text-ns-ghost transition-colors hover:text-white"
                  >
                    <MoreHorizontal size={14} />
                    <span className="sr-only">Actions</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-52 rounded-xl border-ns-border-soft bg-ns-panel/95 text-xs text-ns-text shadow-2xl backdrop-blur-xl"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavoriteMutation.mutate(rawItem.id)
                    }}
                    className="cursor-pointer gap-2 focus:bg-ns-hover focus:text-white"
                  >
                    <StarOff size={14} className="text-amber-400" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-ns-border-soft" />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      const targetWs =
                        rawItem.workspace_id || rawItem.workspaceId || ''
                      const targetUrl = targetWs
                        ? `${window.location.origin}/workspace/folder?workspaceId=${targetWs}`
                        : `${window.location.origin}/workspace/folder`
                      void navigator.clipboard.writeText(targetUrl)
                      toast.success('Folder link copied to clipboard!')
                    }}
                    className="cursor-pointer gap-2 focus:bg-ns-hover focus:text-white"
                  >
                    <Link2 size={14} className="text-ns-ghost" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      const targetWs =
                        rawItem.workspace_id || rawItem.workspaceId || ''
                      const targetUrl = targetWs
                        ? `/workspace/folder?workspaceId=${targetWs}`
                        : '/workspace/folder'
                      window.open(targetUrl, '_blank')
                    }}
                    className="cursor-pointer gap-2 focus:bg-ns-hover focus:text-white"
                  >
                    <ArrowUpRight size={14} className="text-ns-ghost" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-ns-border-soft" />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTargetFolder({
                        id: rawItem.id,
                        name: rawItem.name,
                      })
                    }}
                    className="cursor-pointer gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                  >
                    <Trash2 size={14} />
                    <span>Delete Folder</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTargetFolder}
        onClose={() => setDeleteTargetFolder(null)}
        onConfirm={() => {
          if (deleteTargetFolder) {
            deleteFolderMutation.mutate(deleteTargetFolder.id, {
              onSuccess: () => setDeleteTargetFolder(null),
            })
          }
        }}
        title="Delete Favorite Folder"
        description="Are you sure you want to delete this folder? This action cannot be undone."
        itemName={deleteTargetFolder?.name || ''}
        isPending={deleteFolderMutation.isPending}
      />
    </>
  )
}

export default FavoriteFolders

const LoadingSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="mt-3 flex flex-col gap-2.5 px-1">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-8 w-full rounded-sm bg-ns-primary/10"
        />
      ))}
    </div>
  )
}

const FavoritesEmptyState = () => {
  return (
    <div className="group relative mx-1 mt-1 flex min-h-30 flex-col justify-center overflow-hidden rounded-xl border border-ns-primary/10 bg-gradient-to-br from-ns-primary/10 to-ns-panel/30 p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="pointer-events-none absolute -top-8 -right-8 size-20 rounded-full bg-amber-400/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/10">
          <Star size={16} strokeWidth={1.8} className="text-amber-400/80" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ns-text">
              No favorites
            </span>

            <span className="rounded-md bg-ns-active px-1.5 py-0.5 text-[9px] font-medium text-ns-faint">
              0
            </span>
          </div>

          <p className="mt-1 text-[10px] leading-relaxed text-ns-faint">
            Star folders for quick access.
          </p>
        </div>
      </div>
    </div>
  )
}
