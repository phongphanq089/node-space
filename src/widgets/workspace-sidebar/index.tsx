import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuAction,
  useSidebar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  BrandLogo,
} from '@/shared/ui'

import {
  MoreHorizontal,
  StarOff,
  Link2,
  ArrowUpRight,
  Trash2,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { Logout } from './logout'
import { SidebarGroupLayout } from './sidebar-group-layout'
import { NAVIGATION_LIST } from './navigation-list'
import {
  useFoldersQuery,
  useToggleFavoriteFolderMutation,
  useDeleteFolderMutation,
} from '@/features/folder'
import { ConfirmDeleteModal } from '@/shared/ui/system'

const WorkSpaceSidebar = () => {
  const { isMobile } = useSidebar()
  const { data: dbFolders = [] } = useFoldersQuery()
  const toggleFavoriteMutation = useToggleFavoriteFolderMutation()
  const deleteFolderMutation = useDeleteFolderMutation()

  const [deleteTargetFolder, setDeleteTargetFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const favoriteFolders = dbFolders.filter((f) => f.isFavorite)

  return (
    <>
      <Sidebar variant="inset" className="border-none bg-ns-bg">
        <SidebarHeader className="flex flex-col gap-3 px-4 py-4">
          <BrandLogo />
        </SidebarHeader>
        <SidebarContent>
          {/* Main Navigation List */}
          <SidebarGroupLayout
            className="px-4 pb-4"
            items={NAVIGATION_LIST}
            mapItem={(item) => ({
              label: item.label,
              to: item.to,
              icon: item.icon,
              exact: item.exact,
            })}
          />

          {/* Favorites Group Section */}
          <div className="mt-2 flex flex-col gap-2 px-4">
            <div className="flex items-center justify-between px-3 text-[0.65rem] font-bold tracking-wider text-ns-faint uppercase">
              <span className="flex items-center gap-1.5">
                <Star size={11} className="text-amber-400" />
                <span>Favorites</span>
              </span>
              {favoriteFolders.length > 0 && (
                <span className="py-0.2 rounded-full bg-ns-active px-1.5 text-[10px] font-semibold text-ns-muted">
                  {favoriteFolders.length}
                </span>
              )}
            </div>

            {favoriteFolders.length === 0 ? (
              <div className="mx-1 mt-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ns-border/40 bg-ns-panel/20 p-3.5 text-center transition-all hover:border-ns-border-soft">
                <Star size={16} className="text-ns-ghost/60" />
                <span className="text-xs font-semibold text-ns-muted">
                  No Favorites Pinned
                </span>
                <span className="text-[10px] leading-tight text-ns-faint">
                  Star folders to pin them here for 1-click access
                </span>
              </div>
            ) : (
              <SidebarGroupLayout<any>
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
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-white/5 bg-ns-bg/30 px-0 py-2">
          <Logout />
        </SidebarFooter>
      </Sidebar>

      {/* Confirm Delete Modal for Favorites */}
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

export { WorkSpaceSidebar }
