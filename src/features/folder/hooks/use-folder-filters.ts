import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounce } from '@/shared/hooks'
import type { FolderItemRecord } from '../components/folder-card'
import type { SortField, SortDirection } from '../components/folder-sort-menu'
import { useFolderViewStore } from '../store/use-folder-view-store'

interface UseFolderFiltersOptions {
  initialWorkspaceId?: string
  initialTag?: string
  externalSearch?: string
  externalOnSearchChange?: (val: string) => void
}

export function useFolderFilters(options: UseFolderFiltersOptions = {}) {
  const {
    initialWorkspaceId,
    initialTag,
    externalSearch,
    externalOnSearchChange,
  } = options

  const navigate = useNavigate()

  // Persistent View Mode from Zustand store
  const { viewMode, setViewMode } = useFolderViewStore()

  // Search state
  const [internalSearch, setInternalSearch] = useState('')
  const search = externalSearch !== undefined ? externalSearch : internalSearch
  const setSearch = externalOnSearchChange || setInternalSearch
  const debouncedSearch = useDebounce(search, 500)

  // Filter state
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    initialWorkspaceId ?? null
  )

  // Multi-tag selection state
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (!initialTag) return []
    return initialTag
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  })

  // Sorting state
  const [sortBy, setSortBy] = useState<SortField>('updatedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Multi-Selection state
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])

  // Keep workspace in sync with URL props
  useEffect(() => {
    if (initialWorkspaceId !== undefined) {
      setSelectedWorkspaceId(initialWorkspaceId || null)
    }
  }, [initialWorkspaceId])

  // Keep tags in sync with URL props
  useEffect(() => {
    if (initialTag !== undefined) {
      const parsedTags = initialTag
        ? initialTag
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
      setSelectedTags(parsedTags)
    }
  }, [initialTag])

  const handleSelectWorkspace = useCallback(
    (id: string | null) => {
      setSelectedWorkspaceId(id)
      void navigate({
        to: '/workspace/folder',
        search: (prev) => ({
          ...prev,
          workspaceId: id || undefined,
        }),
        replace: true,
      })
    },
    [navigate]
  )

  const handleToggleTag = useCallback(
    (tagName: string) => {
      setSelectedTags((prev) => {
        const nextTags = prev.includes(tagName)
          ? prev.filter((t) => t !== tagName)
          : [...prev, tagName]

        void navigate({
          to: '/workspace/folder',
          search: (s) => ({
            ...s,
            tag: nextTags.length > 0 ? nextTags.join(',') : undefined,
          }),
          replace: true,
        })

        return nextTags
      })
    },
    [navigate]
  )

  const handleSelectTag = useCallback(
    (tagName: string | null) => {
      if (tagName === null) {
        setSelectedTags([])
        void navigate({
          to: '/workspace/folder',
          search: (prev) => ({
            ...prev,
            tag: undefined,
          }),
          replace: true,
        })
      } else {
        handleToggleTag(tagName)
      }
    },
    [navigate, handleToggleTag]
  )

  const handleClearAllTags = useCallback(() => {
    setSelectedTags([])
    void navigate({
      to: '/workspace/folder',
      search: (prev) => ({
        ...prev,
        tag: undefined,
      }),
      replace: true,
    })
  }, [navigate])

  const handleToggleSelectFolder = useCallback((folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    )
  }, [])

  const handleSelectAll = useCallback((allIds: string[]) => {
    setSelectedFolderIds(allIds)
  }, [])

  const handleDeselectAll = useCallback(() => {
    setSelectedFolderIds([])
  }, [])

  const handleToggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => {
      const next = !prev
      if (!next) setSelectedFolderIds([])
      return next
    })
  }, [])

  const resetFilters = useCallback(() => {
    handleSelectWorkspace(null)
    handleClearAllTags()
    setSearch('')
  }, [handleSelectWorkspace, handleClearAllTags, setSearch])

  // Sorting logic helper
  const sortFolders = useCallback(
    (folders: FolderItemRecord[]): FolderItemRecord[] => {
      const list = [...folders]
      return list.sort((a, b) => {
        let comparison = 0
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name)
        } else if (sortBy === 'createdAt') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          comparison = dateA - dateB
        } else if (sortBy === 'updatedAt') {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          comparison = dateA - dateB
        } else if (sortBy === 'lastViewed') {
          const dateA = a.updatedAt
            ? new Date(a.updatedAt).getTime()
            : a.createdAt
              ? new Date(a.createdAt).getTime()
              : 0
          const dateB = b.updatedAt
            ? new Date(b.updatedAt).getTime()
            : b.createdAt
              ? new Date(b.createdAt).getTime()
              : 0
          comparison = dateA - dateB
        }
        return sortDirection === 'asc' ? comparison : -comparison
      })
    },
    [sortBy, sortDirection]
  )

  // Backward compatibility alias for single tag representation
  const selectedTag = selectedTags.length > 0 ? selectedTags.join(',') : null

  return useMemo(
    () => ({
      search,
      setSearch,
      debouncedSearch,
      selectedWorkspaceId,
      handleSelectWorkspace,
      selectedTag,
      selectedTags,
      handleSelectTag,
      handleToggleTag,
      handleClearAllTags,
      viewMode,
      setViewMode,
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
      isSelectMode,
      setIsSelectMode,
      handleToggleSelectMode,
      selectedFolderIds,
      setSelectedFolderIds,
      handleToggleSelectFolder,
      handleSelectAll,
      handleDeselectAll,
      resetFilters,
      sortFolders,
    }),
    [
      search,
      setSearch,
      debouncedSearch,
      selectedWorkspaceId,
      handleSelectWorkspace,
      selectedTag,
      selectedTags,
      handleSelectTag,
      handleToggleTag,
      handleClearAllTags,
      viewMode,
      setViewMode,
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
      isSelectMode,
      setIsSelectMode,
      handleToggleSelectMode,
      selectedFolderIds,
      setSelectedFolderIds,
      handleToggleSelectFolder,
      handleSelectAll,
      handleDeselectAll,
      resetFilters,
      sortFolders,
    ]
  )
}
