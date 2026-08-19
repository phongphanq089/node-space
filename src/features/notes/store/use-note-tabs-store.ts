import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface NoteTabItem {
  id: string
  title: string
  folderId?: string
  folderName?: string
  tags?: string[]
  isPinned?: boolean
  isDirty?: boolean
  thumbnail?: string
  updatedAt?: string
  updated?: string
  content?: string
}

export interface FolderTabsData {
  tabs: NoteTabItem[]
  activeTabId: string | null
}

interface NoteTabsState {
  // Dictionary of tabs per folder: folderId -> { tabs, activeTabId }
  folderTabsMap: Record<string, FolderTabsData>

  // Global fallback (for backward compatibility if needed)
  tabs: NoteTabItem[]
  activeTabId: string | null

  // Folder-scoped actions
  openNoteTab: (folderId: string, tab: NoteTabItem) => void
  closeNoteTab: (folderId: string, noteId: string) => void
  setActiveNoteTab: (folderId: string, noteId: string | null) => void
  togglePinNoteTab: (folderId: string, noteId: string) => void
  updateNoteTabTitle: (folderId: string, noteId: string, title: string) => void
  updateNoteTabTags: (folderId: string, noteId: string, tags: string[]) => void
  setFolderTabs: (folderId: string, data: FolderTabsData) => void

  // Backward compatibility actions
  openTab: (tab: NoteTabItem) => void
  closeTab: (id: string, onNextTab?: (nextTabId: string | null) => void) => void
  setActiveTab: (id: string | null) => void
  togglePinTab: (id: string) => void
}

export const useNoteTabsStore = create<NoteTabsState>()(
  persist(
    (set, get) => ({
      folderTabsMap: {},
      tabs: [],
      activeTabId: null,

      openNoteTab: (folderId: string, tab: NoteTabItem) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        const existingIndex = current.tabs.findIndex(
          (t) => t.id === tab.id || t.title === tab.title
        )

        let newTabs: NoteTabItem[]
        if (existingIndex !== -1) {
          newTabs = [...current.tabs]
          newTabs[existingIndex] = {
            ...newTabs[existingIndex],
            ...tab,
          }
        } else {
          newTabs = [...current.tabs, tab]
        }

        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              tabs: newTabs,
              activeTabId: tab.id,
            },
          },
        })
      },

      closeNoteTab: (folderId: string, noteId: string) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        const tabIndex = current.tabs.findIndex(
          (t) => t.id === noteId || t.title === noteId
        )
        if (tabIndex === -1) return

        const newTabs = current.tabs.filter(
          (t) => t.id !== noteId && t.title !== noteId
        )

        let nextActiveId = current.activeTabId
        if (
          current.activeTabId === noteId ||
          current.activeTabId === current.tabs[tabIndex].id
        ) {
          if (newTabs.length > 0) {
            const nextIndex = Math.min(tabIndex, newTabs.length - 1)
            nextActiveId = newTabs[nextIndex].id
          } else {
            nextActiveId = null
          }
        }

        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              tabs: newTabs,
              activeTabId: nextActiveId,
            },
          },
        })
      },

      setActiveNoteTab: (folderId: string, noteId: string | null) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              ...current,
              activeTabId: noteId,
            },
          },
        })
      },

      togglePinNoteTab: (folderId: string, noteId: string) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        const updatedTabs = current.tabs.map((t) =>
          t.id === noteId || t.title === noteId
            ? { ...t, isPinned: !t.isPinned }
            : t
        )

        const sorted = [...updatedTabs].sort(
          (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
        )

        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              ...current,
              tabs: sorted,
            },
          },
        })
      },

      updateNoteTabTitle: (folderId: string, noteId: string, title: string) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        const updatedTabs = current.tabs.map((t) =>
          t.id === noteId || t.title === noteId ? { ...t, title } : t
        )
        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              ...current,
              tabs: updatedTabs,
            },
          },
        })
      },

      updateNoteTabTags: (folderId: string, noteId: string, tags: string[]) => {
        const { folderTabsMap } = get()
        const current = folderTabsMap[folderId] ?? {
          tabs: [],
          activeTabId: null,
        }
        const updatedTabs = current.tabs.map((t) =>
          t.id === noteId || t.title === noteId ? { ...t, tags } : t
        )
        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: {
              ...current,
              tabs: updatedTabs,
            },
          },
        })
      },

      setFolderTabs: (folderId: string, data: FolderTabsData) => {
        const { folderTabsMap } = get()
        set({
          folderTabsMap: {
            ...folderTabsMap,
            [folderId]: data,
          },
        })
      },

      // Backward compatibility implementations
      openTab: (tab: NoteTabItem) => {
        const { tabs } = get()
        const existingIndex = tabs.findIndex((t) => t.id === tab.id)
        if (existingIndex !== -1) {
          const updatedTabs = [...tabs]
          updatedTabs[existingIndex] = { ...updatedTabs[existingIndex], ...tab }
          set({ tabs: updatedTabs, activeTabId: tab.id })
        } else {
          set({ tabs: [...tabs, tab], activeTabId: tab.id })
        }
      },

      closeTab: (id: string, onNextTab) => {
        const { tabs, activeTabId } = get()
        const tabIndex = tabs.findIndex((t) => t.id === id)
        if (tabIndex === -1) return
        const newTabs = tabs.filter((t) => t.id !== id)
        let nextActiveId = activeTabId
        if (activeTabId === id) {
          nextActiveId =
            newTabs.length > 0
              ? newTabs[Math.min(tabIndex, newTabs.length - 1)].id
              : null
        }
        set({ tabs: newTabs, activeTabId: nextActiveId })
        onNextTab?.(nextActiveId)
      },

      setActiveTab: (id: string | null) => set({ activeTabId: id }),

      togglePinTab: (id: string) => {
        const { tabs } = get()
        const updated = tabs.map((t) =>
          t.id === id ? { ...t, isPinned: !t.isPinned } : t
        )
        const sorted = [...updated].sort(
          (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
        )
        set({ tabs: sorted })
      },
    }),
    {
      name: 'nodespace-note-tabs-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
