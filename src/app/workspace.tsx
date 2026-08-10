import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/core/drawer'
import { SidebarProvider } from '@/shared/ui/core/sidebar'
import MusicPlayer from '@/features/music-player/components/music-player'
import YoutubePlayer from '@/features/music-player/components/youtube-player'
import { useMusicStore } from '@/features/music-player/useMusicStore'
import type { TrackItem } from '@/features/music-player/useMusicStore'
import WorkSpaceSidebar from '@/widgets/workspace-sidebar'

import { useEffect, useRef } from 'react'
import MainContentWorkspace from './layouts/main-content-workspace'

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function isVideoUrl(url: string) {
  return (
    url.toLowerCase().endsWith('.mp4') ||
    url.toLowerCase().includes('/video/') ||
    url.toLowerCase().includes('.webm')
  )
}

const Workspace = () => {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    seekTo,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    clearSeek,
    nextTrack,
    isExpanded,
  } = useMusicStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined
  const isYoutube = currentTrack ? isYoutubeUrl(currentTrack.url) : false
  const isVideo = currentTrack ? isVideoUrl(currentTrack.url) : false

  // Control native HTML5 audio/video playback (play/pause)
  useEffect(() => {
    const mediaEl = isVideo ? videoRef.current : audioRef.current
    if (mediaEl && !isYoutube) {
      if (isPlaying) {
        mediaEl.play().catch((err) => {
          console.warn('Playback was prevented:', err)
        })
      } else {
        mediaEl.pause()
      }
    }
  }, [isPlaying, isVideo, isYoutube, currentTrack])

  // Sync seekTo requests with the native audio/video ref
  useEffect(() => {
    if (seekTo !== null) {
      if (isVideo && videoRef.current) {
        videoRef.current.currentTime = seekTo
      } else if (audioRef.current && !isYoutube) {
        audioRef.current.currentTime = seekTo
      }
      clearSeek()
    }
  }, [seekTo, isVideo, isYoutube, clearSeek])

  const handleTrackEnded = () => {
    const state = useMusicStore.getState()
    if (state.repeatMode === 'one') {
      const mediaEl = isVideo ? videoRef.current : audioRef.current
      if (mediaEl) {
        mediaEl.currentTime = 0
        mediaEl.play().catch((err) => console.warn(err))
      }
    } else if (state.repeatMode === 'all') {
      nextTrack()
    } else {
      if (state.currentTrackIndex < state.playlist.length - 1) {
        nextTrack()
      } else {
        setIsPlaying(false)
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="flex w-full bg-ns-bg text-ns-text-2">
        <WorkSpaceSidebar />

        <MainContentWorkspace />

        {/* YouTube Stream Modal & PIP Player */}
        <YoutubePlayer />

        {/* Native Video player (Visible in center if expanded, floating bottom-left if in dashboard view) */}
        {currentTrack && !isYoutube && isVideo && (
          <video
            ref={videoRef}
            src={currentTrack.url}
            muted={isMuted}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={handleTrackEnded}
            className={`pointer-events-auto fixed object-cover transition-all duration-300 ${
              isExpanded
                ? 'top-[40%] left-1/2 z-[1000] aspect-video w-[85vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black shadow-2xl'
                : 'right-6 bottom-24 z-[45] aspect-video w-[240px] rounded-xl border border-ns-border bg-black shadow-2xl hover:scale-105'
            }`}
          />
        )}

        {/* Native Audio player */}
        {currentTrack && !isYoutube && !isVideo && (
          <audio
            ref={audioRef}
            src={currentTrack.url}
            muted={isMuted}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={handleTrackEnded}
          />
        )}

        <Drawer direction="right">
          <DrawerTrigger asChild>
            <button
              className="group fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-ns-primary to-ns-secondary text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all hover:scale-110 active:scale-95"
              title="Open Lofi Player"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-ns-primary opacity-20 transition-transform duration-1000 group-hover:scale-110" />
              <div className="relative flex items-center justify-center">
                <svg
                  className="h-6 w-6 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
            </button>
          </DrawerTrigger>
          <DrawerContent className="flex h-full flex-col border-l border-ns-border bg-ns-bg text-ns-text">
            <DrawerHeader className="flex flex-row items-center justify-between border-b border-ns-border-soft px-6 py-4">
              <div className="text-left">
                <DrawerTitle className="text-sm font-bold tracking-wider text-ns-text uppercase">
                  Music &amp; Focus
                </DrawerTitle>
                <DrawerDescription className="text-[0.68rem] font-medium text-ns-faint">
                  Configure your soundscape and custom playlist
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <button className="cursor-pointer text-xs font-bold text-ns-ghost hover:text-ns-primary-lt">
                  Close
                </button>
              </DrawerClose>
            </DrawerHeader>

            <div className="no-scrollbar flex-1 overflow-y-auto p-6">
              <MusicPlayer />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </SidebarProvider>
  )
}

export default Workspace
