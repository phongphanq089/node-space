import { Skeleton } from '@/shared/ui'

export function FolderCardSkeleton() {
  return (
    <div className="flex items-stretch gap-4 rounded-2xl border border-ns-border/30 bg-ns-panel/60 p-4 shadow-lg backdrop-blur-md">
      {/* Left: Thumbnail Skeleton */}
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-2xl bg-ns-primary/10" />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        {/* Title & Star */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4 rounded-md bg-ns-primary/10" />
          <Skeleton className="h-4 w-4 rounded-md bg-ns-primary/10" />
        </div>

        {/* Date */}
        <div className="mt-1 flex items-center gap-1.5">
          <Skeleton className="h-3 w-28 rounded-md bg-ns-primary/5" />
        </div>

        {/* Notes Count Badge */}
        <div className="mt-2.5 flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded-md bg-ns-primary/5" />
        </div>

        {/* Actions Row */}
        <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft/40 pt-2.5">
          <Skeleton className="h-3 w-20 rounded-md bg-ns-primary/10" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4 rounded-md bg-ns-primary/5" />
            <Skeleton className="h-4 w-4 rounded-md bg-ns-primary/5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FolderGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 3xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FolderCardSkeleton key={i} />
      ))}
    </div>
  )
}
