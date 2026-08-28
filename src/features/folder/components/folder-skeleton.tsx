import { Skeleton } from '@/shared/ui'

export function FolderCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-ns-border-soft bg-ns-surface/80 p-3.5 shadow-xs backdrop-blur-md transition-all dark:border-white/10 dark:bg-ns-panel/60 dark:shadow-lg">
      {/* Top: Thumbnail Skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-xl bg-ns-surface-alt dark:bg-ns-primary/10" />

      {/* Middle: Content */}
      <div className="mt-3.5 flex flex-1 flex-col">
        {/* Tag skeleton */}
        <Skeleton className="h-4 w-16 rounded-md bg-ns-primary/15 dark:bg-ns-primary/20" />

        {/* Title skeleton */}
        <Skeleton className="mt-2.5 h-4 w-3/4 rounded-md" />

        {/* Subtitle skeleton */}
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md opacity-70" />
          <Skeleton className="h-3 w-2/3 rounded-md opacity-70" />
        </div>

        {/* Bottom / Footer Row */}
        <div className="mt-4 flex items-center justify-between border-t border-ns-border-soft pt-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FolderGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FolderCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FolderListItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ns-border-soft bg-ns-surface/80 p-3 shadow-xs transition-all dark:border-white/10 dark:bg-ns-panel/60">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-3.5 w-12 rounded" />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden flex-col items-end gap-1.5 md:flex">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  )
}

export function FolderListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <FolderListItemSkeleton key={i} />
      ))}
    </div>
  )
}
