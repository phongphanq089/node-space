/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FolderPlus,
  Pencil,
  Palette,
  Layers,
  Sparkles,
  Loader2,
  Check,
  Tag,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { WORKSPACES } from '@/shared/mocks/mock-data'
import {
  useCreateFolderMutation,
  useUpdateFolderMutation,
} from '../hooks/use-folders'
import type { FolderItemRecord } from './folder-card'
import { useWorkspacesQuery } from '@/features/workspace/hooks/use-workspaces'
import { useTagsQuery } from '@/features/tag'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/core/dialog'
import { Input } from '@/shared/ui/core/input'
import { Field, FieldError, FieldLabel } from '@/shared/ui/core/field'
import {
  ColorPicker,
  DEFAULT_PRESET_COLORS,
} from '@/shared/ui/core/color-picker'
import { Button } from '@/shared/ui/core/button'

export const folderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.'),
  workspaceId: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL',
    }),
})

export type FolderSchemaValues = z.infer<typeof folderSchema>

export interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'create' | 'edit'
  folder?: FolderItemRecord | null
  defaultWorkspaceId?: string | null
  onSubmit?: (data: {
    name: string
    workspaceId?: string
    color?: string
    tags?: string[]
    image?: string
  }) => void
}

export function FolderModal({
  isOpen,
  onClose,
  mode = 'create',
  folder = null,
  defaultWorkspaceId = null,
  onSubmit,
}: FolderModalProps) {
  const isEdit = mode === 'edit' || !!folder
  const createFolderMutation = useCreateFolderMutation()
  const updateFolderMutation = useUpdateFolderMutation()

  const { data: dbWorkspaces = [] } = useWorkspacesQuery()
  const { data: dbTags = [] } = useTagsQuery()
  const displayWorkspaces = dbWorkspaces.length > 0 ? dbWorkspaces : WORKSPACES

  const getInitialWorkspaceId = () => {
    if (isEdit && folder) {
      const currentWsId =
        (folder as any).workspace_id || (folder as any).workspaceId || ''
      const found = displayWorkspaces.find(
        (w: any) => w.id === currentWsId || w.name === currentWsId
      )
      if (found) return (found as any).id || (found as any).name
      return ''
    }

    if (defaultWorkspaceId) {
      const found = displayWorkspaces.find(
        (w: any) => w.id === defaultWorkspaceId || w.name === defaultWorkspaceId
      )
      if (found) return (found as any).id || (found as any).name
      return defaultWorkspaceId
    }

    return ''
  }

  const form = useForm<FolderSchemaValues>({
    resolver: zodResolver(folderSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      workspaceId: '',
      color: DEFAULT_PRESET_COLORS[0],
      tags: [],
      image: '',
    },
  })

  const prevIsOpenRef = useRef(false)

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      form.reset({
        name: isEdit ? folder?.name || '' : '',
        workspaceId: getInitialWorkspaceId(),
        color: (isEdit ? folder?.color : null) || DEFAULT_PRESET_COLORS[0],
        tags: (isEdit ? (folder as any)?.tags : null) || [],
        image: (isEdit ? folder?.image : null) || '',
      })
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen, folder, isEdit, defaultWorkspaceId, displayWorkspaces, form])

  const isSubmitting = isEdit
    ? updateFolderMutation.isPending
    : createFolderMutation.isPending

  const handleSubmit = async (data: FolderSchemaValues) => {
    try {
      if (isEdit && folder) {
        await updateFolderMutation.mutateAsync({
          folderId: folder.id,
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: data.image,
        })
      } else {
        await createFolderMutation.mutateAsync({
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: data.image,
        })
      }

      if (onSubmit) {
        onSubmit({
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: data.image,
        })
      }
      onClose()
    } catch {
      // Error is handled by mutation toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[90vh] sm:max-w-md">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />
        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              {isEdit ? <Pencil size={19} /> : <FolderPlus size={19} />}
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                {isEdit ? 'Edit Folder' : 'Create New Folder'}
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                {isEdit
                  ? 'Update your folder settings & properties'
                  : 'Organize your notes into dedicated folders'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex min-h-0 flex-1 flex-col pt-2"
        >
          <div className="no-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Folder Name <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. System Architecture, Project Docs..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Workspace Choice Cards */}
            <Controller
              name="workspaceId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-1.5">
                    <Layers size={14} className="text-white" />
                    Workspace
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Option for General / All (No explicit workspace requirement) */}
                    <button
                      type="button"
                      onClick={() => field.onChange('')}
                      className={cn(
                        'group relative flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left transition-all outline-none',
                        !field.value
                          ? 'border-ns-primary bg-ns-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-ns-primary/50'
                          : 'border-ns-border/70 bg-ns-panel/40 hover:border-ns-border-md hover:bg-ns-hover/50'
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-ns-active/80 text-ns-primary-lt shadow-inner">
                          <Layers size={12} />
                        </span>
                        <span
                          className={cn(
                            'truncate text-xs transition-colors',
                            !field.value
                              ? 'font-bold text-white'
                              : 'font-medium text-ns-text/80 group-hover:text-white'
                          )}
                        >
                          General / All
                        </span>
                      </div>

                      <div
                        className={cn(
                          'ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
                          !field.value
                            ? 'border-ns-primary bg-ns-primary text-white'
                            : 'border-ns-border opacity-0 group-hover:opacity-40'
                        )}
                      >
                        {!field.value && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>

                    {displayWorkspaces.map((ws: any) => {
                      const wsId = ws.id || ws.name
                      const wsName = ws.name
                      const wsColor = ws.color || '#3b82f6'
                      const isSelected = field.value === wsId

                      return (
                        <button
                          key={wsId}
                          type="button"
                          onClick={() => field.onChange(wsId)}
                          className={cn(
                            'group relative flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left transition-all outline-none',
                            isSelected
                              ? 'border-ns-primary bg-ns-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-ns-primary/50'
                              : 'border-ns-border/70 bg-ns-panel/40 hover:border-ns-border-md hover:bg-ns-hover/50'
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 shadow-inner"
                              style={{
                                backgroundColor: `${wsColor}20`,
                                borderColor: `${wsColor}40`,
                              }}
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: wsColor }}
                              />
                            </span>
                            <span
                              className={cn(
                                'truncate text-xs transition-colors',
                                isSelected
                                  ? 'font-bold text-white'
                                  : 'font-medium text-ns-text/80 group-hover:text-white'
                              )}
                            >
                              {wsName}
                            </span>
                          </div>

                          <div
                            className={cn(
                              'ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
                              isSelected
                                ? 'border-ns-primary bg-ns-primary text-white'
                                : 'border-ns-border opacity-0 group-hover:opacity-40'
                            )}
                          >
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Folder Theme Color Picker */}
            <Controller
              name="color"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-1.5">
                    <Palette size={14} className="text-white" />
                    Theme Accent Color
                  </FieldLabel>
                  <ColorPicker
                    value={field.value || DEFAULT_PRESET_COLORS[0]}
                    onChange={field.onChange}
                    isDefaultOpen
                  />
                </Field>
              )}
            />

            {/* Folder Topic Tags */}
            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => {
                const selectedTags: string[] = field.value || []

                const toggleTag = (tagName: string) => {
                  if (selectedTags.includes(tagName)) {
                    field.onChange(selectedTags.filter((t) => t !== tagName))
                  } else {
                    field.onChange([...selectedTags, tagName])
                  }
                }

                return (
                  <Field>
                    <FieldLabel className="flex items-center gap-1.5">
                      <Tag size={14} className="text-white" />
                      Topic Tags / Keywords
                    </FieldLabel>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dbTags.map((t) => {
                        const isSelected = selectedTags.includes(t.name)
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTag(t.name)}
                            className={cn(
                              'flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all outline-none',
                              isSelected
                                ? 'border-purple-500/60 bg-purple-500/20 text-white shadow-sm ring-1 ring-purple-500/40'
                                : 'border-ns-border/60 bg-ns-panel/40 text-ns-muted hover:border-ns-border-md hover:bg-ns-hover/50 hover:text-white'
                            )}
                          >
                            <span className="font-mono text-purple-400">#</span>
                            <span>{t.name}</span>
                            {isSelected && (
                              <Check
                                size={10}
                                strokeWidth={3}
                                className="ml-0.5 text-purple-300"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </Field>
                )
              }}
            />
          </div>

          <DialogFooter className="mt-6 border-t border-ns-border-soft pt-4 sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>{isEdit ? 'Save Changes' : 'Create Folder'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Backward-compatible wrappers
export function CreateFolderModal(props: Omit<FolderModalProps, 'mode'>) {
  return <FolderModal {...props} mode="create" />
}

export function EditFolderModal(
  props: Omit<FolderModalProps, 'mode'> & { folder: FolderItemRecord | null }
) {
  return <FolderModal {...props} mode="edit" />
}
