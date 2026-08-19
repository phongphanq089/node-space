import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotesFn,
  getNoteByIdFn,
  createNoteFn,
  updateNoteFn,
  deleteNoteFn,
  togglePinNoteFn,
  toggleFavoriteNoteFn,
} from '../note.fns'
import type {
  CreateNoteInput,
  UpdateNoteInput,
  GetNotesInput,
} from '../note.fns'
import { toast } from 'sonner'

export const NOTES_QUERY_KEY = ['notes'] as const

export function useNotesQuery(filters: Partial<GetNotesInput> = {}) {
  return useQuery({
    queryKey: [...NOTES_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await getNotesFn({
        data: {
          limit: 100,
          offset: 0,
          ...filters,
        },
      })
      return res.items
    },
  })
}

export function useNoteByIdQuery(noteId?: string | null) {
  return useQuery({
    queryKey: [...NOTES_QUERY_KEY, 'detail', noteId],
    queryFn: async () => {
      if (!noteId) return null
      const res = await getNoteByIdFn({ data: { noteId } })
      return res
    },
    enabled: !!noteId,
  })
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateNoteInput) => {
      const response = await createNoteFn({ data })
      return response
    },
    onSuccess: (createdNote) => {
      toast.success('Note created successfully!')
      void queryClient.invalidateQueries({
        queryKey: NOTES_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['folders'],
        refetchType: 'all',
      })
      return createdNote
    },
    onError: (error: Error) => {
      console.error('Failed to create note:', error)
      toast.error(error.message || 'Failed to create note. Please try again.')
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateNoteInput) => {
      const response = await updateNoteFn({ data })
      return response
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: NOTES_QUERY_KEY,
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update note:', error)
      toast.error(error.message || 'Failed to update note.')
    },
  })
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      noteId,
      permanent,
    }: {
      noteId: string
      permanent?: boolean
    }) => {
      const response = await deleteNoteFn({ data: { noteId, permanent } })
      return response
    },
    onSuccess: () => {
      toast.success('Note moved to trash!')
      void queryClient.invalidateQueries({
        queryKey: NOTES_QUERY_KEY,
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to delete note:', error)
      toast.error(error.message || 'Failed to delete note.')
    },
  })
}

export function useTogglePinNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await togglePinNoteFn({ data: { noteId } })
      return response
    },
    onSuccess: (res) => {
      toast.success(res.isPinned ? 'Note pinned!' : 'Note unpinned!')
      void queryClient.invalidateQueries({
        queryKey: NOTES_QUERY_KEY,
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to pin note:', error)
      toast.error(error.message || 'Failed to update pin status.')
    },
  })
}

export function useToggleFavoriteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await toggleFavoriteNoteFn({ data: { noteId } })
      return response
    },
    onSuccess: (res) => {
      toast.success(
        res.isFavorite ? 'Added to favorites!' : 'Removed from favorites!'
      )
      void queryClient.invalidateQueries({
        queryKey: NOTES_QUERY_KEY,
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update favorite status:', error)
      toast.error(error.message || 'Failed to update favorite status.')
    },
  })
}
