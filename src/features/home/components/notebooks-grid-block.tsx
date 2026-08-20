import { Folder, ChevronRight, FolderPlus } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useFoldersQuery } from '@/features/folder'

interface NotebooksGridBlockProps {
  onNewFolder?: () => void
}

export function NotebooksGridBlock({ onNewFolder }: NotebooksGridBlockProps) {
  const navigate = useNavigate()
  const { data: dbFolders = [], isLoading } = useFoldersQuery()

  const handleSelectFolder = (folderId: string) => {
    navigate({
      to: `/workspace/folder` as any,
      search: { folderId } as any,
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Folder size={14} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white">
              Folders & Spaces
            </h2>
            <p className="hidden text-[0.65rem] text-ns-faint sm:block">
              Organize notes by projects, topics, and workspaces
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNewFolder && (
            <button
              type="button"
              onClick={onNewFolder}
              className="flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-[0.7rem] font-bold text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95"
            >
              <FolderPlus size={12} />
              <span>New Folder</span>
            </button>
          )}

          <Link
            to="/workspace/folder"
            className="flex items-center gap-1 text-[0.7rem] font-bold whitespace-nowrap text-ns-ghost no-underline transition-colors hover:text-emerald-400"
          >
            <span>View all</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Grid of Notebooks or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-video w-full animate-pulse rounded-xl border border-ns-border/20 bg-ns-surface/40"
            />
          ))}
        </div>
      ) : dbFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ns-border/40 bg-ns-surface/30 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <FolderPlus size={20} />
          </div>
          <p className="mt-2 text-xs font-bold text-white">
            No folders created yet
          </p>
          <p className="mt-0.5 text-[0.65rem] text-ns-faint">
            Create your first folder to organize your notes
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {dbFolders.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectFolder(item.id)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-ns-border/40 bg-ns-surface p-2.5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-95"
            >
              {/* Image Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-emerald-400 backdrop-blur-md">
                  <Folder size={12} />
                </div>
              </div>

              {/* Title & Info */}
              <div className="mt-2 flex min-w-0 flex-col">
                <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-emerald-300">
                  {item.name}
                </h3>
                <p className="text-[0.65rem] font-medium text-ns-faint">
                  Click to open folder
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
