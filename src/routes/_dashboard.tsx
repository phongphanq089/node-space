import { SidebarProvider } from '@/components/ui/core/sidebar'

import { createFileRoute } from '@tanstack/react-router'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/core/drawer'
import MusicPlayer from '@/features/music-player/components/music-player'
import DashboardSidebar from '@/components/dashboard-sidebar/dashboard-sidebar'
import Content from '@/components/dashboard-sidebar/content'
import { useEffect, useRef } from 'react'
import { useMusicStore } from '@/stores/useMusicStore'
import type { TrackItem } from '@/stores/useMusicStore'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYoutubeId(url: string) {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1)
    }
    return urlObj.searchParams.get('v') || ''
  } catch {
    if (url.includes('v=')) {
      return url.split('v=')[1]?.split('&')[0] || ''
    }
    return url
  }
}

function DashboardLayout() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    seekTo,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    clearSeek,
    nextTrack,
  } = useMusicStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const currentTrack = playlist[currentTrackIndex] as TrackItem | undefined
  const isYoutube = currentTrack ? isYoutubeUrl(currentTrack.url) : false

  // Control native HTML5 audio playback (play/pause)
  useEffect(() => {
    if (audioRef.current && !isYoutube) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Audio playback was prevented:', err)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isYoutube, currentTrack])

  // Sync seekTo requests with the native audio ref or YouTube iframe postMessage
  useEffect(() => {
    if (seekTo !== null) {
      if (audioRef.current && !isYoutube) {
        audioRef.current.currentTime = seekTo
      } else if (isYoutube) {
        setCurrentTime(seekTo)
        // Seek YouTube player via postMessage
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const command = {
            event: 'command',
            func: 'seekTo',
            args: [seekTo, true],
          }
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify(command),
            '*'
          )
        }
      }
      clearSeek()
    }
  }, [seekTo, isYoutube, clearSeek, setCurrentTime])

  // Sync Play/Pause state to YouTube iframe
  useEffect(() => {
    if (isYoutube && iframeRef.current && iframeRef.current.contentWindow) {
      const command = {
        event: 'command',
        func: isPlaying ? 'playVideo' : 'pauseVideo',
        args: [],
      }
      iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*')
    }
  }, [isPlaying, isYoutube])

  // Sync Mute state to YouTube iframe
  useEffect(() => {
    if (isYoutube && iframeRef.current && iframeRef.current.contentWindow) {
      const command = {
        event: 'command',
        func: isMuted ? 'mute' : 'unMute',
        args: [],
      }
      iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*')
    }
  }, [isMuted, isYoutube])

  // Simulated YouTube progress timer using Zustand direct state edits (to avoid re-renders resetting intervals)
  useEffect(() => {
    let interval: any
    if (isYoutube && isPlaying) {
      interval = setInterval(() => {
        const state = useMusicStore.getState()
        const newTime = state.currentTime + 1
        if (newTime >= state.duration) {
          clearInterval(interval)
          if (state.repeatMode === 'one') {
            setCurrentTime(0)
            if (iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                '*'
              )
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
        } else {
          setCurrentTime(newTime)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isYoutube, isPlaying, nextTrack, setCurrentTime, setIsPlaying])

  const handleTrackEnded = () => {
    const state = useMusicStore.getState()
    if (state.repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((err) => console.warn(err))
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
        <DashboardSidebar />
        <Content />

        {currentTrack && isYoutube && (
          <iframe
            ref={iframeRef}
            className="pointer-events-none absolute -left-[9999px] h-[1px] w-[1px] opacity-0"
            src={`https://www.youtube.com/embed/${getYoutubeId(currentTrack.url)}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            title="Background YouTube Player"
            allow="autoplay"
          />
        )}
        {currentTrack && !isYoutube && (
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
              className="group fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-ns-accent to-ns-secondary text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all hover:scale-110 active:scale-95"
              title="Open Lofi Player"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-ns-accent opacity-20 transition-transform duration-1000 group-hover:scale-110" />
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
                <button className="cursor-pointer text-xs font-bold text-ns-ghost hover:text-ns-accent-lt">
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
