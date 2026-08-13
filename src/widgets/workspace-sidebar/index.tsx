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
  Button,
  BrandLogo,
} from '@/shared/ui'

import {
  Plus,
  MoreHorizontal,
  StarOff,
  Link2,
  ArrowUpRight,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Logout } from './logout'
import { WORKSPACES } from '@/shared/mocks/mock-data'
import { SidebarGroupLayout } from './sidebar-group-layout'
import { NAVIGATION_LIST } from './navigation-list'
import { useWorkspacesQuery, CreateWorkspaceModal } from '@/features/workspace'
import { useFoldersQuery } from '@/features/folder'

const WorkSpaceSidebar = () => {
  const { isMobile } = useSidebar()
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const { data: dbWorkspaces = [] } = useWorkspacesQuery()
  const { data: dbFolders = [] } = useFoldersQuery()

  const displayWorkspaces = dbWorkspaces.length > 0 ? dbWorkspaces : WORKSPACES

  const favoriteFolders = dbFolders
    .filter((f) => f.isFavorite)
    .map((f) => ({
      id: f.id,
      name: f.name,
      url: '/workspace/folder',
    }))

  const favoriteWorkspaces = dbWorkspaces
    .filter((w) => w.isFavorite)
    .map((w) => ({
      id: w.id,
      name: w.name,
      url: '#',
    }))

  const favoriteItems = [...favoriteFolders, ...favoriteWorkspaces]

  return (
    <>
      <Sidebar variant="inset" className="border-none bg-ns-bg">
        <SidebarHeader className="flex flex-col gap-3 px-4 py-4">
          <BrandLogo />
        </SidebarHeader>
        <SidebarContent>
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
          <SidebarGroupLayout<any>
            className="mt-2 px-4 pb-4"
            title="Workspaces"
            headerAction={
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setIsCreateWorkspaceOpen(true)}
                className="cursor-pointer text-ns-ghost transition-colors hover:text-ns-primary-lt"
                title="Add Workspace"
              >
                <Plus size={12} />
              </Button>
            }
            items={displayWorkspaces}
            mapItem={(workspace: any) => ({
              label: workspace.name,
              color: workspace.color ?? '#3b82f6',
              to: `/workspace/folder?workspaceId=${workspace.id}`,
            })}
            showMoreButton
          />
          <SidebarGroupLayout<any>
            className="mt-2 px-4"
            title="Favorites"
            items={favoriteItems}
            mapItem={(item: any) => ({
              label: item.name,
              href: item.url,
            })}
            showMoreButton
            renderActions={() => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link2 className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-white/5 bg-ns-bg/30 px-0 py-2">
          <Logout />
        </SidebarFooter>
      </Sidebar>
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />
    </>
  )
}

export { WorkSpaceSidebar }
