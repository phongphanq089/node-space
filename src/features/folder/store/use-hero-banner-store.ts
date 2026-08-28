import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BannerPreset {
  id: string
  name: string
  url: string
  thumbnailUrl: string
  type: 'image' | 'gif'
}

export const BANNER_PRESETS: BannerPreset[] = [
  {
    id: 'default',
    name: 'Obsidian Nebula (Default)',
    url: '/hero-banner.png',
    thumbnailUrl: '/hero-banner.png',
    type: 'image',
  },
  {
    id: 'cyber-grid',
    name: 'Cyberpunk Grid',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=60',
    type: 'image',
  },
  {
    id: 'abstract-gradient',
    name: 'Violet Flow',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=60',
    type: 'image',
  },
  {
    id: 'deep-space',
    name: 'Deep Cosmos',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=60',
    type: 'image',
  },
  {
    id: 'neon-city',
    name: 'Tokyo Cyber Night',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=60',
    type: 'image',
  },
]

interface HeroBannerState {
  bannerUrl: string
  selectedPresetId: string | null
  setBannerUrl: (url: string, presetId?: string | null) => void
  resetBannerUrl: () => void
}

export const DEFAULT_BANNER_URL = '/hero-banner.png'

export const useHeroBannerStore = create<HeroBannerState>()(
  persist(
    (set) => ({
      bannerUrl: DEFAULT_BANNER_URL,
      selectedPresetId: 'default',
      setBannerUrl: (url, presetId = null) =>
        set({
          bannerUrl: url,
          selectedPresetId: presetId,
        }),
      resetBannerUrl: () =>
        set({
          bannerUrl: DEFAULT_BANNER_URL,
          selectedPresetId: 'default',
        }),
    }),
    {
      name: 'node-space-hero-banner-storage',
    }
  )
)
