import { createFileRoute } from '@tanstack/react-router'
import { NODES, NOTES } from '@/constants/moc-data'
import { Clock, ArrowUpRight, Folder, FileText } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/recent')({
  component: RecentPage,
})

function RecentPage() {
  // Combine nodes and notes for a simplified recent activity list in English
  const recentActivities = [
    {
      type: 'node',
      title: NODES[0].title,
      time: '2 hours ago',
      detail: 'Node-based Note System',
      isStarred: NODES[0].starred,
    },
    {
      type: 'note',
      title: NOTES[0].title,
      time: '2 hours ago',
      detail: 'Note "Key Features"',
      isStarred: NOTES[0].starred,
    },
    {
      type: 'note',
      title: NOTES[1].title,
      time: '2 hours ago',
      detail: 'Note "Technologies Used"',
      isStarred: NOTES[1].starred,
    },
    {
      type: 'node',
      title: NODES[1].title,
      time: '5 hours ago',
      detail: 'Dijkstra Algorithm Explained',
      isStarred: NODES[1].starred,
    },
    {
      type: 'node',
      title: NODES[2].title,
      time: '1 day ago',
      detail: 'Setup Dev Environment 2024',
      isStarred: NODES[2].starred,
    },
    {
      type: 'note',
      title: NOTES[2].title,
      time: '1 day ago',
      detail: 'Note "Development Roadmap"',
      isStarred: NOTES[2].starred,
    },
    {
      type: 'note',
      title: NOTES[3].title,
      time: '1 day ago',
      detail: 'Note "Use Cases"',
      isStarred: NOTES[3].starred,
    },
    {
      type: 'node',
      title: NODES[3].title,
      time: '2 days ago',
      detail: 'Must-read Books for Devs',
      isStarred: NODES[3].starred,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg">
        <div className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="text-ns-primary-lt mb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
            Activity History
          </p>
          <h1 className="mb-2 flex items-center gap-2 text-xl font-bold text-ns-text">
            <span>Recently Accessed</span>
            <Clock size={16} className="text-ns-primary-lt animate-pulse" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Track your work timeline. Nodes and notes are sorted by the latest
            viewed or edited time.
          </p>
        </div>
      </section>

      {/* Timeline List */}
      <div className="relative rounded-xl border border-ns-border bg-ns-panel p-6 shadow-md">
        {/* Timeline Line */}
        <div className="from-ns-primary/35 absolute top-8 bottom-8 left-[39px] w-[2px] border-dashed border-ns-border bg-gradient-to-b via-ns-secondary/20 to-transparent" />

        <div className="flex flex-col gap-6">
          {recentActivities.map((act, index) => (
            <div
              key={index}
              className="group animate-fade-in relative flex items-start gap-4"
            >
              {/* Timeline dot */}
              <div className="group-hover:border-ns-primary z-10 flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full border-2 border-ns-border bg-ns-bg shadow-md transition-all">
                <span className="bg-ns-primary-lt group-hover:bg-ns-primary h-1.5 w-1.5 rounded-full" />
              </div>

              {/* Time display */}
              <div className="w-20 pt-1 text-left text-[0.68rem] font-bold tracking-wider text-ns-faint uppercase">
                {act.time}
              </div>

              {/* Activity Card */}
              <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border border-ns-border bg-ns-bg/40 p-3 transition-all hover:border-ns-border-md hover:bg-ns-hover/20">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      act.type === 'node'
                        ? 'text-ns-primary-lt bg-ns-active/40'
                        : 'bg-ns-hover/60 text-ns-secondary'
                    }`}
                  >
                    {act.type === 'node' ? (
                      <Folder size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                  </div>
                  <div>
                    <h3 className="group-hover:text-ns-primary-lt text-xs font-bold text-ns-text transition-colors">
                      {act.title}
                    </h3>
                    <p className="mt-0.5 text-[0.58rem] text-ns-faint">
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-ns-ghost">
                  {act.isStarred && (
                    <span className="text-[0.65rem] text-amber-400">★</span>
                  )}
                  <button className="hover:text-ns-primary-lt cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-ns-hover">
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
