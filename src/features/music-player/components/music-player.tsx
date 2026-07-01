import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export default function MusicPlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    playTrack,
    selectedCategory,
    setSelectedCategory,
  } = useMusicStore()

  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined

  const categories = [
    'All',
    ...Array.from(
      new Set(playlist.map((t) => t.category).filter((c): c is string => !!c))
    ),
  ]
  const filteredPlaylist =
    selectedCategory === 'All'
      ? playlist
      : playlist.filter((t) => t.category === selectedCategory)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ns-border bg-ns-panel shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
          Chill &amp; Focus
        </span>
        <Link
          to="/dashboard/music"
          className="flex cursor-pointer items-center gap-1.5 rounded bg-ns-active px-2.5 py-1 text-[0.62rem] font-bold text-ns-accent-lt no-underline transition-all hover:bg-ns-hover"
          title="Manage focus music playlist"
        >
          <Settings size={11} />
          <span>Manage</span>
        </Link>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mx-4 mt-3 flex flex-shrink-0 gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-[0.6rem] font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-ns-active text-ns-accent-lt shadow-inner'
                : 'text-ns-muted hover:bg-ns-hover/50 hover:text-ns-text-2'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="no-scrollbar mt-2 flex flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        {filteredPlaylist.map((track) => {
          const originalIndex = playlist.findIndex((t) => t.url === track.url)
          const isActive = originalIndex === currentTrackIndex
          return (
            <button
              key={`${track.title}-${originalIndex}`}
              onClick={() => playTrack(originalIndex)}
              type="button"
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-all ${
                isActive
                  ? 'border-ns-border-em bg-gradient-to-br from-ns-active/30 to-ns-hover/10'
                  : 'border-transparent hover:bg-ns-hover/40'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-ns-border bg-gradient-to-br from-ns-accent/20 to-ns-secondary/20">
                {track.cover && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url('${track.cover}')` }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-[0.55rem] font-bold text-white">
                    {isYoutubeUrl(track.url) ? '▶' : '♫'}
                  </span>
                </div>
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1 text-left">
                <p
                  className={`truncate text-xs font-bold leading-tight ${isActive ? 'text-ns-accent-lt' : 'text-ns-text'}`}
                >
                  {track.title}
                </p>
                <p className="mt-0.5 truncate text-[0.6rem] text-ns-faint">
                  {track.artist}
                </p>
              </div>

              {/* Playing indicator */}
              {isActive && isPlaying && (
                <div className="flex h-3 flex-shrink-0 items-end gap-[1.5px]">
                  {[0.15, 0.3, 0.2].map((d, i) => (
                    <span
                      key={i}
                      className="animate-soundbar w-[1.5px] rounded-full bg-ns-accent-lt"
                      style={{ animationDelay: `${d}s`, height: '10px' }}
                    />
                  ))}
                </div>
              )}

              {/* Now playing dot if active but not playing */}
              {isActive && !isPlaying && (
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ns-accent-lt opacity-60" />
              )}
            </button>
          )
        })}

        {filteredPlaylist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs font-bold text-ns-muted">No tracks</p>
            <p className="mt-1 text-[0.62rem] text-ns-faint">
              Try a different category
            </p>
          </div>
        )}
      </div>

      {/* Currently playing strip */}
      {currentTrack && (
        <div className="border-t border-ns-border-soft bg-ns-active/20 px-3 py-2">
          <p className="truncate text-[0.6rem] font-bold text-ns-accent-lt">
            ♪ {currentTrack.title}
          </p>
          <p className="text-[0.55rem] text-ns-faint">{currentTrack.artist}</p>
        </div>
      )}
    </div>
  )
}
