import { create } from 'zustand'
import type { NodeItem } from '@/shared/mocks/mock-data'

export type NoteDetailNode = NodeItem & { thumbnail?: string }

interface NoteDetailModalState {
  node: NoteDetailNode | null
  openModal: (node: NoteDetailNode) => void
  closeModal: () => void
}

export const useNoteDetailModalStore = create<NoteDetailModalState>()(
  (set) => ({
    node: null,
    openModal: (node) => set({ node }),
    closeModal: () => set({ node: null }),
  })
)
