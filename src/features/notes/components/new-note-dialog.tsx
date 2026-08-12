import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilePlus, Hash, Pin, X } from 'lucide-react'

import { useFoldersQuery } from '@/features/dashboard-home'
import { POPULAR_TAGS, NOTEBOOKS } from '@/shared/mocks/mock-data'
import { newNoteSchema } from '../note.validate'
import type { NewNoteValues } from '../note.validate'

import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from '@/shared/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/core/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/core/dialog'
import { cn } from '@/shared/lib/utils'

interface NewNoteDialogProps {
  trigger: React.ReactNode
  onSubmit?: (values: NewNoteValues) => void
}

export function NewNoteDialog({ trigger, onSubmit }: NewNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const { data: dbFolders = [] } = useFoldersQuery()

  const form = useForm<NewNoteValues>({
    resolver: zodResolver(newNoteSchema as any),
    defaultValues: {
      name: '',
      folder_id: '',
      workspace_id: '',
      tags: [],
      isPinned: false,
    },
  })

  const tags = form.watch('tags')
  const isPinned = form.watch('isPinned')

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
      setTagInput('')
    }
  }

  const handleSubmit = (data: NewNoteValues) => {
    onSubmit?.(data)
    setOpen(false)
    form.reset()
    setTagInput('')
  }

  const addTag = (name: string) => {
    const cleaned = name.replace(/^#/, '').trim().toLowerCase()
    if (!cleaned || tags.includes(cleaned) || tags.length >= 10) return
    form.setValue('tags', [...tags, cleaned])
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    form.setValue(
      'tags',
      tags.filter((t) => t !== tag)
    )
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md border border-ns-border-soft bg-ns-panel p-0 shadow-2xl sm:max-w-md"
      >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col"
        >
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between gap-3 border-b border-ns-border-soft/50 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ns-primary/15">
                <FilePlus size={15} className="text-ns-primary-lt" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-white">
                  New Note
                </DialogTitle>
                <p className="mt-0.5 text-[0.65rem] text-ns-ghost">
                  Add to your knowledge graph
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-colors hover:bg-ns-hover hover:text-white"
            >
              <X size={13} />
            </button>
          </DialogHeader>

          {/* Body */}
          <div className="px-5 py-5">
            <FieldGroup>
              {/* Title */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="note-name">Title</FieldLabel>
                    <Input
                      {...field}
                      id="note-name"
                      placeholder="Note title…"
                      autoFocus
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Folder + Workspace row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Folder */}
                <Controller
                  name="folder_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="note-folder">Folder</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="note-folder"
                          className="h-10 w-full border-ns-border bg-transparent text-sm"
                        >
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent className="z-[200] border-ns-border-soft bg-ns-panel text-ns-text">
                          {dbFolders.length === 0 ? (
                            <SelectItem
                              value="none"
                              disabled
                              className="text-xs text-ns-faint"
                            >
                              No folders available
                            </SelectItem>
                          ) : (
                            dbFolders.map((folder) => (
                              <SelectItem
                                key={folder.id}
                                value={folder.id}
                                className="text-xs focus:bg-ns-hover focus:text-white"
                              >
                                <span
                                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                                  style={{ background: folder.color ?? '#888' }}
                                />
                                {folder.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {/* Workspace */}
                <Controller
                  name="workspace_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="note-workspace">
                        Workspace
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="note-workspace"
                          className="h-10 w-full border-ns-border bg-transparent text-sm"
                        >
                          <SelectValue placeholder="Workspace" />
                        </SelectTrigger>
                        <SelectContent className="z-[200] border-ns-border-soft bg-ns-panel text-ns-text">
                          {NOTEBOOKS.map((nb) => (
                            <SelectItem
                              key={nb.id}
                              value={nb.id}
                              className="text-xs focus:bg-ns-hover focus:text-white"
                            >
                              {nb.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

              {/* Tags */}
              <Controller
                name="tags"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      <Hash size={11} className="mr-0.5 text-ns-ghost" />
                      Tags
                    </FieldLabel>

                    {/* Chip input */}
                    <div
                      className={cn(
                        'flex min-h-10 flex-wrap items-center gap-1.5 rounded-sm border border-ns-border bg-transparent px-2.5 py-1.5 transition-colors',
                        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                        fieldState.invalid && 'border-destructive'
                      )}
                    >
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded border border-ns-border-soft/60 bg-ns-primary/15 px-1.5 py-0.5 text-[0.65rem] font-medium text-ns-primary-lt"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="cursor-pointer text-ns-primary-lt/50 transition-colors hover:text-ns-primary-lt"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={tags.length === 0 ? 'Add tags…' : ''}
                        className="min-w-[72px] flex-1 bg-transparent text-sm text-ns-text outline-none placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Popular tag suggestions */}
                    {tags.length < 10 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {POPULAR_TAGS.filter((t) => !tags.includes(t.name))
                          .slice(0, 6)
                          .map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => addTag(t.name)}
                              className="cursor-pointer rounded border border-ns-border-soft/40 bg-ns-hover/30 px-2 py-0.5 text-[0.6rem] text-ns-ghost transition-colors hover:border-ns-primary/40 hover:bg-ns-primary/10 hover:text-ns-primary-lt"
                            >
                              #{t.name}
                            </button>
                          ))}
                      </div>
                    )}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Pin toggle */}
              <Controller
                name="isPinned"
                control={form.control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                      isPinned
                        ? 'border-ns-primary/40 bg-ns-primary/10 text-ns-primary-lt'
                        : 'border-ns-border text-muted-foreground hover:text-ns-text'
                    )}
                  >
                    <Pin
                      size={12}
                      className={isPinned ? 'fill-ns-primary-lt' : ''}
                    />
                    {isPinned ? 'Pinned' : 'Pin this note'}
                  </button>
                )}
              />
            </FieldGroup>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-ns-border-soft/40 bg-ns-bg/20 px-5 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleClose(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="cursor-pointer">
              Create Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
