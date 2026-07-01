import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'
import { Link } from '@tanstack/react-router'
import {
  Maximize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Music2,
} from 'lucide-react'
import { useEffect } from 'react'
import ImmersivePlayer from '@/features/music-player/components/immersive-player'

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const BannerMusic = () => {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    setIsPlaying,
    setIsMuted,
    triggerSeek,
    nextTrack,
    prevTrack,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
    isExpanded,
    setIsExpanded,
  } = useMusicStore()

  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) setIsExpanded(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, setIsExpanded])

  return (
    <>
      {/* ── FULL-WIDTH BEAUTIFUL MUSIC BANNER ─────────────────── */}
      <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ns-panel shadow-2xl">
        {/* Dynamic background cover image - CLEAR, NO BLUR */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: currentTrack?.cover
              ? `url('${currentTrack.cover}')`
              : "url('/hero-banner.png')",
          }}
        />
        {/* Subtle gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

        {/* ── Floating Top strip: badges ── */}
        <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-black/45 px-2.5 py-1 text-[0.55rem] font-bold tracking-widest text-violet-300 uppercase backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-violet-400 ${isPlaying ? 'animate-ping opacity-75' : 'opacity-40'}`}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            {isPlaying ? 'Now Playing' : 'Paused'}
          </span>
          <Link
            to="/dashboard/music"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[0.55rem] font-bold text-white/50 uppercase no-underline backdrop-blur-md transition-all hover:border-violet-400/30 hover:text-white/80"
            title="Manage playlist"
          >
            <Settings size={10} />
            <span>Manage</span>
          </Link>
        </div>

        {/* ── Bottom music control panel ── */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 border-t border-white/10 bg-black/50 p-4 backdrop-blur-md">
          {/* Row 1: Cover thumbnail, track details & controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Track Info (Left) */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-violet-800 to-indigo-900 shadow-md">
                {currentTrack?.cover ? (
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music2 size={16} className="text-white/30" />
                  </div>
                )}
                {currentTrack && (
                  <span className="absolute right-0 bottom-0 rounded-tl bg-black/85 px-1 py-0.5 text-[0.38rem] font-bold text-white/60 uppercase">
                    {isYoutubeUrl(currentTrack.url) ? 'YT' : 'MP3'}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm leading-tight font-extrabold text-white drop-shadow-sm">
                  {currentTrack?.title ?? 'No Track Selected'}
                </p>
                <p className="mt-0.5 truncate text-[0.68rem] font-medium text-white/50">
                  {currentTrack?.artist ?? 'Select music from sidebar'}
                </p>
              </div>
            </div>

            {/* Play Controls (Right) */}
            <div className="flex items-center gap-3">
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                type="button"
                className={`cursor-pointer transition-all hover:scale-110 ${isShuffled ? 'font-bold text-violet-400' : 'text-white/40 hover:text-white/70'}`}
                title="Shuffle"
              >
                <Shuffle
                  size={13}
                  className={isShuffled ? 'stroke-[2.5px]' : ''}
                />
              </button>

              {/* Prev */}
              <button
                onClick={prevTrack}
                type="button"
                className="cursor-pointer text-white/60 transition-all hover:scale-110 hover:text-white"
                title="Previous"
              >
                <SkipBack size={15} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={13} fill="black" className="text-black" />
                ) : (
                  <Play size={13} fill="black" className="ml-0.5 text-black" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                type="button"
                className="cursor-pointer text-white/60 transition-all hover:scale-110 hover:text-white"
                title="Next"
              >
                <SkipForward size={15} />
              </button>

              {/* Repeat */}
              <button
                onClick={() => {
                  const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
                  setRepeatMode(
                    modes[(modes.indexOf(repeatMode) + 1) % modes.length]
                  )
                }}
                type="button"
                className={`flex cursor-pointer items-center gap-0.5 transition-all hover:scale-110 ${repeatMode !== 'off' ? 'font-bold text-violet-400' : 'text-white/40 hover:text-white/70'}`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat
                  size={13}
                  className={repeatMode !== 'off' ? 'stroke-[2.5px]' : ''}
                />
                {repeatMode === 'one' && (
                  <span className="rounded bg-violet-400 px-0.5 text-[0.4rem] leading-none font-extrabold text-black">
                    1
                  </span>
                )}
              </button>

              <div className="mx-1 h-4 w-px bg-white/10" />

              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                type="button"
                className="cursor-pointer text-white/40 transition-all hover:text-white/80"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {/* Expand/Maximize */}
              <button
                onClick={() => setIsExpanded(true)}
                type="button"
                className="cursor-pointer text-white/40 transition-all hover:text-white/80"
                title="Immersive player"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </div>

          {/* Row 2: Progress Slider */}
          <div className="flex items-center gap-2.5">
            <span className="w-8 text-right text-[0.55rem] text-white/40 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="group relative flex-1">
              <div className="h-[3px] w-full rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(139,92,246,0.9)]"
                style={{ left: `calc(${progressPercent}% - 5px)` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 180}
                value={currentTime}
                onChange={(e) => triggerSeek(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <span className="w-8 text-[0.55rem] text-white/40 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Immersive Fullscreen Player Overlay ── */}
      {isExpanded && (
        <ImmersivePlayer onClose={() => setIsExpanded(false)} />
      )}

    </>
  )
}

export default BannerMusic
