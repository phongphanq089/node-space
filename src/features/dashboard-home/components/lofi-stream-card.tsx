import { useMusicStore } from '@/features/music-player/useMusicStore'
import type { TrackItem } from '@/features/music-player/useMusicStore'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react'

export function LofiStreamCard() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    setIsPlaying,
    setIsMuted,
    nextTrack,
    prevTrack,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
    youtubePlayerMode,
    setYoutubePlayerMode,
  } = useMusicStore()

  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 35

  const coverUrl =
    currentTrack?.cover ||
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ns-border/40 bg-ns-panel shadow-xl">
      {/* Video/Stream Preview Box */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={coverUrl}
          alt={currentTrack?.title ?? 'Lo-fi Cyberpunk Live Stream'}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

        {/* Live Badge Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-black/60 px-2.5 py-0.5 text-[0.6rem] font-black tracking-wider text-emerald-400 uppercase backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>LIVE</span>
        </div>

        {/* Track info overlay */}
        <div className="absolute right-3 bottom-3 left-3 flex min-w-0 flex-col">
          <h3 className="truncate text-xs font-extrabold text-white drop-shadow-md sm:text-sm">
            {currentTrack?.title ?? 'Lo-fi Cyberpunk Live Stream'}
          </h3>
          <p className="truncate text-[0.65rem] font-semibold text-ns-faint">
            {currentTrack?.artist ?? 'ChilledCow / Lofi Girl'}
          </p>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col gap-2.5 bg-ns-surface/80 p-3.5 backdrop-blur-md">
        {/* Playback Progress Line */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            type="button"
            className={`cursor-pointer transition-all hover:scale-110 ${
              isShuffled
                ? 'font-bold text-emerald-400'
                : 'text-ns-ghost hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle size={13} />
          </button>

          <button
            onClick={prevTrack}
            type="button"
            className="cursor-pointer text-ns-ghost transition-all hover:scale-110 hover:text-white"
            title="Previous"
          >
            <SkipBack size={15} />
          </button>

          {/* Play/Pause Central Button */}
          <button
            onClick={() => {
              if (
                !isPlaying &&
                currentTrack?.url.includes('youtube.com') &&
                youtubePlayerMode === 'closed'
              ) {
                setYoutubePlayerMode('modal')
              }
              setIsPlaying(!isPlaying)
            }}
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={14} fill="black" />
            ) : (
              <Play size={14} fill="black" className="ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            type="button"
            className="cursor-pointer text-ns-ghost transition-all hover:scale-110 hover:text-white"
            title="Next"
          >
            <SkipForward size={15} />
          </button>

          <button
            onClick={() => {
              const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
              setRepeatMode(
                modes[(modes.indexOf(repeatMode) + 1) % modes.length]
              )
            }}
            type="button"
            className={`cursor-pointer transition-all hover:scale-110 ${
              repeatMode !== 'off'
                ? 'font-bold text-emerald-400'
                : 'text-ns-ghost hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat size={13} />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            type="button"
            className="cursor-pointer text-ns-ghost transition-all hover:text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
