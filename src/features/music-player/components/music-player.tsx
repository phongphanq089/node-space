import { Link } from '@tanstack/react-router'
import { Settings, Play, Pause, Youtube, Music, Volume2 } from 'lucide-react'
import { useMusicStore } from '@/features/music-player/store/useMusicStore'
import type { TrackItem } from '@/features/music-player/store/useMusicStore'

export function MusicPlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    playTrack,
    selectedCategory,
    setSelectedCategory,
    setYoutubePlayerMode,
    setIsPlaying,
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ns-border-soft bg-ns-panel/90 shadow-xl backdrop-blur-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-ns-border-soft/60 px-4 py-3">
        <span className="text-xs font-bold tracking-wider text-ns-muted uppercase">
          Chill &amp; Focus Streams
        </span>
        <Link
          to="/workspace/music"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-ns-border-soft bg-ns-bg/50 px-2.5 py-1 text-[0.65rem] font-bold text-ns-primary-lt no-underline transition-all hover:bg-ns-hover hover:text-white"
          title="Manage focus music playlist"
        >
          <Settings size={11} />
          <span>Manage</span>
        </Link>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar flex flex-shrink-0 gap-1.5 overflow-x-auto px-4 pt-3 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={`cursor-pointer rounded-lg px-3 py-1 text-[0.65rem] font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-ns-primary text-white shadow-md'
                : 'text-ns-ghost hover:bg-ns-hover/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="mt-1 no-scrollbar flex flex-col gap-1 overflow-y-auto px-3 pb-3">
        {filteredPlaylist.map((track) => {
          const originalIndex = playlist.findIndex((t) => t.url === track.url)
          const isActive = originalIndex === currentTrackIndex

          const handleTrackClick = () => {
            if (isActive) {
              setIsPlaying(!isPlaying)
              if (track.type === 'youtube' && !isPlaying) {
                setYoutubePlayerMode('modal')
              }
            } else {
              playTrack(originalIndex)
              if (track.type === 'youtube') {
                setYoutubePlayerMode('modal')
              }
            }
          }

          return (
            <button
              key={`${track.title}-${originalIndex}`}
              onClick={handleTrackClick}
              type="button"
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-all ${
                isActive
                  ? 'border-ns-primary/50 bg-ns-primary/15 shadow-md'
                  : 'border-transparent hover:bg-ns-hover/40'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-ns-border-soft bg-ns-bg/60">
                {track.cover ? (
                  <img
                    src={track.cover}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-ns-primary/30 to-purple-600/30 text-ns-primary-lt">
                    {track.type === 'youtube' ? (
                      <Youtube size={14} />
                    ) : (
                      <Music size={14} />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                  {isActive && isPlaying ? (
                    <Pause size={12} className="fill-white text-white" />
                  ) : (
                    <Play size={12} className="ml-0.5 fill-white text-white" />
                  )}
                </div>
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1 text-left">
                <p
                  className={`truncate text-xs leading-tight font-bold ${
                    isActive ? 'text-ns-primary-lt' : 'text-ns-text'
                  }`}
                >
                  {track.title}
                </p>
                <p className="mt-0.5 truncate text-[0.625rem] text-ns-muted">
                  {track.artist}
                </p>
              </div>

              {/* Playing Equalizer Animation */}
              {isActive && isPlaying && (
                <div className="flex h-3 shrink-0 items-end gap-[2px]">
                  {[0.15, 0.3, 0.2].map((d, i) => (
                    <span
                      key={i}
                      className="w-[2px] animate-pulse rounded-full bg-ns-primary-lt"
                      style={{ animationDelay: `${d}s`, height: '12px' }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}

        {filteredPlaylist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs font-bold text-ns-muted">No tracks found</p>
            <p className="mt-1 text-[0.65rem] text-ns-ghost">
              Try choosing a different category
            </p>
          </div>
        )}
      </div>

      {/* Currently Playing Bottom Bar */}
      {currentTrack && (
        <div className="flex items-center justify-between border-t border-ns-border-soft bg-ns-bg/60 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Volume2 className="size-3.5 shrink-0 animate-pulse text-ns-primary-lt" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-ns-primary-lt">
                {currentTrack.title}
              </p>
              <p className="truncate text-[0.6rem] text-ns-ghost">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
