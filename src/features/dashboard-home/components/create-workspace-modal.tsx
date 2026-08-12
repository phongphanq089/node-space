import { useEffect } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Layers, Palette, Sparkles, Loader2, AlignLeft } from 'lucide-react'
import { useCreateWorkspaceMutation } from '../hooks/use-workspaces'
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

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Workspace name is required.')
    .max(50, 'Workspace name must be at most 50 characters.'),
  color: z.string().optional(),
  description: z.string().optional(),
})

export type CreateWorkspaceSchemaValues = z.infer<typeof createWorkspaceSchema>

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const createWorkspaceMutation = useCreateWorkspaceMutation()

  const form = useForm<CreateWorkspaceSchemaValues>({
    resolver: zodResolver(createWorkspaceSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      color: DEFAULT_PRESET_COLORS[0],
      description: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: '',
        color: DEFAULT_PRESET_COLORS[0],
        description: '',
      })
    }
  }, [isOpen, form])

  const handleSubmit = async (data: CreateWorkspaceSchemaValues) => {
    try {
      await createWorkspaceMutation.mutateAsync({
        name: data.name,
        color: data.color,
        description: data.description,
      })
      onClose()
    } catch {
      // Error handled in mutation toast
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[90vh] sm:max-w-md">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />
        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              <Layers size={19} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                Create Workspace
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                Set up a dedicated environment for your projects
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex min-h-0 flex-1 flex-col pt-2"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto pt-1 pr-1.5">
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
                    />
                  </div>
                </div>
              )}
            />
          </div>

          <DialogFooter className="-mx-0 mt-4 -mb-0 flex shrink-0 items-center justify-end gap-2 rounded-none border-t border-ns-border-soft bg-transparent p-0 pt-3">
            <DialogClose asChild>
              <Button variant={'outline'} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createWorkspaceMutation.isPending}>
              {createWorkspaceMutation.isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>
                {createWorkspaceMutation.isPending
                  ? 'Creating...'
                  : 'Create Workspace'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
