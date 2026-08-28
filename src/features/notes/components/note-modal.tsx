import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FileText,
  Pencil,
  Folder,
  Tag as TagIcon,
  Pin,
  Star,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useFoldersQuery } from '@/features/folder/hooks/use-folders'
import { useTagsQuery } from '@/features/tag'
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from '../hooks/use-notes'
import type { NoteItem } from '../types'
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
import { Button } from '@/shared/ui/core/button'

export const noteModalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Note title is required.')
    .max(100, 'Note title must be at most 100 characters.'),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
})

export type NoteModalValues = z.infer<typeof noteModalSchema>

export interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'create' | 'edit'
  note?: NoteItem | null
  defaultFolderId?: string | null
  onSubmit?: (data: NoteModalValues & { id?: string }) => void
}

function NoteModalComponent({
  isOpen,
  onClose,
  mode = 'edit',
  note = null,
  defaultFolderId = null,
  onSubmit,
}: NoteModalProps) {
  const isEdit = mode === 'edit' || Boolean(note)
  const createNoteMutation = useCreateNoteMutation()
  const updateNoteMutation = useUpdateNoteMutation()

  const { data: dbFolders = [] } = useFoldersQuery()
  const { data: dbTags = [] } = useTagsQuery()

  const form = useForm<NoteModalValues>({
    resolver: zodResolver(noteModalSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      folderId: defaultFolderId || '',
      tags: [],
      isPinned: false,
      isFavorite: false,
    },
  })

  // Reset form when modal opens or note changes
  useEffect(() => {
    if (isOpen) {
      const currentFolderId =
        (note as any)?.folder_id ||
        (note as any)?.folderId ||
        defaultFolderId ||
        ''

      form.reset({
        name: note?.title || '',
        folderId: currentFolderId,
        tags: note?.tags || [],
        isPinned: Boolean(note?.starred || (note as any)?.isPinned),
        isFavorite: Boolean((note as any)?.isFavorite),
      })
    }
  }, [isOpen, note, defaultFolderId, form])

  const isSubmitting = isEdit
    ? updateNoteMutation.isPending
    : createNoteMutation.isPending

  const handleSubmit = async (data: NoteModalValues) => {
    try {
      if (isEdit && note?.id) {
        await updateNoteMutation.mutateAsync({
          id: note.id,
          name: data.name,
          folderId: data.folderId || null,
          tags: data.tags || [],
          isPinned: !!data.isPinned,
          isFavorite: !!data.isFavorite,
        })
      } else if (!isEdit) {
        await createNoteMutation.mutateAsync({
          name: data.name,
          folderId: data.folderId || undefined,
          tags: data.tags || [],
          isPinned: !!data.isPinned,
          isFavorite: !!data.isFavorite,
          content: `# ${data.name}\n\nStart writing your note here...`,
        })
      }

      onSubmit?.({ ...data, id: note?.id })
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[90vh] sm:max-w-lg">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />

        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              {isEdit ? <Pencil size={19} /> : <FileText size={19} />}
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                {isEdit ? 'Edit Note Properties' : 'Create Note'}
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                {isEdit
                  ? 'Update note name, folder destination, and tags'
                  : 'Add a new note to your workspace'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex min-h-0 flex-1 flex-col pt-2"
        >
          <div className="no-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
            {/* Note Title */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Note Title <span className="text-red-400">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="e.g. Meeting Summary, Brainstorming Ideas..."
                    autoFocus
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Folder Selection (Move Note between Folders) */}
            <Controller
              name="folderId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="flex items-center gap-1.5">
                    <Folder size={14} className="text-white" />
                    Folder Destination
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {dbFolders.map((f) => {
                      const isSelected =
                        field.value === f.id || field.value === f.name
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => field.onChange(f.id)}
                          className={cn(
                            'group flex cursor-pointer items-center justify-between rounded-lg border p-2 text-left text-xs transition-all outline-none',
                            isSelected
                              ? 'border-ns-primary bg-ns-primary/15 font-semibold text-white shadow-xs ring-1 ring-ns-primary/50'
                              : 'border-ns-border/70 bg-ns-panel/40 text-ns-text/80 hover:border-ns-border-md hover:bg-ns-hover/50 hover:text-white'
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Folder
                              size={13}
                              style={{ color: f.color ?? '#60a5fa' }}
                              className="shrink-0"
                            />
                            <span className="truncate">{f.name}</span>
                          </div>
                          {isSelected && (
                            <Check
                              size={12}
                              strokeWidth={2.5}
                              className="shrink-0 text-ns-primary-lt"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            />

            {/* Tags Selection */}
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
                      <TagIcon size={14} className="text-white" />
                      Topic Tags
                    </FieldLabel>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dbTags.length === 0 ? (
                        <p className="text-xs text-ns-ghost/70 italic">
                          No tags created yet.
                        </p>
                      ) : (
                        dbTags.map((t) => {
                          const isSelected = selectedTags.includes(t.name)
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => toggleTag(t.name)}
                              className={cn(
                                'flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all outline-none',
                                isSelected
                                  ? 'border-purple-500/60 bg-purple-500/20 text-white shadow-xs ring-1 ring-purple-500/40'
                                  : 'border-ns-border/60 bg-ns-panel/40 text-ns-muted hover:border-ns-border-md hover:bg-ns-hover/50 hover:text-white'
                              )}
                            >
                              <span className="font-mono text-purple-400">
                                #
                              </span>
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
                        })
                      )}
                    </div>
                  </Field>
                )
              }}
            />

            {/* Pinned & Favorite Quick Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Controller
                name="isPinned"
                control={form.control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition-all',
                      field.value
                        ? 'border-ns-primary/50 bg-ns-primary/10 text-white'
                        : 'border-ns-border/60 bg-ns-surface/50 text-ns-ghost hover:border-ns-border hover:text-ns-text'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Pin
                        size={13}
                        className={cn(
                          'transition-colors',
                          field.value
                            ? 'fill-ns-primary-lt text-ns-primary-lt'
                            : 'text-ns-ghost'
                        )}
                      />
                      <span className="font-medium">Pinned Note</span>
                    </div>
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full border transition-all',
                        field.value
                          ? 'border-ns-primary bg-ns-primary text-white'
                          : 'border-ns-border opacity-30'
                      )}
                    >
                      {field.value && <Check size={10} strokeWidth={3} />}
                    </div>
                  </button>
                )}
              />

              <Controller
                name="isFavorite"
                control={form.control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition-all',
                      field.value
                        ? 'border-amber-500/50 bg-amber-500/10 text-white'
                        : 'border-ns-border/60 bg-ns-surface/50 text-ns-ghost hover:border-ns-border hover:text-ns-text'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Star
                        size={13}
                        className={cn(
                          'transition-colors',
                          field.value
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-ns-ghost'
                        )}
                      />
                      <span className="font-medium">Favorite</span>
                    </div>
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full border transition-all',
                        field.value
                          ? 'border-amber-400 bg-amber-400 text-black'
                          : 'border-ns-border opacity-30'
                      )}
                    >
                      {field.value && <Check size={10} strokeWidth={3} />}
                    </div>
                  </button>
                )}
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
                  <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>{isEdit ? 'Save Changes' : 'Create Note'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const NoteModal = React.memo(NoteModalComponent)
