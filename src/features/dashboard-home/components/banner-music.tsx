import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'
import { Link } from '@tanstack/react-router'
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
} from 'lucide-react'
import { useEffect } from 'react'

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}
// function getYoutubeId(url: string) {
//   try {
//     const urlObj = new URL(url)
//     if (urlObj.hostname === 'youtu.be') {
//       return urlObj.pathname.substring(1)
//     }
//     return urlObj.searchParams.get('v') || ''
//   } catch {
//     if (url.includes('v=')) {
//       return url.split('v=')[1]?.split('&')[0] || ''
//     }
//     return url
//   }
// }
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
    // seekTo,
    selectedCategory,
    setSelectedCategory,
    setIsPlaying,
    setIsMuted,
    // setCurrentTime,
    // setDuration,
    triggerSeek,
    // clearSeek,
    nextTrack,
    prevTrack,
    playTrack,
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
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, setIsExpanded])

  const categories = [
    'All',
    ...Array.from(new Set(playlist.map((t) => t.category).filter(Boolean))),
  ]
  const filteredPlaylist =
    selectedCategory === 'All'
      ? playlist
      : playlist.filter((t) => t.category === selectedCategory)

  return (
    <>
      {/* Main Column Wrapper */}
      <div className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-ns-border bg-ns-panel p-3 shadow-lg">
        {/* ── BANNER PLAYER ── */}
        <div
          className="relative w-full flex-shrink-0 overflow-hidden rounded-xl border border-white/5"
          style={{ height: '180px' }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80')",
            }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Manage link badge */}
          <Link
            to="/dashboard/music"
            className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[0.55rem] font-bold text-white/70 uppercase no-underline backdrop-blur-sm transition-all hover:bg-black/50"
            title="Manage focus music playlist"
          >
            <Settings size={10} className="text-white/70" />
            <span>Manage</span>
          </Link>

          {/* Now Playing visualizer badge */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-0.5 backdrop-blur-sm">
            <span className="text-[0.55rem] font-bold tracking-widest text-white/70 uppercase">
              Now Playing
            </span>
            <div className="flex h-3 items-end gap-[1.5px]">
              {[0.1, 0.35, 0.2, 0.45, 0.15].map((delay, i) => (
                <span
                  key={i}
                  className={`w-[1.5px] rounded-full bg-violet-400 ${isPlaying ? 'animate-soundbar' : 'h-[3px]'}`}
                  style={{
                    animationDelay: `${delay}s`,
                    height: isPlaying ? undefined : '3px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Player controls overlay */}
          <div className="absolute right-0 bottom-0 left-0 px-4 pb-3">
            {/* Title / Artist details */}
            <div className="mb-2 flex items-end gap-2.5">
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded border border-white/10 bg-gradient-to-br from-violet-700 to-purple-900 shadow-md">
                {currentTrack?.cover ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${currentTrack.cover}')` }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm leading-none font-bold text-white drop-shadow">
                  {currentTrack?.title ?? 'No Track Selected'}
                </p>
                <p className="mt-1 text-[0.65rem] font-medium text-white/55">
                  {currentTrack?.artist ?? 'Select a track to play'}
                </p>
              </div>
            </div>

            {/* Play/Skip control row */}
            <div className="mb-2 flex items-center gap-3">
              <button
                onClick={prevTrack}
                type="button"
                className="cursor-pointer text-white/60 transition-all hover:scale-110 hover:text-white"
                title="Previous Track"
              >
                <SkipBack size={15} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white shadow transition-all hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={12} fill="black" className="text-black" />
                ) : (
                  <Play size={12} fill="black" className="ml-0.5 text-black" />
                )}
              </button>
              <button
                onClick={nextTrack}
                type="button"
                className="cursor-pointer text-white/60 transition-all hover:scale-110 hover:text-white"
                title="Next Track"
              >
                <SkipForward size={15} />
              </button>

              {/* Shuffle */}
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                type="button"
                className={`ml-1.5 cursor-pointer transition-all hover:scale-110 hover:text-white ${isShuffled ? 'font-bold text-violet-400' : 'text-white/40'}`}
                title="Shuffle playlist"
              >
                <Shuffle
                  size={13}
                  className={isShuffled ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}
                />
              </button>

              {/* Repeat */}
              <button
                onClick={() => {
                  const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
                  const nextMode =
                    modes[(modes.indexOf(repeatMode) + 1) % modes.length]
                  setRepeatMode(nextMode)
                }}
                type="button"
                className={`flex cursor-pointer items-center gap-0.5 transition-all hover:scale-110 hover:text-white ${repeatMode !== 'off' ? 'font-bold text-violet-400' : 'text-white/40'}`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat
                  size={13}
                  className={
                    repeatMode !== 'off' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                  }
                />
                {repeatMode === 'one' && (
                  <span className="rounded bg-violet-400 px-0.5 text-[0.4rem] leading-none font-extrabold text-black select-none">
                    1
                  </span>
                )}
              </button>

              {/* Maximize2 */}
              <button
                onClick={() => setIsExpanded(true)}
                type="button"
                className="cursor-pointer text-white/60 transition-all hover:scale-110 hover:text-white"
                title="Immersive Focus Player"
              >
                <Maximize2 size={13} />
              </button>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                type="button"
                className="ml-auto cursor-pointer text-white/60 transition-all hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Progress Bar slider */}
            <div className="flex items-center gap-2">
              <span className="text-[0.55rem] text-white/50 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="group relative flex-1">
                <div className="h-[2px] w-full rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_5px_rgba(139,92,246,0.8)]"
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
              <span className="text-[0.55rem] text-white/50 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* ── PLAYLIST SECTION ── */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-ns-border-soft pb-2">
            <span className="text-[0.65rem] font-bold tracking-wider text-ns-muted uppercase">
              Focus Playlist
            </span>
            <span className="rounded-full bg-ns-active/40 px-2 py-0.5 text-[0.6rem] font-bold text-ns-accent-lt">
              {filteredPlaylist.length} tracks
            </span>
          </div>

          {/* Group categories selector */}
          <div className="no-scrollbar flex flex-shrink-0 gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

          {/* List of Tracks */}
          <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
            {filteredPlaylist.map((track) => {
              const originalIndex = playlist.findIndex(
                (t) => t.url === track.url
              )
              const isActive = originalIndex === currentTrackIndex
              return (
                <div
                  key={`${track.title}-${originalIndex}`}
                  onClick={() => playTrack(originalIndex)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-all ${
                    isActive
                      ? 'border-ns-border-em bg-gradient-to-br from-ns-active/30 to-ns-hover/10 shadow-[0_0_12px_rgba(124,58,237,0.06)]'
                      : 'border-transparent hover:bg-ns-hover/40'
                  }`}
                >
                  {/* Thumbnail / Indicator */}
                  <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-ns-border bg-gradient-to-br from-ns-accent/20 to-ns-secondary/20 shadow-inner">
                    {track.cover && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${track.cover}')` }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                      <span className="text-[0.55rem] font-bold text-white">
                        {isYoutubeUrl(track.url) ? '▶' : '♫'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs leading-tight font-bold ${isActive ? 'text-ns-accent-lt' : 'text-ns-text'}`}
                    >
                      {track.title}
                    </p>
                    <p className="mt-0.5 truncate text-[0.62rem] font-semibold text-ns-faint">
                      {track.artist}
                    </p>
                  </div>

                  {/* Active visualizer bars */}
                  {isActive && isPlaying && (
                    <div className="flex h-3 items-end gap-[1.5px] pr-1.5">
                      {[0.15, 0.35, 0.2].map((delay, i) => (
                        <span
                          key={i}
                          className="animate-soundbar w-[1.5px] rounded-full bg-ns-accent-lt"
                          style={{
                            animationDelay: `${delay}s`,
                            height: '10px',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Immersive Full Screen overlay */}
      {isExpanded && (
        <div className="animate-fade-in fixed inset-0 z-[999] flex flex-col justify-between bg-neutral-950/95 p-8 text-white backdrop-blur-xl md:p-12">
          {/* Top Row: Close button */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
              <span className="text-xs font-bold tracking-widest text-white/50 uppercase">
                Immersive Focus Space
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/5 bg-white/10 text-white/70 transition-all hover:bg-white/25 hover:text-white"
              title="Minimize player"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Immersive Center Content */}
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 md:flex-row md:gap-20">
            {/* Left Column: Spinning Vinyl Record Disk */}
            <div className="relative flex flex-shrink-0 items-center justify-center">
              {/* Vinyl base plate */}
              <div className="absolute h-[240px] w-[240px] animate-pulse rounded-full border border-white/10 bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] md:h-[320px] md:w-[320px]" />

              {/* Vinyl Disk grooves */}
              <div
                className={`relative flex h-[220px] w-[220px] items-center justify-center rounded-full border-4 border-neutral-800 bg-black md:h-[300px] md:w-[300px] ${isPlaying ? 'animate-spin-slow' : ''}`}
                style={{
                  backgroundImage:
                    'repeating-radial-gradient(circle, #171717, #0a0a0a 2px, #171717 4px)',
                }}
              >
                {/* Center Album Art */}
                <div className="h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-neutral-900 bg-gradient-to-br from-violet-600 to-purple-800 md:h-[110px] md:w-[110px]">
                  {currentTrack?.cover && (
                    <img
                      src={currentTrack.cover}
                      alt="Vinyl Cover"
                      className="animate-spin-slow h-full w-full object-cover"
                    />
                  )}
                </div>
                {/* Vinyl center hole */}
                <div className="absolute h-3 w-3 rounded-full border border-white/15 bg-neutral-950" />
              </div>

              {/* Stylus needle arm overlay */}
              <div
                className={`absolute top-0 right-[-10px] h-32 w-24 origin-top-left transition-transform duration-700 md:right-[-20px] ${isPlaying ? 'rotate-[20deg]' : 'rotate-0'}`}
                aria-hidden="true"
              >
                {/* Needle body */}
                <div className="ml-10 h-20 w-1.5 rounded-full border border-neutral-500 bg-neutral-400 shadow" />
                <div className="-mt-2 ml-8 h-6 w-4 rounded border border-neutral-500 bg-neutral-600 shadow" />
                <div className="ml-6 h-1 w-6 rounded bg-neutral-500 shadow" />
              </div>
            </div>

            {/* Right Column: Track details & giant controls */}
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

              {/* Giant Visualizer bars */}
              <div className="flex h-10 items-end justify-center gap-1 md:justify-start">
                {Array.from({ length: 24 }).map((_, i) => {
                  const height = isPlaying
                    ? Math.floor(Math.random() * 32) + 8
                    : 4
                  return (
                    <span
                      key={i}
                      className="w-1 rounded-t bg-gradient-to-t from-violet-500 to-purple-400 transition-all duration-300"
                      style={{ height: `${height}px` }}
                    />
                  )
                })}
              </div>

              {/* Time progress slider */}
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

              {/* Immersive Controls */}
              <div className="flex items-center justify-center gap-6 md:justify-start">
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  type="button"
                  className={`cursor-pointer transition-all hover:scale-115 ${isShuffled ? 'text-violet-400' : 'text-white/40'}`}
                >
                  <Shuffle size={20} />
                </button>

                {/* Prev */}
                <button
                  onClick={prevTrack}
                  type="button"
                  className="cursor-pointer text-white/70 transition-all hover:scale-115 hover:text-white"
                >
                  <SkipBack size={24} />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  type="button"
                  className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg shadow-violet-500/25 transition-all hover:scale-110 active:scale-95"
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
                  className="cursor-pointer text-white/70 transition-all hover:scale-115 hover:text-white"
                >
                  <SkipForward size={24} />
                </button>

                {/* Repeat */}
                <button
                  onClick={() => {
                    const modes: ('off' | 'all' | 'one')[] = [
                      'off',
                      'all',
                      'one',
                    ]
                    const nextMode =
                      modes[(modes.indexOf(repeatMode) + 1) % modes.length]
                    setRepeatMode(nextMode)
                  }}
                  type="button"
                  className={`flex cursor-pointer items-center gap-0.5 transition-all hover:scale-115 ${repeatMode !== 'off' ? 'text-violet-400' : 'text-white/40'}`}
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

          {/* Bottom Row: Info */}
          <div className="flex w-full items-center justify-between border-t border-white/5 pt-4 text-xs text-white/30">
            <span>Press ESC or click Minimize to exit focus mode</span>
            <span>Space Station Node Player</span>
          </div>
        </div>
      )}
    </>
  )
}

export default BannerMusic
