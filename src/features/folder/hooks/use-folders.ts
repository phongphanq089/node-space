import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { getFoldersFn, createFolderFn, deleteFolderFn } from '../folder.fns'
import type { CreateFolderInput, UpdateFolderInput } from '../folder.fns'
import { toast } from 'sonner'

export const FOLDERS_QUERY_KEY = ['folders'] as const

export function useFoldersQuery() {
  return useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: async () => {
      const res = await getFoldersFn({ data: { limit: 100 } })
      return res.items
    },
  })
}

export function useInfiniteFoldersQuery(
  pageSize = 10,
  search = '',
  workspaceId: string | null = null,
  tags: string[] | string | null = null
) {
  const normalizedTags = Array.isArray(tags)
    ? tags.filter(Boolean).join(',')
    : tags || ''

  return useInfiniteQuery({
    queryKey: [
      ...FOLDERS_QUERY_KEY,
      'infinite',
      pageSize,
      search,
      workspaceId,
      normalizedTags,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getFoldersFn({
        data: {
          limit: pageSize,
          offset: pageParam,
          search,
          workspaceId,
          tags: Array.isArray(tags) ? tags : tags || undefined,
        },
      })
      return res
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length * pageSize
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
      void queryClient.invalidateQueries({
        queryKey: FOLDERS_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
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
      void queryClient.invalidateQueries({
        queryKey: FOLDERS_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
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
      void queryClient.invalidateQueries({
        queryKey: FOLDERS_QUERY_KEY,
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update favorite status:', error)
      toast.error(error.message || 'Failed to update favorite status.')
    },
  })
}

export function useUpdateFolderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateFolderInput) => {
      const { updateFolderFn } = await import('../folder.fns')
      const response = await updateFolderFn({ data })
      return response
    },
    onSuccess: () => {
      toast.success('Folder updated successfully!')
      void queryClient.invalidateQueries({
        queryKey: FOLDERS_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update folder:', error)
      toast.error(error.message || 'Failed to update folder.')
    },
  })
}

export const HERO_BANNER_QUERY_KEY = ['hero-banner'] as const

export function useHeroBannerQuery() {
  return useQuery({
    queryKey: HERO_BANNER_QUERY_KEY,
    queryFn: async () => {
      const { getHeroBannerFn } = await import('../folder.fns')
      return await getHeroBannerFn()
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateHeroBannerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      bannerUrl: string
      presetId?: string | null
    }) => {
      const { updateHeroBannerFn } = await import('../folder.fns')
      return await updateHeroBannerFn({ data })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(HERO_BANNER_QUERY_KEY, data)
      void queryClient.invalidateQueries({
        queryKey: HERO_BANNER_QUERY_KEY,
      })
    },
    onError: (error: Error) => {
      console.error('Failed to save banner to database:', error)
    },
  })
}
