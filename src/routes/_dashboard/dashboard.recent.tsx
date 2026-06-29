import { createFileRoute } from '@tanstack/react-router'
import { NODES, NOTES } from '@/constants/moc-data'
import { Clock, ArrowUpRight, Folder, FileText } from 'lucide-react'

export const Route = createFileRoute('/_dashboard/dashboard/recent')({
  component: RecentPage,
})

function RecentPage() {
  // Combine nodes and notes for a simplified recent activity list in English
  const recentActivities = [
    { type: 'node', title: NODES[0].title, time: '2 hours ago', detail: 'Node-based Note System', isStarred: NODES[0].starred },
    { type: 'note', title: NOTES[0].title, time: '2 hours ago', detail: 'Note "Key Features"', isStarred: NOTES[0].starred },
    { type: 'note', title: NOTES[1].title, time: '2 hours ago', detail: 'Note "Technologies Used"', isStarred: NOTES[1].starred },
    { type: 'node', title: NODES[1].title, time: '5 hours ago', detail: 'Dijkstra Algorithm Explained', isStarred: NODES[1].starred },
    { type: 'node', title: NODES[2].title, time: '1 day ago', detail: 'Setup Dev Environment 2024', isStarred: NODES[2].starred },
    { type: 'note', title: NOTES[2].title, time: '1 day ago', detail: 'Note "Development Roadmap"', isStarred: NOTES[2].starred },
    { type: 'note', title: NOTES[3].title, time: '1 day ago', detail: 'Note "Use Cases"', isStarred: NOTES[3].starred },
    { type: 'node', title: NODES[3].title, time: '2 days ago', detail: 'Must-read Books for Devs', isStarred: NODES[3].starred },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg">
      {/* Header */}
      <section className="rounded-xl border border-ns-border bg-ns-panel p-6 shadow-lg relative overflow-hidden">
        <div className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-20" />
        <div className="relative">
          <p className="mb-1 text-[0.65rem] font-bold tracking-[0.12em] text-ns-accent-lt uppercase">
            Activity History
          </p>
          <h1 className="mb-2 text-xl font-bold text-ns-text flex items-center gap-2">
            <span>Recently Accessed</span>
            <Clock size={16} className="text-ns-accent-lt animate-pulse" />
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-ns-muted">
            Track your work timeline. Nodes and notes are sorted by the latest viewed or edited time.
          </p>
        </div>
      </section>

      {/* Timeline List */}
      <div className="rounded-xl border border-ns-border bg-ns-panel p-6 shadow-md relative">
        {/* Timeline Line */}
        <div className="absolute left-[39px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-ns-accent/35 via-ns-secondary/20 to-transparent border-dashed border-ns-border" />
        
        <div className="flex flex-col gap-6">
          {recentActivities.map((act, index) => (
            <div key={index} className="flex gap-4 items-start relative group animate-fade-in">
              {/* Timeline dot */}
              <div className="flex-shrink-0 z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-ns-bg border-2 border-ns-border group-hover:border-ns-accent transition-all shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-ns-accent-lt group-hover:bg-ns-accent" />
              </div>

              {/* Time display */}
              <div className="w-20 text-[0.68rem] text-ns-faint font-bold pt-1 text-left uppercase tracking-wider">
                {act.time}
              </div>

              {/* Activity Card */}
              <div className="flex-1 flex items-center justify-between gap-4 p-3 rounded-xl border border-ns-border bg-ns-bg/40 hover:bg-ns-hover/20 hover:border-ns-border-md transition-all">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    act.type === 'node' ? 'bg-ns-active/40 text-ns-accent-lt' : 'bg-ns-hover/60 text-ns-secondary'
                  }`}>
                    {act.type === 'node' ? <Folder size={14} /> : <FileText size={14} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-ns-text group-hover:text-ns-accent-lt transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-[0.58rem] text-ns-faint mt-0.5">
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-ns-ghost">
                  {act.isStarred && <span className="text-[0.65rem] text-amber-400">★</span>}
                  <button className="p-1.5 rounded-lg hover:bg-ns-hover hover:text-ns-accent-lt transition-colors cursor-pointer">
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
