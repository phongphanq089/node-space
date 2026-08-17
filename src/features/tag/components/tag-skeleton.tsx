import { GlowCardGrid } from '@/shared/ui/system/glow-card-grid'

export function TagCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl border border-ns-border-soft bg-ns-panel/40 p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="size-7 rounded-lg bg-ns-hover/60" />
        <div className="h-3 w-20 rounded bg-ns-hover/80" />
      </div>
      <div className="h-4 w-6 rounded bg-ns-hover/60" />
    </div>
  )
}

export function TagGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <GlowCardGrid className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <TagCardSkeleton key={i} />
      ))}
    </GlowCardGrid>
  )
}
