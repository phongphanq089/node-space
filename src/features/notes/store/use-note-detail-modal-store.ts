import { create } from 'zustand'
import type { FolderDetailNode } from '../types'

export type NoteDetailNode = FolderDetailNode

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
