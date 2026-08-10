 
import { useMusicStore } from '@/features/music-player/useMusicStore'
import {
  X,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Youtube,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

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

export default function YoutubePlayer() {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    isMuted,
    setIsPlaying,
    setIsMuted,
    youtubePlayerMode,
    setYoutubePlayerMode,
    setCurrentTime,
    seekTo,
    clearSeek,
    nextTrack,
  } = useMusicStore()

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const currentTrack = playlist[currentTrackIndex]

  const isPip = youtubePlayerMode === 'pip'
  const videoId = currentTrack ? getYoutubeId(currentTrack.url) : ''

  // Sync seekTo requests with the YouTube iframe postMessage
  useEffect(() => {
    if (seekTo !== null && iframeRef.current?.contentWindow) {
      setCurrentTime(seekTo)
      const command = {
        event: 'command',
        func: 'seekTo',
        args: [seekTo, true],
      }
      iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*')
      clearSeek()
    }
  }, [seekTo, clearSeek, setCurrentTime])

  // Sync Play/Pause state to YouTube iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const command = {
        event: 'command',
        func: isPlaying ? 'playVideo' : 'pauseVideo',
        args: [],
      }
      iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*')
    }
  }, [isPlaying])

  // Sync Mute state to YouTube iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const command = {
        event: 'command',
        func: isMuted ? 'mute' : 'unMute',
        args: [],
      }
      iframeRef.current.contentWindow.postMessage(JSON.stringify(command), '*')
    }
  }, [isMuted])

  // Simulate progress tracking (YouTube iframe API doesn't notify progress events out-of-box without heavy SDKs)
  useEffect(() => {
    let interval: any
    const isYoutubeTrack = currentTrack?.type === 'youtube'
    if (isPlaying && isYoutubeTrack) {
      interval = setInterval(() => {
        const state = useMusicStore.getState()
        const newTime = state.currentTime + 1
        if (newTime >= state.duration) {
          clearInterval(interval)
          if (state.repeatMode === 'one') {
            setCurrentTime(0)
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                JSON.stringify({
                  event: 'command',
                  func: 'seekTo',
                  args: [0, true],
                }),
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
  }, [isPlaying, currentTrack, nextTrack, setCurrentTime, setIsPlaying])

  const handleClose = () => {
    setIsPlaying(false)
    setYoutubePlayerMode('closed')
  }

  // If no track or not a youtube track, or player is closed, do not render
  if (
    youtubePlayerMode === 'closed' ||
    !currentTrack ||
    currentTrack.type !== 'youtube'
  ) {
    return null
  }
  return (
    <>
      {!isPip && (
        <div
          className="fixed inset-0 z-[100] animate-in bg-black/85 backdrop-blur-md transition-opacity duration-300 fade-in"
          onClick={() => setYoutubePlayerMode('pip')}
        />
      )}

      <div
        className={`fixed z-[101] flex flex-col overflow-hidden border border-ns-border bg-ns-panel shadow-2xl transition-all duration-300 ${
          isPip
            ? 'right-6 bottom-6 h-[180px] w-[320px] animate-in rounded-2xl slide-in-from-bottom-5'
            : 'top-1/2 left-1/2 w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 animate-in rounded-2xl duration-200 zoom-in-95'
        }`}
      >
        {/* Header Overlay (Always visible in Modal, visible on hover in PIP) */}
        <div
          className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-3 text-white transition-opacity duration-200 ${isPip ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Youtube
              size={16}
              className="flex-shrink-0 animate-pulse text-red-500"
            />
            <div className="min-w-0">
              <p className="truncate text-xs leading-tight font-bold drop-shadow-md">
                {currentTrack.title}
              </p>
              <p className="truncate text-[0.62rem] font-medium text-white/70 drop-shadow-md">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1.5">
            {isPip ? (
              <button
                onClick={() => setYoutubePlayerMode('modal')}
                className="cursor-pointer rounded-full bg-black/40 p-1.5 transition-colors hover:bg-black/60"
                title="Expand to modal"
              >
                <Maximize2 size={12} />
              </button>
            ) : (
              <button
                onClick={() => setYoutubePlayerMode('pip')}
                className="cursor-pointer rounded-full bg-black/40 p-1.5 transition-colors hover:bg-black/60"
                title="Minimize to PIP"
              >
                <Minimize2 size={12} />
              </button>
            )}
            <button
              onClick={handleClose}
              className="cursor-pointer rounded-full bg-black/40 p-1.5 transition-colors hover:bg-red-500/80"
              title="Close player"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Video Wrapper */}
        <div
          className={`relative flex-1 bg-black ${isPip ? 'h-full w-full' : 'aspect-video w-full'}`}
        >
          <iframe
            ref={iframeRef}
            className="pointer-events-auto absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            title="YouTube Video Player"
            allow="autoplay; encrypted-media; picture-in-picture"
          />

          {/* Hover Control Overlay in PIP Mode */}
          {isPip && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPlaying(!isPlaying)
                }}
                className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause size={16} fill="black" />
                ) : (
                  <Play size={16} fill="black" className="ml-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Control Bar (Modal mode only) */}
        {!isPip && (
          <div className="flex flex-col gap-3 border-t border-ns-border bg-ns-panel/95 p-4">
            {/* Audio visualization stream helper */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ns-primary text-white shadow-md transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause size={18} fill="white" />
                  ) : (
                    <Play size={18} fill="white" className="ml-0.5" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold text-ns-text">
                    YouTube Stream Active
                  </p>
                  <p className="text-[0.65rem] text-ns-faint">
                    Enjoy background audio while you focus.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="cursor-pointer rounded-lg p-2 text-ns-ghost transition-colors hover:bg-ns-hover hover:text-ns-text"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
