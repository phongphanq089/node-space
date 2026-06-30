import { Link } from '@tanstack/react-router'

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
} from 'lucide-react'
import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}


function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function MusicPlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    playTrack,
    nextTrack,
    prevTrack,
    setIsPlaying,
    setIsMuted,
    triggerSeek,
    selectedCategory,
    setSelectedCategory,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
    setIsExpanded,
  } = useMusicStore()

  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined

  const categories = [
    'All',
    ...Array.from(new Set(playlist.map((t) => t.category).filter((c): c is string => !!c))),
  ]
  const filteredPlaylist =
    selectedCategory === 'All'
      ? playlist
      : playlist.filter((t) => t.category === selectedCategory)

  return (
    <div className="flex flex-col gap-6">
      {/* CARD 1: Chill & Focus */}
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

        {/* Group categories selector */}
        <div className="mx-4 mt-3 no-scrollbar flex flex-shrink-0 gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
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

        {/* Playlist */}
        <div className="mt-2 no-scrollbar flex max-h-[160px] flex-col gap-0.5 overflow-y-auto px-2">
          {filteredPlaylist.map((track) => {
            const originalIndex = playlist.findIndex((t) => t.url === track.url)
            const isActive = originalIndex === currentTrackIndex
            return (
              <button
                key={`${track.title}-${originalIndex}`}
                onClick={() => playTrack(originalIndex)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 transition-all ${
                  isActive
                    ? 'bg-ns-active/40 text-ns-accent-lt'
                    : 'text-ns-muted hover:bg-ns-hover/50'
                }`}
              >
                <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ns-border bg-gradient-to-br from-ns-accent/30 to-ns-secondary/30">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{
                      backgroundImage: `url('${track.cover || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=80&auto=format&fit=crop&q=60'}')`,
                    }}
                  />
                  <span className="relative text-[0.55rem] font-bold text-white">
                    {isYoutubeUrl(track.url) ? '▶' : '♫'}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span
                    className={`block truncate text-xs font-bold ${isActive ? 'text-ns-accent-lt' : 'text-ns-text'}`}
                  >
                    {track.title}
                  </span>
                  <span className="block text-[0.62rem] font-medium text-ns-faint">
                    {track.artist}
                  </span>
                </div>

                {/* Active visualizer bars */}
                {isActive && isPlaying && (
                  <div className="mr-1.5 flex h-3 flex-shrink-0 items-end gap-0.5">
                    <span
                      className="animate-soundbar h-2 w-0.5 bg-ns-accent-lt"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <span
                      className="animate-soundbar h-3.5 w-0.5 bg-ns-accent-lt"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <span
                      className="animate-soundbar h-2.5 w-0.5 bg-ns-accent-lt"
                      style={{ animationDelay: '0.5s' }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Cozy Room Static Preview Box with soundbar overlay */}
        <div
          className="relative mx-4 mt-3 aspect-video overflow-hidden rounded-xl border border-ns-border bg-cover bg-center shadow-md"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60')",
          }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.2px]" />
          <div className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
            {currentTrack
              ? isYoutubeUrl(currentTrack.url)
                ? 'YouTube Stream'
                : 'MP3 Audio Stream'
              : 'Live Stream'}
          </div>
          {currentTrack && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px]">
              <div className="flex h-6 items-end gap-1.5">
                <span
                  className="animate-soundbar h-4 w-1.5 bg-ns-accent-lt"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="animate-soundbar h-6 w-1.5 bg-ns-accent-lt"
                  style={{ animationDelay: '0.4s' }}
                />
                <span
                  className="animate-soundbar h-5 w-1.5 bg-ns-accent-lt"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="animate-soundbar h-3 w-1.5 bg-ns-accent-lt"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive Progress Slider */}
        <div className="mt-3 flex items-center gap-2 px-4">
          <span className="text-[0.55rem] text-ns-faint">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 180}
            value={currentTime}
            onChange={(e) => triggerSeek(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-ns-input accent-ns-accent outline-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <span className="text-[0.55rem] text-ns-faint">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-4 pt-2 pb-4 text-ns-ghost">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="cursor-pointer transition-colors hover:text-ns-accent-lt"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="flex items-center gap-3">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`cursor-pointer transition-colors hover:text-ns-accent-lt flex items-center ${isShuffled ? 'text-ns-accent-lt' : ''}`}
              title="Shuffle playlist"
            >
              <Shuffle size={13} className={isShuffled ? 'stroke-[2px]' : 'stroke-[1.5px]'} />
            </button>

            <button
              onClick={prevTrack}
              className="cursor-pointer transition-colors hover:text-ns-accent-lt"
              title="Previous Track"
            >
              <SkipBack size={13} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-ns-accent text-white shadow-[0_0_8px_var(--color-ns-accent)] transition-all hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={10} fill="white" />
              ) : (
                <Play size={10} fill="white" className="ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="cursor-pointer transition-colors hover:text-ns-accent-lt"
              title="Next Track"
            >
              <SkipForward size={13} />
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
                const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length]
                setRepeatMode(nextMode)
              }}
              className={`cursor-pointer transition-colors hover:text-ns-accent-lt flex items-center gap-0.5 ${repeatMode !== 'off' ? 'text-ns-accent-lt' : ''}`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={13} className={repeatMode !== 'off' ? 'stroke-[2px]' : 'stroke-[1.5px]'} />
              {repeatMode === 'one' && <span className="text-[0.4rem] font-extrabold bg-ns-accent-lt text-black px-0.5 rounded leading-none">1</span>}
            </button>
          </div>

          {/* Maximize / Expand button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="cursor-pointer transition-colors hover:text-ns-accent-lt"
            title="Maximize Player"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
