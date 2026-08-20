import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Globe, Eye, Users, MousePointerClick } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
  
} from '@/shared/ui'
import type {ChartConfig} from '@/shared/ui';
import type { AnalyticsTrafficPoint } from '../types'

interface AdminAnalyticsChartProps {
  data: AnalyticsTrafficPoint[]
}

const analyticsChartConfig = {
  pageviews: {
    label: 'Pageviews',
    color: '#8b5cf6', // violet
    icon: Eye,
  },
  visitors: {
    label: 'Unique Visitors',
    color: '#06b6d4', // cyan / sky
    icon: Users,
  },
  sessions: {
    label: 'User Sessions',
    color: '#10b981', // emerald
    icon: MousePointerClick,
  },
} satisfies ChartConfig

export function AdminAnalyticsChart({ data }: AdminAnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<
    'pageviews' | 'visitors' | 'sessions'
  >('pageviews')

  // Compute totals
  const totalPageviews = data.reduce((acc, curr) => acc + curr.pageviews, 0)
  const totalVisitors = data.reduce((acc, curr) => acc + curr.visitors, 0)
  const totalSessions = data.reduce((acc, curr) => acc + curr.sessions, 0)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ns-border bg-ns-panel p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-ns-border/30 dark:bg-ns-panel/80 dark:shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-50 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-400">
            <Globe size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-ns-text sm:text-base">
                Google Analytics Traffic & Engagement
              </h2>
              <span className="py-0.2 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 text-[0.6rem] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live Sync
              </span>
            </div>
            <p className="text-[0.7rem] font-medium text-ns-muted">
              Audience traffic, visitor sessions, and page view activity
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center rounded-xl border border-ns-border bg-ns-surface-alt p-1 shadow-xs dark:border-white/10 dark:bg-black/40">
          <button
            type="button"
            onClick={() => setActiveMetric('pageviews')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeMetric === 'pageviews'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-ns-muted hover:text-ns-text'
            }`}
          >
            <Eye size={12} />
            <span>Pageviews ({totalPageviews.toLocaleString()})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('visitors')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeMetric === 'visitors'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-ns-muted hover:text-ns-text'
            }`}
          >
            <Users size={12} />
            <span>Visitors ({totalVisitors.toLocaleString()})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('sessions')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeMetric === 'sessions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-ns-muted hover:text-ns-text'
            }`}
          >
            <MousePointerClick size={12} />
            <span>Sessions ({totalSessions.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Design System Chart Container */}
      <div className="pt-2">
        <ChartContainer
          config={analyticsChartConfig}
          className="aspect-auto h-72 w-full"
        >
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fill-pageviews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pageviews)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pageviews)"
                  stopOpacity={0.0}
                />
              </linearGradient>
              <linearGradient id="fill-visitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.0}
                />
              </linearGradient>
              <linearGradient id="fill-sessions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(128,128,128,0.15)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(128,128,128,0.2)' }}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="border-ns-border bg-ns-surface text-ns-text shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#120f24]/95 dark:text-white"
                />
              }
            />

            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={`var(--color-${activeMetric})`}
              strokeWidth={2.5}
              fill={`url(#fill-${activeMetric})`}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
