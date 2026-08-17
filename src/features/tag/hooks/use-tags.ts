import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { getTagsFn, createTagFn, updateTagFn, deleteTagFn } from '../tag.fns'
import type { CreateTagInput, UpdateTagInput } from '../tag.fns'
import { toast } from 'sonner'

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (search?: string, workspaceId?: string) =>
    [...tagKeys.lists(), { search, workspaceId }] as const,
  infinite: (search?: string, workspaceId?: string) =>
    [...tagKeys.all, 'infinite', { search, workspaceId }] as const,
}

export function useTagsQuery(search?: string, workspaceId?: string) {
  return useQuery({
    queryKey: tagKeys.list(search, workspaceId),
    queryFn: async () => {
      const res = await getTagsFn({
        data: { search, workspaceId, limit: 50, page: 0 },
      })
      return res.items
    },
  })
}

export function useInfiniteTagsQuery(
  pageSize = 20,
  search?: string,
  workspaceId?: string
) {
  return useInfiniteQuery({
    queryKey: tagKeys.infinite(search, workspaceId),
    queryFn: async ({ pageParam = 0 }) => {
      return await getTagsFn({
        data: {
          page: pageParam,
          limit: pageSize,
          search,
          workspaceId,
        },
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined
    },
  })
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTagInput) => {
      return await createTagFn({ data })
    },
    onSuccess: () => {
      toast.success('Tag created successfully!')
      void queryClient.invalidateQueries({
        queryKey: tagKeys.all,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['folders'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tag.')
    },
  })
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateTagInput) => {
      return await updateTagFn({ data })
    },
    onSuccess: () => {
      toast.success('Tag updated successfully!')
      void queryClient.invalidateQueries({
        queryKey: tagKeys.all,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['folders'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update tag.')
    },
  })
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tagId: string) => {
      return await deleteTagFn({ data: { tagId } })
    },
    onSuccess: () => {
      toast.success('Tag deleted successfully!')
      void queryClient.invalidateQueries({
        queryKey: tagKeys.all,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['folders'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete tag.')
    },
  })
}
