import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FolderViewMode = 'grid' | 'list'

interface FolderViewState {
  viewMode: FolderViewMode
  setViewMode: (mode: FolderViewMode) => void
}

export const useFolderViewStore = create<FolderViewState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'node-space-folder-view-storage',
    }
  )
)
