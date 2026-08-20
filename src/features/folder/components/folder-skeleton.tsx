import { Skeleton } from '@/shared/ui'

export function FolderCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-ns-border/40 bg-ns-panel/60 p-3.5 shadow-lg backdrop-blur-md">
      {/* Top: Thumbnail Skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-xl bg-ns-primary/10" />

      {/* Middle: Content */}
      <div className="mt-3.5 flex flex-1 flex-col">
        {/* Tag skeleton */}
        <Skeleton className="h-4 w-16 rounded-md bg-ns-primary/10" />

        {/* Title skeleton */}
        <Skeleton className="mt-2 h-4 w-3/4 rounded-md bg-ns-primary/10" />

        {/* Subtitle skeleton */}
        <div className="mt-2 space-y-1">
          <Skeleton className="h-3 w-full rounded-md bg-ns-primary/5" />
          <Skeleton className="h-3 w-2/3 rounded-md bg-ns-primary/5" />
        </div>

        {/* Bottom / Footer Row */}
        <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft/40 pt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full bg-ns-primary/10" />
            <Skeleton className="h-3 w-20 rounded-md bg-ns-primary/5" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-7 rounded-lg bg-ns-primary/5" />
            <Skeleton className="size-7 rounded-lg bg-ns-primary/5" />
            <Skeleton className="size-7 rounded-lg bg-ns-primary/5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FolderGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FolderCardSkeleton key={i} />
      ))}
    </div>
  )
}
