import { Server, CheckCircle2 } from 'lucide-react'
import type { SystemHealthMetric } from '../types'

interface AdminSystemHealthCardProps {
  metrics: SystemHealthMetric[]
}

export function AdminSystemHealthCard({ metrics }: AdminSystemHealthCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ns-border bg-ns-panel p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-ns-border/30 dark:bg-ns-panel/80 dark:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Server size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-ns-text sm:text-base">
                Cloudflare Infrastructure & Edge Health
              </h2>
              <span className="py-0.2 flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 text-[0.6rem] font-extrabold text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 size={10} />
                99.98% All Systems Operational
              </span>
            </div>
            <p className="text-[0.7rem] font-medium text-ns-muted">
              Cloudflare D1 database, R2 media storage, edge worker latency &
              session auth
            </p>
          </div>
        </div>
      </div>

      {/* Grid of services */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.service}
            className="flex flex-col justify-between rounded-xl border border-ns-border bg-ns-surface-alt p-3.5 shadow-xs transition-all hover:border-emerald-500/40 hover:bg-ns-surface dark:border-white/10 dark:bg-black/40 dark:hover:border-emerald-500/30 dark:hover:bg-black/60"
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-bold text-ns-text">
                {m.service}
              </span>
              <span className="flex items-center gap-1 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {m.uptime}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-[0.7rem] text-ns-muted">
                {m.metricLabel}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">
                {m.metricValue}
              </span>
            </div>

            {/* Usage Bar if provided */}
            {m.usagePercent !== undefined && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex justify-between text-[0.65rem] text-ns-muted">
                  <span>Quota Usage</span>
                  <span>{m.usagePercent}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-ns-border-soft dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${m.usagePercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
