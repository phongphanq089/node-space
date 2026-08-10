import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/core/avatar'
import { SidebarTrigger } from '@/shared/ui/core/sidebar'
import { useSession } from '@/shared/lib/auth-client'
import { Search, Plus } from 'lucide-react'

interface HomeHeroBannerProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewNote?: () => void
}

export function HomeHeroBanner({
  searchQuery,
  onSearchChange,
  onNewNote,
}: HomeHeroBannerProps) {
  const { data: session } = useSession()

  const user = session?.user
  const name = user?.name || 'User'
  const avatarUrl = user?.image || undefined
  const fallbackText = name.substring(0, 2).toUpperCase()
  return (
    <div className="relative min-h-[320px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      {/* Landscape Nature/Anime Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 hover:scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80')",
        }}
      />

      {/* Dark Ambient Gradients for Crisp Contrast & Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09070f] via-black/40 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* ── Top Floating Action Controls Row ── */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 cursor-pointer rounded-xl border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* + New Note */}
          <button
            onClick={onNewNote}
            type="button"
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-emerald-300 shadow-lg shadow-emerald-950/40 backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-900/80 active:scale-95"
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

      {/* ── Main Banner Content: Greeting & Search Bar ── */}
      <div className="relative z-10 flex max-w-2xl flex-col justify-end gap-4 p-6 pt-4 sm:p-8">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-medium tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
            <span>Good morning, {name}</span>
          </h1>
          <p className="mt-2 max-w-lg text-xs font-light text-white/80 drop-shadow-sm sm:text-sm">
            Capture ideas, organize knowledge, and turn thoughts into action.
          </p>
        </div>

        {/* Banner Embedded Search Bar */}
        <div className="group relative flex max-w-md items-center rounded-2xl border border-white/20 bg-black/50 px-4 py-3 shadow-2xl backdrop-blur-xl transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/30 hover:border-white/30">
          <Search
            size={18}
            className="text-white/60 transition-colors group-focus-within:text-emerald-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes, notebooks, tags..."
            className="ml-3 flex-1 border-none bg-transparent text-xs text-white placeholder-white/50 outline-none sm:text-sm"
          />
          <kbd className="hidden items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-white/80 sm:inline-flex">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  )
}
