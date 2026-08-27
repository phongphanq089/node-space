import React, { useEffect, useCallback, useState } from 'react'
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
  Upload,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  useCreateFolderMutation,
  useUpdateFolderMutation,
} from '../hooks/use-folders'
import type { FolderItemRecord } from './folder-card'
import { useWorkspacesQuery } from '@/features/workspace/hooks/use-workspaces'
import { useTagsQuery } from '@/features/tag'
import { useUploadMediaMutation } from '@/features/media'
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
import { FilePond } from 'react-filepond'

export const folderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.'),
  workspaceId: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
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

function FolderModalComponent({
  isOpen,
  onClose,
  mode = 'create',
  folder = null,
  defaultWorkspaceId = null,
  onSubmit,
}: FolderModalProps) {
  const [files, setFiles] = useState<any[]>([])

  const isEdit = mode === 'edit' || !!folder
  const createFolderMutation = useCreateFolderMutation()
  const updateFolderMutation = useUpdateFolderMutation()
  const uploadMediaMutation = useUploadMediaMutation()

  const { data: dbWorkspaces = [] } = useWorkspacesQuery()
  const { data: dbTags = [] } = useTagsQuery()

  const displayWorkspaces = dbWorkspaces

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

  // Reset form and files ONLY when modal opens or target folder changes
  useEffect(() => {
    if (isOpen) {
      const initialImage = (isEdit ? folder?.image : null) || ''
      const currentWsId =
        (folder as any)?.workspace_id ||
        (folder as any)?.workspaceId ||
        defaultWorkspaceId ||
        ''

      form.reset({
        name: isEdit ? folder?.name || '' : '',
        workspaceId: currentWsId,
        color: (isEdit ? folder?.color : null) || DEFAULT_PRESET_COLORS[0],
        tags: (isEdit ? (folder as any)?.tags : null) || [],
        image: initialImage,
      })

      setFiles(
        initialImage
          ? [{ source: initialImage, options: { type: 'local' } }]
          : []
      )
    }
  }, [isOpen, folder?.id, isEdit, defaultWorkspaceId, form])

  // Prevent recursive state updates from FilePond initialization
  const handleUpdateFiles = useCallback((fileItems: any[]) => {
    setFiles((prev) => {
      if (prev.length === 0 && fileItems.length === 0) return prev
      if (
        prev.length === fileItems.length &&
        prev[0]?.file === fileItems[0]?.file &&
        prev[0]?.source === fileItems[0]?.source
      ) {
        return prev
      }
      return fileItems
    })
  }, [])

  const isSubmitting =
    (isEdit
      ? updateFolderMutation.isPending
      : createFolderMutation.isPending) || uploadMediaMutation.isPending

  const handleSubmit = async (data: FolderSchemaValues) => {
    try {
      let finalImageUrl = data.image || ''

      // Process FilePond file if a new file is uploaded
      const fileItem = files[0]
      if (fileItem?.file instanceof File) {
        const uploadRes = await uploadMediaMutation.mutateAsync({
          file: fileItem.file,
          options: {
            folder: 'folders',
            maxSizeInMB: 10,
            allowedTypes: [
              'image/jpeg',
              'image/png',
              'image/webp',
              'image/gif',
              'image/svg+xml',
            ],
          },
        })
        finalImageUrl = uploadRes.url
      } else if (files.length === 0) {
        finalImageUrl = ''
      } else if (typeof fileItem?.source === 'string') {
        finalImageUrl = fileItem.source
      }

      if (isEdit && folder) {
        await updateFolderMutation.mutateAsync({
          folderId: folder.id,
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: finalImageUrl,
        })
      } else {
        await createFolderMutation.mutateAsync({
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: finalImageUrl,
        })
      }

      if (onSubmit) {
        onSubmit({
          name: data.name,
          workspaceId: data.workspaceId,
          color: data.color,
          tags: data.tags,
          image: finalImageUrl,
        })
      }
      onClose()
    } catch {
      // Error is handled by mutation toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[90vh] sm:max-w-xl">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />
        <DialogHeader className="shrink-0 gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              {isEdit ? <Pencil size={24} /> : <FolderPlus size={24} />}
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-lg font-extrabold text-ns-primary dark:text-white">
                {isEdit ? 'Edit Folder' : 'Create New Folder'}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-700 dark:text-ns-faint">
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
                    <Layers
                      size={14}
                      className="text-ns-primary dark:text-white"
                    />
                    Workspace
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Option for General / All (No explicit workspace requirement) */}
                    <button
                      type="button"
                      onClick={() => field.onChange('')}
                      className={cn(
                        'group relative flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-left transition-all outline-none',
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
                              ? 'font-bold text-ns-primary dark:text-white'
                              : 'font-medium text-ns-text/80'
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
                            'group relative flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-left transition-all outline-none',
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
                                  ? 'font-bold text-ns-primary dark:text-white'
                                  : 'font-medium text-ns-text/80'
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
                    <Palette
                      size={14}
                      className="text-ns-primary dark:text-white"
                    />
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
                      <Tag
                        size={14}
                        className="text-ns-primary dark:text-white"
                      />
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
                              'flex cursor-pointer items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold transition-all outline-none',
                              isSelected
                                ? 'border-purple-500/60 bg-purple-500/20 text-ns-primary shadow-sm ring-1 ring-purple-500/40 dark:text-white'
                                : 'border-ns-border/60 bg-ns-panel/40 hover:border-ns-border-md hover:bg-ns-hover/50 dark:text-ns-muted hover:dark:text-white'
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

            {/* Folder Cover Image Upload with FilePond & Cloudflare R2 */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel className="flex items-center gap-1.5">
                <Upload size={14} className="text-ns-primary dark:text-white" />
                Folder Cover Image
              </FieldLabel>
              <FilePond
                files={files}
                onupdatefiles={handleUpdateFiles}
                allowMultiple={false}
                allowImagePreview={true}
                acceptedFileTypes={[
                  'image/jpeg',
                  'image/png',
                  'image/webp',
                  'image/gif',
                  'image/svg+xml',
                ]}
                name="file"
                labelIdle='Drag & Drop image or <span class="filepond--label-action">Browse</span>'
                labelFileTypeNotAllowed="Only image files are allowed"
                credits={false}
              />
            </div>
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
                  <span>
                    {uploadMediaMutation.isPending
                      ? 'Uploading Cover...'
                      : isEdit
                        ? 'Saving...'
                        : 'Creating...'}
                  </span>
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

export const FolderModal = React.memo(FolderModalComponent)

// Backward-compatible wrappers
export function CreateFolderModal(props: Omit<FolderModalProps, 'mode'>) {
  return <FolderModal {...props} mode="create" />
}

export function EditFolderModal(
  props: Omit<FolderModalProps, 'mode'> & { folder: FolderItemRecord | null }
) {
  return <FolderModal {...props} mode="edit" />
}
