import {
  ShieldAlert,
  Download,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useSession } from '@/shared/lib/auth-client'
import { toast } from 'sonner'

interface AdminHeaderProps {
  timeRange: string
  onTimeRangeChange: (range: string) => void
  onRefresh: () => void
  isRefreshing?: boolean
}

export function AdminHeader({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const { data: session } = useSession()
  const user = session?.user

  const handleExport = () => {
    toast.success('Analytics & User metrics exported as CSV!')
  }

  const timeRanges = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' },
  ]

  return (
    <div className="flex flex-col gap-4 border-b border-ns-border bg-ns-surface/90 p-4 backdrop-blur-xl sm:p-6 lg:p-8 dark:bg-gradient-to-b dark:from-[#140e24]/90 dark:via-[#0d0918]/80 dark:to-transparent">
      {/* Top Breadcrumb & Switcher Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/workspace/folder"
            className="flex h-8.5 items-center gap-1.5 rounded-xl border border-ns-border bg-ns-surface-alt px-3 text-xs font-semibold text-ns-text-2 no-underline transition-all hover:border-violet-500/40 hover:bg-ns-hover hover:text-ns-text dark:bg-white/5"
          >
            <ArrowLeft size={13} />
            <span>Go to Note Workspace</span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-50 px-3 py-1 text-[0.65rem] font-black tracking-widest text-violet-700 uppercase shadow-xs dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300">
            <ShieldAlert
              size={12}
              className="text-violet-600 dark:text-violet-400"
            />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* User Info / Status */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold text-ns-text">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-400">
              ● Live System Mode
            </p>
          </div>
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-violet-500/30 bg-violet-100 p-0.5 shadow-sm dark:border-violet-500/40 dark:bg-violet-950/60">
            {user?.image ? (
              <img
                src={user.image}
                alt="Admin"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-violet-600 font-bold text-white">
                AD
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Title & Action Controls Row */}
      <div className="flex flex-col justify-between gap-4 pt-1 md:flex-row md:items-end">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-ns-text sm:text-3xl">
            <span>Executive Analytics & Operations</span>
            <Sparkles
              size={20}
              className="text-violet-600 dark:text-violet-400"
            />
          </h1>
          <p className="mt-1 text-xs text-ns-muted sm:text-sm">
            Real-time platform overview: Users, MRR Revenue, Google Analytics,
            Behavior, and Cloudflare D1/R2 Telemetry.
          </p>
        </div>

        {/* Controls: Time filter & Export & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center rounded-xl border border-ns-border bg-ns-surface-alt p-1 shadow-xs dark:border-white/10 dark:bg-black/40">
            <Calendar size={13} className="mx-2 text-ns-muted" />
            {timeRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => onTimeRangeChange(r.value)}
                type="button"
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  timeRange === r.value
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-ns-muted hover:text-ns-text'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            type="button"
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-ns-border bg-ns-surface px-3 text-xs font-semibold text-ns-text-2 shadow-xs transition-all hover:border-violet-500/40 hover:bg-ns-hover active:scale-95 dark:border-white/10 dark:bg-black/40"
            title="Refresh metrics data"
          >
            <RefreshCw
              size={13}
              className={
                isRefreshing
                  ? 'animate-spin text-violet-600 dark:text-violet-400'
                  : ''
              }
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            type="button"
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 dark:border-emerald-500/40 dark:bg-emerald-950/70 dark:text-emerald-300"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  )
}
