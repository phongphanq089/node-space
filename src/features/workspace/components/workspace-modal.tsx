import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Layers,
  Palette,
  Sparkles,
  Loader2,
  AlignLeft,
  Tag,
  Check,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from '../hooks/use-workspaces'
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

export const workspaceModalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(50, 'Workspace name must be at most 50 characters.'),
  color: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type WorkspaceModalSchemaValues = z.infer<typeof workspaceModalSchema>
export type CreateWorkspaceSchemaValues = WorkspaceModalSchemaValues
export type EditWorkspaceSchemaValues = WorkspaceModalSchemaValues
export const createWorkspaceSchema = workspaceModalSchema
export const editWorkspaceSchema = workspaceModalSchema

export interface WorkspaceItemRecord {
  id: string
  name: string
  color?: string | null
  description?: string | null
  tags?: string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface WorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceItem?: WorkspaceItemRecord | null
  mode?: 'create' | 'edit'
}

function WorkspaceModalComponent({
  isOpen,
  onClose,
  workspaceItem = null,
  mode,
}: WorkspaceModalProps) {
  const isEditing = mode === 'edit' || Boolean(workspaceItem)
  const createWorkspaceMutation = useCreateWorkspaceMutation()
  const updateWorkspaceMutation = useUpdateWorkspaceMutation()
  const { data: dbTags = [] } = useTagsQuery()

  const isPending =
    createWorkspaceMutation.isPending || updateWorkspaceMutation.isPending

  const form = useForm<WorkspaceModalSchemaValues>({
    resolver: zodResolver(workspaceModalSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      color: DEFAULT_PRESET_COLORS[0],
      description: '',
      tags: [],
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (workspaceItem) {
        form.reset({
          name: workspaceItem.name || '',
          color: workspaceItem.color || DEFAULT_PRESET_COLORS[0],
          description: workspaceItem.description || '',
          tags: workspaceItem.tags || [],
        })
      } else {
        form.reset({
          name: '',
          color: DEFAULT_PRESET_COLORS[0],
          description: '',
          tags: [],
        })
      }
    }
  }, [isOpen, workspaceItem?.id, form])

  const handleSubmit = async (data: WorkspaceModalSchemaValues) => {
    try {
      if (isEditing && workspaceItem) {
        await updateWorkspaceMutation.mutateAsync({
          workspaceId: workspaceItem.id,
          name: data.name,
          color: data.color,
          description: data.description,
          tags: data.tags,
        })
      } else {
        await createWorkspaceMutation.mutateAsync({
          name: data.name,
          color: data.color,
          description: data.description,
          tags: data.tags,
        })
      }
      onClose()
    } catch {
      // Error handled in mutation toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[90vh] sm:max-w-xl">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />
        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              <Layers size={19} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                {isEditing ? 'Edit Workspace' : 'Create Workspace'}
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                {isEditing
                  ? workspaceItem?.name
                    ? `Update details for "${workspaceItem.name}"`
                    : 'Update workspace details'
                  : 'Set up a dedicated environment for your projects'}
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
                    Workspace Name <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Personal, Work, Side Projects..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-1.5">
                    <AlignLeft size={14} className="text-white" />
                    Description{' '}
                    <span className="text-[0.6rem] font-normal text-ns-faint">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Brief description of this workspace"
                  />
                </Field>
              )}
            />

            <Controller
              name="color"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel className="flex items-center gap-1.5">
                    <Palette size={14} className="text-white" />
                    Accent Color
                  </FieldLabel>
                  <div className="py-1">
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      isDefaultOpen
                    />
                  </div>
                </div>
              )}
            />

            {/* Workspace Topic Tags */}
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
                              'flex cursor-pointer items-center gap-1 rounded-sm border px-2.5 py-1 text-xs font-semibold transition-all outline-none',
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

          <DialogFooter className="-mx-0 mt-4 -mb-0 flex shrink-0 items-center justify-end gap-2 rounded-none border-t border-ns-border-soft bg-transparent p-0 pt-3">
            <DialogClose asChild>
              <Button variant={'outline'} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>
                {isPending
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Workspace'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const WorkspaceModal = React.memo(WorkspaceModalComponent)

export function CreateWorkspaceModal(
  props: Omit<WorkspaceModalProps, 'mode' | 'workspaceItem'>
) {
  return <WorkspaceModal {...props} mode="create" workspaceItem={null} />
}

export function EditWorkspaceModal(
  props: Omit<WorkspaceModalProps, 'mode'> & {
    workspaceItem: WorkspaceItemRecord | null
  }
) {
  return <WorkspaceModal {...props} mode="edit" />
}
