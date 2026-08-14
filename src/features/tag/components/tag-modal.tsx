import { useEffect } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tag, Sparkles, Loader2 } from 'lucide-react'
import { useCreateTagMutation, useUpdateTagMutation } from '../hooks/use-tags'
import type { TagRecord } from '../tag.fns'
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

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tag name is required.')
    .max(30, 'Tag name must be at most 30 characters.'),
})

export type TagFormValues = z.infer<typeof tagFormSchema>

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  tagItem?: TagRecord | null
}

export function TagModal({ isOpen, onClose, tagItem }: TagModalProps) {
  const isEditing = Boolean(tagItem)
  const createMutation = useCreateTagMutation()
  const updateMutation = useUpdateTagMutation()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema as any),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: tagItem?.name || '',
      })
    }
  }, [isOpen, tagItem, form])

  const handleSubmit = async (data: TagFormValues) => {
    try {
      if (isEditing && tagItem) {
        await updateMutation.mutateAsync({
          tagId: tagItem.id,
          name: data.name,
        })
      } else {
        await createMutation.mutateAsync({
          name: data.name,
        })
      }
      onClose()
    } catch {
      // Handled in mutation toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-w-md">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-inner">
              <Tag size={19} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                {isEditing ? 'Edit Topic Tag' : 'Create Topic Tag'}
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                {isEditing
                  ? 'Update tag name for topic classification'
                  : 'Add a new hashtag to organize your folders and workspaces'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5 pt-3"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Tag Name <span className="text-red-400">*</span>
                </FieldLabel>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-sm font-bold text-purple-400">
                    #
                  </span>
                  <Input
                    {...field}
                    placeholder="e.g. productivity, tech, design..."
                    className="pl-7"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter className="-mx-0 mt-4 -mb-0 flex shrink-0 items-center justify-end gap-2 rounded-none border-t border-ns-border-soft bg-transparent p-0 pt-3">
            <DialogClose asChild>
              <Button variant="outline" type="button">
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
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Tag'
                    : 'Create Tag'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
