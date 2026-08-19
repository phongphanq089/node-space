import { create } from 'zustand'

interface NewNoteDialogState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useNewNoteDialogStore = create<NewNoteDialogState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
