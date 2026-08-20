import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  SidebarTrigger,
} from '@/shared/ui'
import { useSession } from '@/shared/lib/auth-client'
import { Plus, Calendar, FolderPlus } from 'lucide-react'
import { SearchGlobal } from '@/widgets/search-global'

interface HomeHeroBannerProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onNewNote?: () => void
  onNewFolder?: () => void
}

export function HomeHeroBanner({
  onNewNote,
  onNewFolder,
}: HomeHeroBannerProps) {
  const { data: session } = useSession()

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
    <div className="relative min-h-[280px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* Landscape Nature/Atmosphere Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80')",
        }}
      />

      {/* Ambient Gradients for Crisp Contrast & Focus */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09070f] via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      {/* ── Top Floating Action Controls Row ── */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 cursor-pointer rounded-xl border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* + New Folder */}
          {onNewFolder && (
            <button
              onClick={onNewFolder}
              type="button"
              className="hidden h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-white/90 backdrop-blur-md transition-all hover:bg-black/60 hover:text-white active:scale-95 sm:flex"
            >
              <FolderPlus size={14} />
              <span>New Folder</span>
            </button>
          )}

          {/* + New Note */}
          <button
            onClick={onNewNote}
            type="button"
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/70 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-emerald-300 shadow-lg shadow-emerald-950/40 backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-900/90 active:scale-95"
          >
            <Plus size={15} />
            <span>New Note</span>
          </button>

          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
        </div>
      </div>

      {/* ── Main Banner Content: Greeting, Date & Search Bar ── */}
      <div className="relative z-10 flex max-w-2xl flex-col justify-end gap-4 p-6 pt-2 sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400/90 uppercase">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
          <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
            <span>
              {greeting}, {name}
            </span>
          </h1>
          <p className="mt-1 max-w-lg text-xs font-light text-white/80 drop-shadow-sm sm:text-sm">
            Personal Knowledge Hub • Capture ideas, organize thoughts, and build
            second brain.
          </p>
        </div>

        {/* Global Search Bar */}
        <SearchGlobal />
      </div>
    </div>
  )
}
