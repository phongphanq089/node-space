import { create } from 'zustand'

export interface TrackItem {
  title: string
  artist: string
  url: string
  cover?: string
  category?: string
}

interface MusicState {
  playlist: TrackItem[]
  currentTrackIndex: number
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  seekTo: number | null
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  setPlaylist: (list: TrackItem[]) => void
  setCurrentTrackIndex: (index: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsMuted: (muted: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  triggerSeek: (time: number) => void
  clearSeek: () => void
  playTrack: (index: number) => void
  nextTrack: () => void
  prevTrack: () => void
  addTrack: (track: TrackItem) => void
  removeTrack: (index: number) => void
  isShuffled: boolean
  setIsShuffled: (shuffled: boolean) => void
  repeatMode: 'off' | 'all' | 'one'
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

const DEMO_PLAYLIST: TrackItem[] = [
  {
    title: 'Lofi Cyberpunk Live Stream',
    artist: 'ChilledCow / Lofi Girl',
    url: 'https://www.youtube.com/watch?v=H3urFo3u-lo',
    cover:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=60',
    category: 'Lofi',
  },
  {
    title: 'Lofi Cafe Ambient',
    artist: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=a7Gr-Uey1W4',
    cover:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&auto=format&fit=crop&q=60',
    category: 'Lofi',
  },
  {
    title: 'SoundHelix Song 1 (MP3)',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
    category: 'Chill',
  },
  {
    title: 'SoundHelix Song 2 (MP3)',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover:
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=150&auto=format&fit=crop&q=60',
    category: 'Chill',
  },
  {
    title: 'SoundHelix Song 3 (MP3)',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=60',
    category: 'US-UK',
  },
  {
    title: 'SoundHelix Song 4 (MP3)',
    artist: 'SoundHelix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60',
    category: 'US-UK',
  },
]

export const useMusicStore = create<MusicState>((set, get) => ({
  playlist: DEMO_PLAYLIST,
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 180, // Default 3:00 minutes
  seekTo: null,
  selectedCategory: 'All',
  isShuffled: false,
  repeatMode: 'off',
  isExpanded: false,

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setIsShuffled: (isShuffled) => set({ isShuffled }),
  setRepeatMode: (repeatMode) => set({ repeatMode }),
  setIsExpanded: (isExpanded) => set({ isExpanded }),
  setPlaylist: (playlist) =>
    set({ playlist, currentTrackIndex: 0, currentTime: 0 }),
  setCurrentTrackIndex: (currentTrackIndex) =>
    set({ currentTrackIndex, currentTime: 0 }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  triggerSeek: (seekTo) => set({ seekTo }),
  clearSeek: () => set({ seekTo: null }),

  playTrack: (index) => {
    set({ currentTrackIndex: index, isPlaying: true, currentTime: 0 })
  },

  nextTrack: () => {
    const { playlist, currentTrackIndex, isShuffled } = get()
    if (playlist.length === 0) return
    let nextIndex = currentTrackIndex
    if (isShuffled && playlist.length > 1) {
      while (nextIndex === currentTrackIndex) {
        nextIndex = Math.floor(Math.random() * playlist.length)
      }
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length
    }
    set({ currentTrackIndex: nextIndex, isPlaying: true, currentTime: 0 })
  },

  prevTrack: () => {
    const { playlist, currentTrackIndex, isShuffled } = get()
    if (playlist.length === 0) return
    let prevIndex = currentTrackIndex
    if (isShuffled && playlist.length > 1) {
      while (prevIndex === currentTrackIndex) {
        prevIndex = Math.floor(Math.random() * playlist.length)
      }
    } else {
      prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
    }
    set({ currentTrackIndex: prevIndex, isPlaying: true, currentTime: 0 })
  },

  addTrack: (track) => {
    set((state) => {
      const newPlaylist = [...state.playlist, track]
      return {
        playlist: newPlaylist,
        currentTrackIndex: newPlaylist.length - 1,
        isPlaying: true,
        currentTime: 0,
      }
    })
  },

  removeTrack: (index) => {
    set((state) => {
      const newPlaylist = state.playlist.filter((_, i) => i !== index)
      let nextActiveIndex = state.currentTrackIndex
      if (nextActiveIndex >= newPlaylist.length) {
        nextActiveIndex = Math.max(0, newPlaylist.length - 1)
      }
      return {
        playlist: newPlaylist,
        currentTrackIndex: nextActiveIndex,
        currentTime: 0,
        isPlaying: newPlaylist.length > 0 ? state.isPlaying : false,
      }
    })
  },
}))
