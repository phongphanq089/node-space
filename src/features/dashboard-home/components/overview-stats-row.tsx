import { Folder, FileText, Image, LayoutGrid, Tag } from 'lucide-react'
import { useFoldersQuery } from '../hooks/use-folders'

export interface OverviewStatItem {
  label: string
  count: number | string
  subtitle: string
  icon: React.ElementType
  color: string
  borderColor: string
  bgColor: string
}

export function OverviewStatsRow() {
  const { data: dbFolders = [] } = useFoldersQuery()

  const stats: OverviewStatItem[] = [
    {
      label: 'Folders',
      count: dbFolders.length,
      subtitle: 'Active Folders',
      icon: Folder,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      bgColor: 'from-emerald-500/15 to-teal-500/5',
    },
    {
      label: 'Notes',
      count: 142,
      subtitle: 'Captured Thoughts',
      icon: FileText,
      color: 'text-violet-400',
      borderColor: 'border-violet-500/30 hover:border-violet-500/60',
      bgColor: 'from-violet-500/15 to-purple-500/5',
    },
    {
      label: 'Media Files',
      count: 36,
      subtitle: 'Images & Docs',
      icon: Image,
      color: 'text-sky-400',
      borderColor: 'border-sky-500/30 hover:border-sky-500/60',
      bgColor: 'from-sky-500/15 to-blue-500/5',
    },
    {
      label: 'Workspaces',
      count: 5,
      subtitle: 'Environments',
      icon: LayoutGrid,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      bgColor: 'from-amber-500/15 to-orange-500/5',
    },
    {
      label: 'Tags',
      count: 18,
      subtitle: 'Categories',
      icon: Tag,
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30 hover:border-pink-500/60',
      bgColor: 'from-pink-500/15 to-rose-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.label}
            className={`group relative flex flex-col justify-between rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.bgColor} p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-ns-muted transition-colors group-hover:text-white">
                {stat.label}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 ${stat.color} shadow-sm transition-transform group-hover:scale-110`}
              >
                <IconComponent size={16} />
              </div>
            </div>

            <div className="mt-3 flex flex-col">
              <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                {stat.count}
              </span>
              <span className="mt-0.5 text-[0.65rem] font-medium text-ns-faint">
                {stat.subtitle}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
