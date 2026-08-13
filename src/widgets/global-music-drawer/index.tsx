import { useState } from 'react'
import { Music, X, Disc, ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui'
import { MusicPlayer, useMusicStore } from '@/features/music-player'

export function GlobalMusicDrawer() {
  const [open, setOpen] = useState(false)
  const { isPlaying } = useMusicStore()

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/* Floating Action Button Trigger */}
      <DrawerTrigger asChild>
        <button
          type="button"
          className="group fixed right-6 bottom-6 z-ns-float flex h-13 w-13 cursor-pointer items-center justify-center rounded-2xl border border-ns-primary/40 bg-gradient-to-br from-ns-primary via-purple-600 to-ns-secondary text-white shadow-[0_8px_32px_rgba(124,58,237,0.5)] backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95"
          title="Open Music & Focus Studio"
        >
          {isPlaying && (
            <span className="absolute -inset-1 animate-ping rounded-2xl bg-ns-primary opacity-30 transition-transform duration-1000 group-hover:scale-110" />
          )}

          <div className="relative flex items-center justify-center">
            {isPlaying ? (
              <Disc
                className="size-6 animate-spin text-white"
                style={{ animationDuration: '4s' }}
              />
            ) : (
              <Music className="size-6 text-white transition-transform group-hover:scale-110" />
            )}
          </div>

          {/* Playing Dot Badge */}
          {isPlaying && (
            <span className="absolute top-1.5 right-1.5 flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
            </span>
          )}
        </button>
      </DrawerTrigger>

      {/* Drawer Slide-Over Panel */}
      <DrawerContent className="fixed top-0 right-0 z-ns-modal flex h-full w-full flex-col border-l border-ns-border-md bg-ns-surface/98 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-w-md">
        {/* Header Bar */}
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-ns-border-soft/80 px-6 py-4">
          <div className="flex items-center gap-3 text-left">
            <div className="flex size-9 items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/15 text-ns-primary-lt">
              <Music className="size-4" />
            </div>
            <div>
              <DrawerTitle className="text-sm font-bold tracking-wide text-white">
                Music &amp; Focus Studio
              </DrawerTitle>
              <DrawerDescription className="text-[0.68rem] text-ns-muted">
                Background soundscapes &amp; lofi playlists
              </DrawerDescription>
            </div>
          </div>

          <DrawerClose asChild>
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-ns-border-soft bg-ns-bg/50 text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
              title="Close panel"
            >
              <X className="size-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Drawer Body - Music Player */}
        <div className="no-scrollbar flex-1 overflow-y-auto p-5">
          <MusicPlayer />
        </div>

        {/* Drawer Footer Status Bar */}
        <div className="flex items-center justify-between border-t border-ns-border-soft/80 bg-ns-panel/90 px-6 py-3 text-[0.68rem] text-ns-muted backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="size-1.5 animate-ping rounded-full bg-emerald-400" />
              Audio Engine Active
            </span>
          </div>

          <Link
            to="/workspace/music"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 font-semibold text-ns-primary-lt no-underline transition-colors hover:text-white"
          >
            <span>Full Studio</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
