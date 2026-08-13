import { FileText, FolderPlus, UploadCloud, Headphones } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface QuickActionsRowProps {
  onQuickNote?: () => void
  onNewNotebook?: () => void
  onUploadFile?: () => void
}

export function QuickActionsRow({
  onQuickNote,
  onNewNotebook,
  onUploadFile,
}: QuickActionsRowProps) {
  const actions = [
    {
      title: 'Quick Note',
      desc: 'Capture a thought',
      icon: FileText,
      color:
        'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      onClick: onQuickNote,
    },
    {
      title: 'New Notebook',
      desc: 'Create a notebook',
      icon: FolderPlus,
      color:
        'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30',
      onClick: onNewNotebook,
    },
    {
      title: 'Upload File',
      desc: 'Images, docs, files',
      icon: UploadCloud,
      color: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30',
      onClick: onUploadFile,
    },
    {
      title: 'Music Manager',
      desc: 'Your lo-fi library',
      icon: Headphones,
      color:
        'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
      to: '/workspace/music',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {actions.map((act) => {
        const IconComponent = act.icon
        const content = (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${act.color} shadow-sm transition-transform group-hover:scale-110`}
            >
              <IconComponent size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-ns-primary-lt sm:text-sm">
                {act.title}
              </h3>
              <p className="truncate text-[0.65rem] font-medium text-ns-faint">
                {act.desc}
              </p>
            </div>
          </div>
        )

        if (act.to) {
          return (
            <Link
              key={act.title}
              to={act.to}
              className="group cursor-pointer rounded-2xl border border-ns-border/30 bg-ns-panel/80 p-3.5 no-underline shadow-md backdrop-blur-md transition-all hover:border-ns-border-md hover:bg-ns-hover active:scale-[0.98]"
            >
              {content}
            </Link>
          )
        }

        return (
          <button
            key={act.title}
            onClick={act.onClick}
            type="button"
            className="group cursor-pointer rounded-2xl border border-ns-border/30 bg-ns-panel/80 p-3.5 text-left shadow-md backdrop-blur-md transition-all hover:border-ns-border-md hover:bg-ns-hover active:scale-[0.98]"
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
