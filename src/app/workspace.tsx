import { SidebarProvider, TooltipProvider } from '@/shared/ui'
import { YoutubePlayer, useMusicStore } from '@/features/music-player'
import type { TrackItem } from '@/features/music-player'
import { WorkSpaceSidebar } from '@/widgets/workspace-sidebar'
import { GlobalMusicDrawer } from '@/widgets/global-music-drawer'
import { AppearanceDrawer } from '@/widgets/appearance-drawer'

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
      <TooltipProvider>
        <div className="flex w-full bg-ns-bg text-ns-text-2">
          <WorkSpaceSidebar />

          <MainContentWorkspace />

          {/* YouTube Stream Modal & PIP Player */}
          <YoutubePlayer />

          {/* Native Video player */}
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
                  ? 'top-[40%] left-1/2 z-ns-supreme aspect-video w-[85vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black shadow-2xl'
                  : 'right-6 bottom-24 z-ns-float aspect-video w-[240px] rounded-xl border border-ns-border bg-black shadow-2xl hover:scale-105'
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

          {/* Global Standalone Music & Focus Drawer Widget */}
          <GlobalMusicDrawer />

          {/* Global Appearance & Theme Settings Drawer */}
          <AppearanceDrawer />
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}

export default Workspace
