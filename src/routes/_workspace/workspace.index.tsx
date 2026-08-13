import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  HomeHeroBanner,
  OverviewStatsRow,
  QuickActionsRow,
  NotebooksGridBlock,
  RecentNotesBlock,
  LofiStreamCard,
  PinnedNotesWidget,
  PopularTagsWidget,
} from '@/features/home'
import { CreateFolderModal } from '@/features/folder'

export const Route = createFileRoute('/_workspace/workspace/')({
  component: DashboardHome,
})

function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)

  return (
    <div className="flex min-h-full w-full flex-col pb-8">
      {/* Main Home Content Flow */}
      <div className="flex flex-col gap-6">
        {/* Full Landscape Hero Banner with embedded controls & search */}
        <HomeHeroBanner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewNote={() => setIsCreateFolderOpen(true)}
        />

        {/* Overview Metric Stats Summary Row (Folders, Notes, Media, Workspaces, Tags) */}
        <OverviewStatsRow />

        {/* Quick Action Shortcut Cards */}
        <QuickActionsRow
          onQuickNote={() => setIsCreateFolderOpen(true)}
          onNewNotebook={() => setIsCreateFolderOpen(true)}
          onUploadFile={() => setIsCreateFolderOpen(true)}
        />

        {/* Asymmetric 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Main Column (8 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Notebooks Grid Block */}
            <NotebooksGridBlock
              onSelectNotebook={() => setIsCreateFolderOpen(true)}
            />

            {/* Recent Notes Block */}
            <RecentNotesBlock searchQuery={searchQuery} />
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Lo-fi Cyberpunk Live Stream Card */}
            <LofiStreamCard />

            {/* Pinned Notes Card */}
            <PinnedNotesWidget />

            {/* Popular Tags Card */}
            <PopularTagsWidget />
          </div>
        </div>
      </div>

      {/* Create Folder / Notebook Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </div>
  )
}
