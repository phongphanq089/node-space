import {
  Users,
  DollarSign,
  Activity,
  FileText,
  HardDrive,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import type { AdminKpiMetric } from '../types'

interface AdminKpiGridProps {
  metrics: AdminKpiMetric[]
}

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  'dollar-sign': DollarSign,
  activity: Activity,
  'file-text': FileText,
  'hard-drive': HardDrive,
}

export function AdminKpiGrid({ metrics }: AdminKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
      {metrics.map((metric) => {
        const IconComponent = iconMap[metric.iconName] || Activity
        const isPositive = metric.change >= 0

        return (
          <div
            key={metric.id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-md sm:p-5 dark:shadow-xl dark:hover:shadow-2xl ${metric.color}`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-ns-muted-md transition-colors group-hover:text-ns-text">
                {metric.label}
              </span>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ns-border/60 bg-ns-surface/80 shadow-xs transition-transform group-hover:scale-110 dark:border-white/10 dark:bg-black/40">
                <IconComponent size={17} />
              </div>
            </div>

            {/* Value & Change row */}
            <div className="mt-4 flex flex-col">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-black tracking-tight text-ns-text sm:text-3xl">
                  {metric.value}
                </span>

                <div
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.65rem] font-black ${
                    isPositive
                      ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'border border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp size={11} />
                  ) : (
                    <TrendingDown size={11} />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>

              <span className="mt-1 text-[0.7rem] font-medium text-ns-muted">
                {metric.subtitle}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
