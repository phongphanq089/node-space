import React from 'react'
import { Sparkles, Plus } from 'lucide-react'
import { Button } from '@/shared/ui/core/button'
import { cn } from '@/shared/lib/utils'

export interface ShowcaseEmptyStateProps {
  title?: React.ReactNode
  description?: React.ReactNode
  primaryAction?:
    | {
        label: string
        onClick?: () => void
        icon?: React.ReactNode
      }
    | React.ReactNode
  secondaryAction?:
    | {
        label: string
        onClick?: () => void
      }
    | React.ReactNode
  className?: string
  badgeText?: string
}

export function ShowcaseEmptyState({
  title = (
    <>
      Nothing here yet —{' '}
      <span className="font-extrabold text-ns-text">pick a template</span> or
      start fresh.
    </>
  ),
  description = "You haven't created any projects yet. Create one from scratch or open the docs for a quick setup guide.",
  primaryAction,
  secondaryAction,
  className,
  badgeText,
}: ShowcaseEmptyStateProps) {
  return (
    <div
      className={cn(
        'group relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-ns-border-soft bg-ns-surface/80 p-6 text-center shadow-lg backdrop-blur-xl transition-all duration-300 sm:p-12 dark:border-white/10 dark:bg-[#0c0d14]/90 dark:shadow-2xl',
        className
      )}
    >
      {/* ── Ambient Radial Glows Behind the 3D Cards ─────────────── */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600/20 via-blue-600/15 to-amber-500/15 opacity-70 blur-3xl dark:opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-48 w-80 -translate-x-1/2 rounded-full bg-ns-primary/10 opacity-50 blur-2xl" />

      {/* ── 3D Floating Fan Stacked Screens Showcase ─────────────── */}
      <div className="relative mb-8 flex h-64 w-full max-w-lg items-center justify-center pt-2 sm:h-80 sm:pt-4">
        {/* Ambient Ground Shadow Under Cards */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-black/40 blur-xl dark:bg-black/80" />

        {/* ── Left Card (Tilted -12deg) ──────────────────────────── */}
        <div
          className="pointer-events-none absolute z-10 w-44 -translate-x-20 translate-y-3 -rotate-12 rounded-2xl border border-white/10 bg-[#12131c] p-3 text-left opacity-90 shadow-2xl transition-all duration-500 select-none group-hover:-translate-x-24 group-hover:scale-95 group-hover:-rotate-14 sm:w-56 sm:-translate-x-28 sm:opacity-95 sm:group-hover:-translate-x-32"
          style={{
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Mock Header Gradient */}
          <div className="relative h-10 w-full overflow-hidden rounded-lg bg-gradient-to-tr from-purple-900 via-indigo-800 to-amber-700/80 p-2">
            <div className="mb-1 h-1.5 w-12 rounded-full bg-white/40" />
            <div className="h-1 w-20 rounded-full bg-white/25" />
          </div>

          <div className="mt-2.5 space-y-1">
            <div className="text-[9px] font-bold text-zinc-300">
              Operators & API
            </div>
            <div className="h-1 w-full rounded-full bg-zinc-800" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-800" />
          </div>

          {/* Mock List Rows */}
          <div className="mt-3 space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/80 p-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex size-4 items-center justify-center rounded-full bg-purple-500/20 text-[8px] text-purple-300">
                    ●
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1.5 w-14 rounded-full bg-zinc-700" />
                    <div className="h-1 w-9 rounded-full bg-zinc-800" />
                  </div>
                </div>
                <div className="h-2 w-4 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Card (Tilted +12deg) ─────────────────────────── */}
        <div
          className="pointer-events-none absolute z-10 w-44 translate-x-20 translate-y-3 rotate-12 rounded-2xl border border-white/10 bg-[#12131c] p-3 text-left opacity-90 shadow-2xl transition-all duration-500 select-none group-hover:translate-x-24 group-hover:scale-95 group-hover:rotate-14 sm:w-56 sm:translate-x-28 sm:opacity-95 sm:group-hover:translate-x-32"
          style={{
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Mock Header Monogram */}
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex size-5 items-center justify-center rounded-md bg-blue-600/30 text-[10px] font-black text-blue-400">
              Δ
            </div>
            <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
          </div>

          <div className="text-[9px] font-bold text-zinc-200">
            Contact & Support
          </div>
          <div className="mt-1 h-1 w-3/4 rounded-full bg-zinc-800" />

          {/* Mock Form Inputs */}
          <div className="mt-2.5 space-y-1.5">
            <div className="rounded border border-white/10 bg-zinc-900/90 px-1.5 py-1">
              <div className="h-1 w-8 rounded-full bg-zinc-600" />
            </div>
            <div className="rounded border border-white/10 bg-zinc-900/90 px-1.5 py-1">
              <div className="h-1 w-12 rounded-full bg-zinc-600" />
            </div>
            <div className="rounded border border-white/10 bg-zinc-900/90 px-1.5 py-2">
              <div className="h-1 w-16 rounded-full bg-zinc-600" />
            </div>
            {/* Mini Blue Button */}
            <div className="flex h-4 w-full items-center justify-center rounded bg-blue-600/80">
              <div className="h-1 w-10 rounded-full bg-white/80" />
            </div>
          </div>
        </div>

        {/* ── Center Card (Front & Center, Upright) ───────────────── */}
        <div className="pointer-events-none relative z-20 w-56 rounded-2xl border border-white/15 bg-[#0f1118] p-3.5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-500 select-none group-hover:scale-105 sm:w-72 sm:p-4">
          {/* Top Tagline */}
          <div className="font-mono text-[8px] font-bold tracking-widest text-zinc-500 uppercase">
            Workspace Hub
          </div>
          <div className="mt-0.5 text-[11px] font-black tracking-tight text-white sm:text-xs">
            Latest news & updates <br />
            <span className="text-amber-400">from Workspace Team</span>
          </div>

          {/* 3 Featured Preview Mini Cards Grid */}
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-1.5">
              <div className="h-7 w-full rounded bg-gradient-to-tr from-purple-700 to-rose-600" />
              <div className="mt-1 h-1 w-3/4 rounded-full bg-zinc-600" />
              <div className="mt-0.5 h-0.5 w-1/2 rounded-full bg-zinc-700" />
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-1.5">
              <div className="flex h-7 w-full items-center justify-center rounded bg-gradient-to-br from-blue-700 to-indigo-900">
                <div className="h-2 w-4 rounded bg-amber-400/80" />
              </div>
              <div className="mt-1 h-1 w-3/4 rounded-full bg-zinc-600" />
              <div className="mt-0.5 h-0.5 w-1/2 rounded-full bg-zinc-700" />
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-1.5">
              <div className="h-7 w-full rounded bg-gradient-to-tr from-emerald-800 to-teal-600" />
              <div className="mt-1 h-1 w-3/4 rounded-full bg-zinc-600" />
              <div className="mt-0.5 h-0.5 w-1/2 rounded-full bg-zinc-700" />
            </div>
          </div>

          {/* Avatar Icon Grid (Collections) */}
          <div className="mt-2.5 flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/60 px-2 py-1.5">
            <div className="flex items-center gap-1">
              {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'].map(
                (c, i) => (
                  <div
                    key={i}
                    className="size-3.5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: c }}
                  />
                )
              )}
            </div>
            <div className="text-[7px] font-bold text-zinc-400">+12 tags</div>
          </div>
        </div>
      </div>

      {/* ── Badge / Eyebrow (Optional) ────────────────────────────── */}
      {badgeText && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ns-primary/30 bg-ns-primary/10 px-3 py-1 text-xs font-semibold text-ns-primary dark:text-ns-primary-lt">
          <Sparkles className="size-3.5" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* ── Main Heading ─────────────────────────────────────────── */}
      <h2 className="text-lg font-bold tracking-tight text-ns-text sm:text-2xl">
        {title}
      </h2>

      {/* ── Description ──────────────────────────────────────────── */}
      {description && (
        <p className="mt-2 max-w-md text-xs leading-relaxed text-ns-muted sm:text-sm">
          {description}
        </p>
      )}

      {/* ── Action Buttons Row ─────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {/* Primary Action Button */}
        {React.isValidElement(primaryAction) ? (
          primaryAction
        ) : primaryAction &&
          typeof primaryAction === 'object' &&
          'label' in primaryAction ? (
          <Button
            onClick={primaryAction.onClick}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-95 sm:text-sm"
          >
            {primaryAction.icon || <Plus size={15} />}
            <span>{primaryAction.label}</span>
          </Button>
        ) : null}

        {/* Secondary Action Button / Link */}
        {React.isValidElement(secondaryAction) ? (
          secondaryAction
        ) : secondaryAction &&
          typeof secondaryAction === 'object' &&
          'label' in secondaryAction ? (
          <Button
            variant="ghost"
            onClick={secondaryAction.onClick}
            className="text-xs font-semibold text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 sm:text-sm dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>{secondaryAction.label}</span>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
