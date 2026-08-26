import { useState, useEffect } from 'react'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  Button,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui'
import { useSession } from '@/shared/lib/auth-client'
import { Calendar, Edit } from 'lucide-react'
import { FolderSearchBar } from './folder-search-bar'
import { BannerEditModal } from './banner-edit-modal'
import { useHeroBannerStore } from '../store/use-hero-banner-store'
import { useHeroBannerQuery } from '../hooks/use-folders'

export function HeroBannerSkeleton() {
  return (
    <div className="relative min-h-[300px] w-full min-w-0 overflow-hidden rounded-3xl border border-ns-border-md bg-ns-surface/90 p-6 shadow-sm backdrop-blur-xl transition-all sm:min-h-[320px] sm:p-8 dark:border-white/10 dark:bg-ns-panel/90 dark:shadow-2xl">
      {/* Subtle ambient lighting for both light and dark themes */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-ns-primary/10 opacity-70 blur-3xl dark:bg-ns-primary/15 dark:opacity-50" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 opacity-70 blur-3xl dark:bg-purple-500/15 dark:opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-ns-surface/80 via-transparent to-transparent dark:from-[#09070f]/90 dark:via-black/40 dark:to-transparent" />

      {/* Top right: Avatar profile skeleton */}
      <div className="relative z-20 flex items-center justify-end">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-9 w-9 rounded-full border border-ns-border-soft dark:border-white/20" />
        </div>
      </div>

      {/* Main Banner Content Skeleton */}
      <div className="relative z-10 mt-6 flex max-w-3xl flex-col justify-end gap-5 pt-2 sm:mt-8 sm:p-0">
        <div className="flex flex-col gap-2.5">
          {/* Date skeleton pill */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20" />
            <Skeleton className="h-3.5 w-28 rounded-md bg-emerald-500/20 dark:bg-emerald-400/20" />
          </div>

          {/* Greeting Title skeleton */}
          <Skeleton className="mt-1 h-8 w-64 rounded-xl sm:h-10 sm:w-80" />

          {/* Subtitle skeleton */}
          <div className="mt-1 flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-full max-w-lg rounded-md" />
            <Skeleton className="h-3.5 w-3/4 max-w-sm rounded-md" />
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="w-full max-w-2xl pt-1">
          <div className="relative flex h-11 w-full items-center rounded-xl border border-ns-border-md bg-ns-surface/70 px-3.5 shadow-xs dark:border-white/10 dark:bg-white/5">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="ml-3 h-3.5 w-48 rounded-md" />
            <div className="ml-auto flex items-center gap-2">
              <Skeleton className="h-6 w-14 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom right: Edit banner button skeleton */}
      <div className="absolute right-4 bottom-5 z-10">
        <Skeleton className="h-8 w-8 rounded-lg border border-ns-border-soft dark:border-white/10" />
      </div>
    </div>
  )
}

interface HeroBannerProps {
  search?: string
  onSearchChange?: (query: string) => void
  onCreateFolder?: () => void
}

export function HeroBanner({
  search = '',
  onSearchChange = () => {},
  onCreateFolder,
}: HeroBannerProps) {
  const { data: session } = useSession()
  const { data: dbBanner, isLoading: isBannerLoading } = useHeroBannerQuery()
  const { bannerUrl, setBannerUrl } = useHeroBannerStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Sync with database banner if fetched
  useEffect(() => {
    if (dbBanner?.bannerUrl && dbBanner.bannerUrl !== bannerUrl) {
      setBannerUrl(dbBanner.bannerUrl, dbBanner.presetId)
    }
  }, [dbBanner?.bannerUrl, dbBanner?.presetId, bannerUrl, setBannerUrl])

  // Show Loading Skeleton during initial load
  if (isBannerLoading) {
    return <HeroBannerSkeleton />
  }

  const user = session?.user
  const name = user?.name || 'Explorer'
  const avatarUrl = user?.image || undefined
  const fallbackText = name.substring(0, 2).toUpperCase()

  // Dynamic time-based greeting
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
        ? 'Good afternoon'
        : 'Good evening'

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <>
      <div className="relative min-h-[300px] w-full animate-in overflow-hidden rounded-3xl border border-white/15 bg-ns-panel/90 shadow-2xl transition-all duration-500 fade-in sm:min-h-[320px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('${bannerUrl}')`,
          }}
        />

        <div className="absolute right-4 bottom-5 z-5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  size={'icon-sm'}
                  variant={'outline'}
                >
                  <Edit size={14} />
                </Button>
              }
            />
            <TooltipContent>Edit banner</TooltipContent>
          </Tooltip>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09070f] via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-ns-primary/15 blur-3xl" />

        <div className="relative z-20 flex items-end justify-end p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-9 w-9 border border-white/20 shadow-md">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-ns-primary text-xs font-bold text-white">
                {fallbackText}
              </AvatarFallback>
              <AvatarBadge className="bg-green-500 ring-2 ring-black" />
            </Avatar>
          </div>
        </div>

        <div className="relative z-10 flex max-w-3xl flex-col justify-end gap-5 p-6 pt-2 sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              <Calendar size={13} />
              <span>{formattedDate}</span>
            </div>
            <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
              <span>
                {greeting}, {name}
              </span>
            </h1>
            <p className="mt-1.5 max-w-xl text-xs leading-relaxed font-light text-white/80 drop-shadow-sm sm:text-sm">
              Personal Knowledge Hub • Capture ideas, organize thoughts, and
              build your second brain.
            </p>
          </div>
          <div className="w-full max-w-2xl pt-1">
            <FolderSearchBar
              variant="banner"
              search={search}
              onSearchChange={onSearchChange}
              onCreateFolder={onCreateFolder}
              placeholder="Search folders by name or tag..."
            />
          </div>
        </div>
      </div>
      <BannerEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}
