import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface NoteTabItem {
  id: string
  title: string
  folderId?: string
  folderName?: string
  isPinned?: boolean
  isDirty?: boolean
  thumbnail?: string
  updatedAt?: string
}

interface NoteTabsState {
  tabs: NoteTabItem[]
  activeTabId: string | null
  // Actions
  openTab: (tab: NoteTabItem) => void
  closeTab: (id: string, onNextTab?: (nextTabId: string | null) => void) => void
  closeOtherTabs: (id: string) => void
  closeAllTabs: (onClear?: () => void) => void
  setActiveTab: (id: string | null) => void
  togglePinTab: (id: string) => void
  updateTabTitle: (id: string, title: string) => void
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void
}

export const useNoteTabsStore = create<NoteTabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (tab: NoteTabItem) => {
        const { tabs } = get()
        const existingIndex = tabs.findIndex((t) => t.id === tab.id)

        if (existingIndex !== -1) {
          // Tab already exists — update any updated metadata & activate it
          const updatedTabs = [...tabs]
          updatedTabs[existingIndex] = {
            ...updatedTabs[existingIndex],
            ...tab,
          }
          set({
            tabs: updatedTabs,
            activeTabId: tab.id,
          })
        } else {
          // Add new tab and activate it
          set({
            tabs: [...tabs, tab],
            activeTabId: tab.id,
          })
        }
      },

      closeTab: (id: string, onNextTab) => {
        const { tabs, activeTabId } = get()
        const tabIndex = tabs.findIndex((t) => t.id === id)
        if (tabIndex === -1) return

        const newTabs = tabs.filter((t) => t.id !== id)
        let nextActiveId = activeTabId

        // If closing the currently active tab, pick the adjacent tab
        if (activeTabId === id) {
          if (newTabs.length > 0) {
            // Pick next or previous tab
            const nextIndex = Math.min(tabIndex, newTabs.length - 1)
            nextActiveId = newTabs[nextIndex].id
          } else {
            nextActiveId = null
          }
        }

        set({
          tabs: newTabs,
          activeTabId: nextActiveId,
        })

        if (onNextTab) {
          onNextTab(nextActiveId)
        }
      },

      closeOtherTabs: (id: string) => {
        const { tabs } = get()
        const targetTab = tabs.find((t) => t.id === id)
        if (!targetTab) return

        // Keep pinned tabs + the target tab
        const newTabs = tabs.filter((t) => t.isPinned || t.id === id)
        set({
          tabs: newTabs,
          activeTabId: id,
        })
      },

      closeAllTabs: (onClear) => {
        const { tabs } = get()
        // Keep pinned tabs if any
        const pinnedTabs = tabs.filter((t) => t.isPinned)
        const nextActiveId = pinnedTabs.length > 0 ? pinnedTabs[0].id : null

        set({
          tabs: pinnedTabs,
          activeTabId: nextActiveId,
        })

        if (onClear) {
          onClear()
        }
      },

      setActiveTab: (id: string | null) => {
        set({ activeTabId: id })
      },

      togglePinTab: (id: string) => {
        const { tabs } = get()
        const updatedTabs = tabs.map((t) =>
          t.id === id ? { ...t, isPinned: !t.isPinned } : t
        )

        // Sort so pinned tabs are placed first
        const pinned = updatedTabs.filter((t) => t.isPinned)
        const unpinned = updatedTabs.filter((t) => !t.isPinned)

        set({
          tabs: [...pinned, ...unpinned],
        })
      },

      updateTabTitle: (id: string, title: string) => {
        const { tabs } = get()
        set({
          tabs: tabs.map((t) => (t.id === id ? { ...t, title } : t)),
        })
      },

      reorderTabs: (sourceIndex: number, destinationIndex: number) => {
        const { tabs } = get()
        if (
          sourceIndex < 0 ||
          sourceIndex >= tabs.length ||
          destinationIndex < 0 ||
          destinationIndex >= tabs.length
        ) {
          return
        }

        const result = Array.from(tabs)
        const [removed] = result.splice(sourceIndex, 1)
        result.splice(destinationIndex, 0, removed)

        set({ tabs: result })
      },
    }),
    {
      name: 'nodespace-workspace-tabs',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
