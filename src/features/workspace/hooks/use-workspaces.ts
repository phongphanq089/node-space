import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getWorkspacesFn,
  createWorkspaceFn,
  deleteWorkspaceFn,
  updateWorkspaceFn,
} from '../workspace.fns'
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '../workspace.fns'
import { toast } from 'sonner'

export const WORKSPACES_QUERY_KEY = ['workspaces'] as const

export function useWorkspacesQuery() {
  return useQuery({
    queryKey: WORKSPACES_QUERY_KEY,
    queryFn: async () => {
      const res = await getWorkspacesFn({ data: { limit: 100 } })
      return res.items
    },
  })
}

export function useInfiniteWorkspacesQuery(pageSize = 10, search = '') {
  return useInfiniteQuery({
    queryKey: [...WORKSPACES_QUERY_KEY, 'infinite', pageSize, search],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getWorkspacesFn({
        data: { limit: pageSize, offset: pageParam, search },
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

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateWorkspaceInput) => {
      const response = await createWorkspaceFn({ data })
      return response
    },
    onSuccess: () => {
      toast.success('Workspace created successfully!')
      void queryClient.invalidateQueries({
        queryKey: WORKSPACES_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to create workspace:', error)
      toast.error(
        error.message || 'Failed to create workspace. Please try again.'
      )
    },
  })
}

export function useUpdateWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateWorkspaceInput) => {
      const response = await updateWorkspaceFn({ data })
      return response
    },
    onSuccess: () => {
      toast.success('Workspace updated successfully!')
      void queryClient.invalidateQueries({
        queryKey: WORKSPACES_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to update workspace:', error)
      toast.error(error.message || 'Failed to update workspace.')
    },
  })
}

export function useDeleteWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await deleteWorkspaceFn({ data: { workspaceId } })
      return response
    },
    onSuccess: () => {
      toast.success('Workspace deleted successfully!')
      void queryClient.invalidateQueries({
        queryKey: WORKSPACES_QUERY_KEY,
        refetchType: 'all',
      })
      void queryClient.invalidateQueries({
        queryKey: ['tags'],
        refetchType: 'all',
      })
    },
    onError: (error: Error) => {
      console.error('Failed to delete workspace:', error)
      toast.error(error.message || 'Failed to delete workspace.')
    },
  })
}
