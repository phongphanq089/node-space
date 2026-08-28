import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DollarSign, Zap, TrendingUp, CreditCard } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui'
import type { ChartConfig } from '@/shared/ui'
import type { RevenueGrowthPoint } from '../types'

interface AdminRevenueChartProps {
  data: RevenueGrowthPoint[]
}

const revenueChartConfig = {
  mrr: {
    label: 'Monthly Recurring Revenue',
    color: '#10b981', // emerald
    icon: DollarSign,
  },
} satisfies ChartConfig

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  const currentMrr = data[data.length - 1]?.mrr || 12450
  const arr = currentMrr * 12
  const latestPro = data[data.length - 1]?.proUsers || 1450
  const latestTeam = data[data.length - 1]?.teamUsers || 152

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ns-border bg-ns-panel p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-ns-border/30 dark:bg-ns-panel/80 dark:shadow-xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
            <DollarSign size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-ns-text sm:text-base">
                MRR & Subscription Growth
              </h2>
              <span className="py-0.2 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 text-[0.6rem] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={10} />
                +24.6% MoM
              </span>
            </div>
            <p className="text-[0.7rem] font-medium text-ns-muted">
              Monthly Recurring Revenue, ARR, and subscriber tiers
            </p>
          </div>
        </div>

        {/* Revenue Badges */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-right text-emerald-900 shadow-xs dark:bg-emerald-950/40 dark:text-white">
            <p className="text-[0.6rem] font-bold text-emerald-600 uppercase dark:text-emerald-400">
              Current MRR
            </p>
            <p className="text-sm font-black text-ns-text">
              ${currentMrr.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-ns-border bg-ns-surface-alt px-3 py-1 text-right shadow-xs dark:border-white/10 dark:bg-black/40">
            <p className="text-[0.6rem] font-bold text-ns-muted uppercase">
              Annual ARR
            </p>
            <p className="text-sm font-black text-ns-text">
              ${arr.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Design System Bar Chart Container */}
      <div className="pt-2">
        <ChartContainer
          config={revenueChartConfig}
          className="aspect-auto h-60 w-full"
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(128,128,128,0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
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
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="border-ns-border bg-ns-surface text-ns-text shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#120f24]/95 dark:text-white"
                  formatter={(value) => (
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(value).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="mrr"
              fill="var(--color-mrr)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Subscription Tier Breakdown Cards */}
      <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-ns-border bg-ns-surface-alt p-3 shadow-xs dark:border-white/10 dark:bg-black/40">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 text-ns-text dark:bg-white/10">
              <CreditCard size={13} />
            </div>
            <div>
              <p className="text-xs font-bold text-ns-text">Free Tier</p>
              <p className="text-[0.65rem] text-ns-muted">12,920 users (87%)</p>
            </div>
          </div>
          <span className="text-xs font-black text-ns-muted">$0</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-50/70 p-3 text-violet-900 shadow-xs dark:border-violet-500/30 dark:bg-violet-950/20 dark:text-violet-300">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              <Zap size={13} />
            </div>
            <div>
              <p className="text-xs font-bold text-violet-900 dark:text-violet-300">
                Pro Tier
              </p>
              <p className="text-[0.65rem] text-violet-700/70 dark:text-ns-faint">
                {latestPro} users ($8/mo)
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-violet-900 dark:text-violet-300">
            ${(latestPro * 8).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-50/70 p-3 text-emerald-900 shadow-xs dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <DollarSign size={13} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Team Tier
              </p>
              <p className="text-[0.65rem] text-emerald-700/70 dark:text-ns-faint">
                {latestTeam} teams ($24/mo)
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">
            ${(latestTeam * 24).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
