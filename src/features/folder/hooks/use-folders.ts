import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFoldersFn, createFolderFn, deleteFolderFn } from '../folder.fns'
import type { CreateFolderInput } from '../folder.fns'
import { toast } from 'sonner'

export const FOLDERS_QUERY_KEY = ['folders'] as const

export function useFoldersQuery() {
  return useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: async () => {
      const folders = await getFoldersFn()
      return folders
    },
  })
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateFolderInput) => {
      const response = await createFolderFn({ data })
      return response
    },
    onSuccess: () => {
      toast.success('Folder created successfully!')
      void queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      console.error('Failed to create folder:', error)
      toast.error(error.message || 'Failed to create folder. Please try again.')
    },
  })
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await deleteFolderFn({ data: { folderId } })
      return response
    },
    onSuccess: () => {
      toast.success('Folder deleted successfully!')
      void queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      console.error('Failed to delete folder:', error)
      toast.error(error.message || 'Failed to delete folder.')
    },
  })
}

export function useToggleFavoriteFolderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (folderId: string) => {
      const { toggleFavoriteFolderFn } = await import('../folder.fns')
      const response = await toggleFavoriteFolderFn({ data: { folderId } })
      return response
    },
    onSuccess: (res) => {
      toast.success(
        res.isFavorite ? 'Added to Favorites!' : 'Removed from Favorites!'
      )
      void queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
    },
    onError: (error: Error) => {
      console.error('Failed to update favorite status:', error)
      toast.error(error.message || 'Failed to update favorite status.')
    },
  })
}
