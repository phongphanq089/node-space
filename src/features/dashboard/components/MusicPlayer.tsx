import { PLAYLIST } from '../data/mock'

export default function MusicPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-ns-border bg-ns-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <span className="text-sm font-semibold text-ns-text-2">
          Chill &amp; Focus
        </span>
      </div>

      {/* Album art */}
      <div className="mx-4 mt-4 mb-3 flex aspect-video items-center justify-center rounded-xl border border-ns-border bg-gradient-to-br from-ns-surface to-ns-panel">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-ns-faint"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>

      {/* Track info */}
      <div className="mb-3 px-4 text-center">
        <p className="mb-0.5 text-sm font-bold text-ns-text">Midnight Coding</p>
        <p className="text-xs text-ns-muted-sm">Lo-fi Beats</p>
      </div>

      {/* Progress */}
      <div className="mb-3 flex items-center gap-2 px-4">
        <span className="text-[0.62rem] text-ns-faint">1:24</span>
        <div className="h-1 flex-1 rounded-full bg-ns-input">
          <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-ns-accent to-ns-accent-lt" />
        </div>
        <span className="text-[0.62rem] text-ns-faint">3:45</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 pb-4">
        {/* Shuffle */}
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        </button>
        {/* Prev */}
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>
        {/* Play/Pause */}
        <button
          id="btn-play-pause"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ns-accent shadow-[0_0_16px_var(--color-ns-accent)] transition-all hover:scale-105"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="var(--color-ns-on-accent)"
            stroke="none"
            aria-hidden
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </button>
        {/* Next */}
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
        {/* Repeat */}
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost transition-all hover:text-ns-accent-lt">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>

      {/* Playlist */}
      <div className="border-t border-ns-border-soft px-4 py-3">
        <p className="mb-2 text-[0.62rem] font-bold tracking-widest text-ns-faint uppercase">
          Playlist
        </p>
        {PLAYLIST.map((track) => (
          <button
            key={track.title}
            className={`flex w-full items-center gap-3 rounded-lg px-1 py-2 transition-all hover:bg-ns-hover ${track.active ? 'text-ns-accent-lt' : 'text-ns-muted'}`}
          >
            <span className="block h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-ns-active to-ns-hover" />
            <span className="block min-w-0 flex-1 text-left">
              <span className="block truncate text-xs font-semibold">
                {track.title}
              </span>
              <span className="block text-[0.62rem] text-ns-faint">
                {track.artist}
              </span>
            </span>
            {track.active && <span className="text-xs text-ns-accent">♪</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
