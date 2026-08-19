import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentPreset =
  'violet' | 'emerald' | 'ocean' | 'amber' | 'rose' | 'cyberpunk' | 'custom'

export interface AccentOption {
  id: AccentPreset
  name: string
  primaryColor: string
  lightTint: string
}

export const ACCENT_PRESETS: AccentOption[] = [
  {
    id: 'violet',
    name: 'Violet',
    primaryColor: '#7c3aed',
    lightTint: '#a78bfa',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primaryColor: '#059669',
    lightTint: '#34d399',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primaryColor: '#0284c7',
    lightTint: '#38bdf8',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    primaryColor: '#d97706',
    lightTint: '#fbbf24',
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    primaryColor: '#e11d48',
    lightTint: '#fb7185',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Cyan',
    primaryColor: '#06b6d4',
    lightTint: '#67e8f9',
  },
]

export function applyThemeToDOM(
  mode: ThemeMode,
  accent: AccentPreset,
  customColor?: string
) {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = mode === 'dark' || (mode === 'system' && isSystemDark)

  // Toggle dark class & attributes
  if (isDark) {
    root.classList.add('dark')
    root.classList.remove('light')
    root.setAttribute('data-theme', 'dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
    root.style.colorScheme = 'light'
  }

  // Set accent attribute
  root.setAttribute('data-accent', accent)

  // Custom accent color override if selected
  if (accent === 'custom' && customColor) {
    root.style.setProperty('--ns-primary', customColor)
    root.style.setProperty('--ns-primary-lt', customColor)
  } else {
    // Remove inline style override so CSS rules take precedence
    root.style.removeProperty('--ns-primary')
    root.style.removeProperty('--ns-primary-lt')
  }
}

interface ThemeState {
  mode: ThemeMode
  accent: AccentPreset
  customColor: string
  isDrawerOpen: boolean
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentPreset) => void
  setCustomColor: (color: string) => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  setDrawerOpen: (open: boolean) => void
  initThemeListener: () => () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      accent: 'violet',
      customColor: '#7c3aed',
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      setMode: (mode) => {
        set({ mode })
        const { accent, customColor } = get()
        applyThemeToDOM(mode, accent, customColor)
      },

      setAccent: (accent) => {
        set({ accent })
        const { mode, customColor } = get()
        applyThemeToDOM(mode, accent, customColor)
      },

      setCustomColor: (customColor) => {
        set({ customColor, accent: 'custom' })
        const { mode } = get()
        applyThemeToDOM(mode, 'custom', customColor)
      },

      initThemeListener: () => {
        if (typeof window === 'undefined') return () => {}

        const { mode, accent, customColor } = get()
        applyThemeToDOM(mode, accent, customColor)

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
          const currentMode = get().mode
          if (currentMode === 'system') {
            applyThemeToDOM('system', get().accent, get().customColor)
          }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      },
    }),
    {
      name: 'nodespace-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.mode, state.accent, state.customColor)
        }
      },
    }
  )
)
