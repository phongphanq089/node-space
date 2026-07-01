import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'
import {
  Minimize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'

interface ImmersivePlayerProps {
  onClose?: () => void
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function ImmersivePlayer({ onClose }: ImmersivePlayerProps) {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    setIsPlaying,
    triggerSeek,
    nextTrack,
    prevTrack,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
  } = useMusicStore()

  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-between bg-neutral-950/96 p-8 text-white backdrop-blur-xl md:p-12 animate-in fade-in zoom-in-95 duration-200">
      {/* Top row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
          <span className="text-xs font-bold tracking-widest text-white/50 uppercase">
            Immersive Focus Space
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/5 bg-white/10 text-white/70 transition-all hover:bg-white/25 hover:text-white"
            title="Minimize player"
          >
            <Minimize2 size={18} />
          </button>
        )}
      </div>

      {/* Main player UI */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 md:flex-row md:gap-20">
        {/* Spinning Vinyl Vinyl disc */}
        <div className="relative flex flex-shrink-0 items-center justify-center">
          <div className="absolute h-[240px] w-[240px] animate-pulse rounded-full border border-white/10 bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] md:h-[320px] md:w-[320px]" />
          <div
            className={`relative flex h-[220px] w-[220px] items-center justify-center rounded-full border-4 border-neutral-800 bg-black md:h-[300px] md:w-[300px] ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle, #171717, #0a0a0a 2px, #171717 4px)',
            }}
          >
            <div className="h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-neutral-900 bg-gradient-to-br from-violet-600 to-purple-800 md:h-[110px] md:w-[110px]">
              {currentTrack?.cover && (
                <img
                  src={currentTrack.cover}
                  alt="Vinyl Cover"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute h-3 w-3 rounded-full border border-white/15 bg-neutral-950" />
          </div>
          <div
            className={`absolute top-0 right-[-10px] h-32 w-24 origin-top-left transition-transform duration-700 md:right-[-20px] ${isPlaying ? 'rotate-[20deg]' : 'rotate-0'}`}
            aria-hidden="true"
          >
            <div className="ml-10 h-20 w-1.5 rounded-full border border-neutral-500 bg-neutral-400 shadow" />
            <div className="-mt-2 ml-8 h-6 w-4 rounded border border-neutral-500 bg-neutral-600 shadow" />
            <div className="ml-6 h-1 w-6 rounded bg-neutral-500 shadow" />
          </div>
        </div>

        {/* Track details & controls */}
        <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-6 text-center md:text-left">
          <div>
            <p className="mb-2 text-[0.65rem] font-bold tracking-widest text-violet-400 uppercase">
              Currently Playing
            </p>
            <h2 className="truncate text-2xl font-extrabold tracking-tight text-white drop-shadow-md md:text-4xl">
              {currentTrack?.title ?? 'No Track Selected'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/60 md:text-lg">
              {currentTrack?.artist ?? 'Select a track to play'}
            </p>
          </div>

          {/* Soundbar visualization */}
          <div className="flex h-10 items-end justify-center gap-1 md:justify-start">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-t bg-gradient-to-t from-violet-500 to-purple-400 transition-all duration-300"
                style={{
                  height: isPlaying
                    ? `${Math.floor(Math.random() * 32) + 8}px`
                    : '4px',
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-mono text-xs text-white/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="group relative flex w-full items-center">
              <div className="h-[4px] w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 180}
                value={currentTime}
                onChange={(e) => triggerSeek(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>

          {/* Player control buttons */}
          <div className="flex items-center justify-center gap-6 md:justify-start">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              type="button"
              className={`cursor-pointer transition-all hover:scale-110 ${isShuffled ? 'text-violet-400' : 'text-white/40'}`}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>

            {/* Prev */}
            <button
              onClick={prevTrack}
              type="button"
              className="cursor-pointer text-white/70 transition-all hover:scale-110 hover:text-white"
              title="Previous Track"
            >
              <SkipBack size={24} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              type="button"
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg shadow-violet-500/25 transition-all hover:scale-110 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} fill="black" className="text-black" />
              ) : (
                <Play size={24} fill="black" className="ml-1 text-black" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              type="button"
              className="cursor-pointer text-white/70 transition-all hover:scale-110 hover:text-white"
              title="Next Track"
            >
              <SkipForward size={24} />
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
              className={`flex cursor-pointer items-center gap-0.5 transition-all hover:scale-110 ${repeatMode !== 'off' ? 'text-violet-400' : 'text-white/40'}`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={20} />
              {repeatMode === 'one' && (
                <span className="rounded bg-violet-400 px-0.5 text-[0.5rem] leading-none font-extrabold text-black">
                  1
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex w-full items-center justify-between border-t border-white/5 pt-4 text-xs text-white/30">
        <span>
          {onClose ? 'Press ESC or click Minimize to exit focus space' : 'Immersive Focus Environment'}
        </span>
        <span>NodeSpace Player</span>
      </div>
    </div>
  )
}
