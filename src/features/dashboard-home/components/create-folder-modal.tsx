import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderPlus, Palette, Layers, Sparkles, Upload } from 'lucide-react'
import { WORKSPACES } from '@/constants/moc-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/core/dialog'
import { Input } from '@/components/ui/core/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/core/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/core/select'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import type { FilePondInitialFile } from 'filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImagePreview)

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Folder name is required.')
    .max(50, 'Folder name must be at most 50 characters.'),
  workspaceId: z.string().min(1, 'Workspace is required.'),
  color: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL',
    }),
})

export type CreateFolderSchemaValues = z.infer<typeof createFolderSchema>

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: {
    name: string
    workspaceId?: string
    color?: string
    image?: string
    files?: File[]
  }) => void
}

const PRESET_COLORS = [
  '#a78bfa',
  '#34d399',
  '#60a5fa',
  '#f87171',
  '#f97316',
  '#fbbf24',
  '#ec4899',
  '#38bdf8',
]

export function CreateFolderModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateFolderModalProps) {
  const [files, setFiles] = useState<FilePondInitialFile[] | any[]>([])

  const form = useForm<CreateFolderSchemaValues>({
    resolver: zodResolver(createFolderSchema as any),
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      workspaceId: WORKSPACES[0]?.name ?? '',
      color: PRESET_COLORS[0],
      image: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: '',
        workspaceId: WORKSPACES[0]?.name ?? '',
        color: PRESET_COLORS[0],
        image: '',
      })
      setFiles([])
    }
  }, [isOpen, form])

  const selectedColor = form.watch('color') || PRESET_COLORS[0]

  const handleSubmit = (data: CreateFolderSchemaValues) => {
    if (onSubmit) {
      onSubmit({
        name: data.name,
        workspaceId: data.workspaceId,
        color: data.color,
        image: data.image,
        files: files
          .map((f) => (f instanceof File ? f : f?.file))
          .filter((f): f is File => f instanceof File),
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-w-md">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />
        <DialogHeader className="gap-1 border-b border-ns-border-soft pb-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
              <FolderPlus size={19} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                Create New Folder
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                Organize your nodes & notes into a dedicated folder
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 pt-2"
        >
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
          <Controller
            name="workspaceId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center gap-1.5">
                  <Layers size={11} className="text-ns-ghost" />
                  Workspace
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKSPACES.map((ws) => (
                      <SelectItem key={ws.name} value={ws.name}>
                        {ws.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="flex items-center gap-1.5">
              <Palette size={11} className="text-ns-ghost" />
              Accent Color
            </FieldLabel>
            <div className="flex items-center gap-2 py-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => form.setValue('color', c)}
                  style={{ backgroundColor: c }}
                  className={`h-6 w-6 cursor-pointer rounded-full transition-all hover:scale-110 ${
                    selectedColor === c
                      ? 'scale-110 ring-2 ring-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="flex items-center gap-1.5">
              <Upload size={11} className="text-ns-ghost" />
              Attach Files / Assets{' '}
              <span className="text-[0.6rem] font-normal text-ns-faint">
                (Optional)
              </span>
            </FieldLabel>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              allowImagePreview={true}
              acceptedFileTypes={['image/*']}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              labelFileTypeNotAllowed="File is of invalid type"
              credits={false}
            />
          </div>

          {/* Modal Actions */}
          <DialogFooter className="-mx-0 mt-2 -mb-0 flex items-center justify-end gap-2 rounded-none border-t border-ns-border-soft bg-transparent p-0 pt-3">
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer rounded-xl border border-ns-border-soft px-4 py-2 text-xs font-semibold text-ns-ghost transition-all hover:bg-ns-hover hover:text-white"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-ns-primary to-ns-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-ns-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              <Sparkles size={13} />
              <span>Create Folder</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
