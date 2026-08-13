import { Skeleton } from '@/shared/ui'

export function WorkspaceCardSkeleton() {
  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md">
      {/* Left: Accent Box Skeleton */}
      <Skeleton className="h-20 w-20 flex-shrink-0 rounded-2xl bg-ns-surface/80" />

      {/* Right: Content Skeleton */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        {/* Title & Color Badge */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4 rounded-md bg-ns-surface/80" />
          <Skeleton className="h-2.5 w-2.5 rounded-full bg-ns-surface/80" />
        </div>

        {/* Description */}
        <Skeleton className="mt-1.5 h-3 w-full rounded-md bg-ns-surface/60" />

        {/* Date */}
        <div className="mt-1 flex items-center gap-1.5">
          <Skeleton className="h-3 w-24 rounded-md bg-ns-surface/60" />
        </div>

        {/* Actions Row */}
        <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/40 pt-2.5">
          <Skeleton className="h-3 w-20 rounded-md bg-ns-surface/80" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4 rounded-md bg-ns-surface/60" />
            <Skeleton className="h-4 w-4 rounded-md bg-ns-surface/60" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkspaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </div>
  )
}
