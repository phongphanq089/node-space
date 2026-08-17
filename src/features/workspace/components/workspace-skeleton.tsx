import { Skeleton } from '@/shared/ui'

export function WorkspaceCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-5 shadow-lg backdrop-blur-md">
      {/* Top: Accent Box & Actions Skeleton */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-12 w-12 flex-shrink-0 rounded-xl bg-ns-surface/80" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-2.5 w-2.5 rounded-full bg-ns-surface/80" />
            <Skeleton className="h-5 w-12 rounded-md bg-ns-surface/60" />
          </div>
        </div>

        {/* Title */}
        <Skeleton className="mt-4 h-5 w-3/4 rounded-md bg-ns-surface/80" />

        {/* Description */}
        <Skeleton className="mt-2 h-3 w-full rounded-md bg-ns-surface/60" />
        <Skeleton className="mt-1 h-3 w-4/5 rounded-md bg-ns-surface/60" />

        {/* Topic Tags */}
        <div className="mt-3 flex gap-1.5">
          <Skeleton className="h-4 w-12 rounded-md bg-ns-surface/50" />
          <Skeleton className="h-4 w-14 rounded-md bg-ns-surface/50" />
        </div>
      </div>

      {/* Bottom: Date & Open Button */}
      <div className="mt-5 flex items-center justify-between border-t border-ns-border-soft/40 pt-3">
        <Skeleton className="h-3 w-20 rounded-md bg-ns-surface/60" />
        <Skeleton className="h-3 w-12 rounded-md bg-ns-surface/80" />
      </div>
    </div>
  )
}

export function WorkspaceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </div>
  )
}
