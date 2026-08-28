import { Laptop, Smartphone, Tablet, Compass, Sparkles } from 'lucide-react'
import type { DeviceBreakdownItem, TrafficSourceItem } from '../types'

interface AdminUserBehaviorCardProps {
  deviceData: DeviceBreakdownItem[]
  trafficSources: TrafficSourceItem[]
}

const deviceIconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  smartphone: Smartphone,
  tablet: Tablet,
}

export function AdminUserBehaviorCard({
  deviceData,
  trafficSources,
}: AdminUserBehaviorCardProps) {
  const featureEngagements = [
    { name: 'Rich Note Editor', usage: 78, color: 'bg-violet-500' },
    { name: 'Lo-fi Music Player', usage: 54, color: 'bg-amber-500' },
    { name: 'Folder & Workspace Tree', usage: 68, color: 'bg-emerald-500' },
    { name: 'Global Command Search', usage: 42, color: 'bg-sky-500' },
  ]

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-ns-border bg-ns-panel p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-ns-border/30 dark:bg-ns-panel/80 dark:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-50 text-sky-600 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-400">
            <Compass size={16} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-ns-text sm:text-base">
              User Behavior & Acquisition Channels
            </h2>
            <p className="text-[0.7rem] font-medium text-ns-muted">
              Device usage, incoming traffic channels, and feature interaction
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Traffic Sources */}
        <div className="flex flex-col gap-3 rounded-xl border border-ns-border bg-ns-surface-alt p-3.5 shadow-xs dark:border-white/5 dark:bg-black/30">
          <h3 className="text-xs font-bold tracking-wider text-ns-muted uppercase">
            Acquisition Channels
          </h3>
          <div className="flex flex-col gap-3">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-semibold text-ns-text">
                    {source.source}
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-ns-muted">
                      {source.visitors.toLocaleString()}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ns-border-soft dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Device Breakdown */}
        <div className="flex flex-col gap-3 rounded-xl border border-ns-border bg-ns-surface-alt p-3.5 shadow-xs dark:border-white/5 dark:bg-black/30">
          <h3 className="text-xs font-bold tracking-wider text-ns-muted uppercase">
            Device Distribution
          </h3>
          <div className="flex h-full flex-col justify-between gap-3">
            {deviceData.map((dev) => {
              const IconComp = deviceIconMap[dev.icon] || Laptop
              return (
                <div
                  key={dev.device}
                  className="flex items-center justify-between rounded-xl border border-ns-border bg-ns-surface p-3 shadow-xs transition-colors hover:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-500/30"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-ns-border bg-ns-surface-alt text-violet-600 dark:border-transparent dark:bg-black/40 dark:text-violet-400">
                      <IconComp size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ns-text">
                        {dev.device}
                      </p>
                      <p className="text-[0.65rem] text-ns-muted">
                        {dev.visitors.toLocaleString()} active devices
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-ns-text">
                    {dev.percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Feature Engagement */}
        <div className="flex flex-col gap-3 rounded-xl border border-ns-border bg-ns-surface-alt p-3.5 shadow-xs dark:border-white/5 dark:bg-black/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-ns-muted uppercase">
              Feature Engagement
            </h3>
            <Sparkles
              size={13}
              className="text-violet-600 dark:text-violet-400"
            />
          </div>
          <div className="flex flex-col gap-3">
            {featureEngagements.map((feat) => (
              <div key={feat.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-semibold text-ns-text">
                    {feat.name}
                  </span>
                  <span className="font-bold text-ns-muted">
                    {feat.usage}% DAU
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ns-border-soft dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${feat.color}`}
                    style={{ width: `${feat.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
