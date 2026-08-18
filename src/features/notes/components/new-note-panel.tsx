import * as React from 'react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FilePlus,
  Hash,
  Pin,
  X,
  ChevronDown,
  Search,
  Check,
  Layers,
} from 'lucide-react'

import { NOTEBOOKS, POPULAR_TAGS } from '@/shared/mocks/mock-data'
import { newNoteSchema } from '../note.validate'
import type { NewNoteValues } from '../note.validate'
import { useNewNoteDialogStore } from '../store/use-new-note-dialog-store'
import { useNoteDetailModalStore } from '../store/use-note-detail-modal-store'
import { cn } from '@/shared/lib/utils'
import {
  Button,
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useComboboxAnchor,
} from '@/shared/ui'

/* ─── Custom Searchable Combobox Component ───────────────────────────── */
interface CustomComboboxProps {
  id?: string
  value?: string
  onChange: (val: string) => void
  options: { id: string; name: string; color?: string | null }[]
  placeholder: string
  searchPlaceholder?: string
  icon?: React.ReactNode
  error?: boolean
}

function CustomCombobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Search…',
  icon,
  error,
}: CustomComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const selectedItem = useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return options
    return options.filter((opt) => opt.name.toLowerCase().includes(query))
  }, [options, search])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Focus search input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearch('')
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border bg-ns-surface/60 px-3 py-2 text-xs transition-all',
          'hover:border-ns-border-md hover:bg-ns-surface focus:ring-2 focus:ring-ns-primary/40 focus:outline-none',
          error
            ? 'border-destructive ring-destructive/20'
            : 'border-ns-border text-ns-text',
          open && 'border-ns-primary/60 ring-2 ring-ns-primary/20'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {selectedItem?.color ? (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full shadow-xs"
              style={{ background: selectedItem.color }}
            />
          ) : (
            icon && <span className="shrink-0 text-ns-ghost">{icon}</span>
          )}
          <span
            className={cn(
              'truncate font-medium',
              selectedItem ? 'text-white' : 'text-ns-ghost'
            )}
          >
            {selectedItem ? selectedItem.name : placeholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 text-ns-ghost transition-transform duration-200',
            open && 'rotate-180 text-ns-primary-lt'
          )}
        />
      </button>

      {/* Floating Dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1.5 flex max-h-60 w-full animate-in flex-col overflow-hidden rounded-xl border border-ns-border-md bg-ns-panel/95 p-1.5 shadow-2xl backdrop-blur-2xl duration-150 fade-in-0 zoom-in-95">
          {/* Search Box */}
          <div className="relative mb-1 flex items-center border-b border-ns-border-soft px-2.5 py-1.5">
            <Search size={13} className="mr-2 shrink-0 text-ns-ghost" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-white placeholder:text-ns-ghost focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="cursor-pointer text-ns-ghost hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List Options */}
          <div className="no-scrollbar flex-1 overflow-y-auto py-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-ns-ghost">
                No results found
              </div>
            ) : (
              filteredOptions.map((item) => {
                const isSelected = item.id === value
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                      isSelected
                        ? 'bg-ns-primary/20 font-semibold text-ns-primary-lt'
                        : 'text-ns-text hover:bg-ns-hover hover:text-white'
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {item.color ? (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: item.color }}
                        />
                      ) : (
                        <span className="shrink-0 text-ns-ghost/70">
                          {icon}
                        </span>
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>
                    {isSelected && (
                      <Check
                        size={13}
                        className="shrink-0 text-ns-primary-lt"
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main NewNotePanel (Embedded inside NoteDetailModal) ─────────────── */
interface NewNotePanelProps {
  onSubmit?: (values: NewNoteValues) => void
  defaultFolderId?: string
}

export function NewNotePanel({ onSubmit, defaultFolderId }: NewNotePanelProps) {
  const { isOpen, close } = useNewNoteDialogStore()
  const { node } = useNoteDetailModalStore()
  const anchor = useComboboxAnchor()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const currentFolderId = defaultFolderId ?? node?.folderId ?? ''

  const form = useForm<NewNoteValues>({
    resolver: zodResolver(newNoteSchema as any),
    defaultValues: {
      name: '',
      folder_id: currentFolderId,
      workspace_id: '',
      tags: [],
      isPinned: false,
    },
  })

  // Smooth mount and slide-in transition & sync folder_id
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      form.setValue('folder_id', currentFolderId)
      const raf = requestAnimationFrame(() => {
        setVisible(true)
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, currentFolderId, form])

  const tagOptions = useMemo(() => POPULAR_TAGS.map((t) => t.name), [])

  const workspaceOptions = useMemo(
    () =>
      NOTEBOOKS.map((nb) => ({
        id: nb.id,
        name: nb.name,
      })),
    []
  )

  const handleClose = () => {
    close()
    form.reset({
      name: '',
      folder_id: currentFolderId,
      workspace_id: '',
      tags: [],
      isPinned: false,
    })
  }

  const handleSubmit = (data: NewNoteValues) => {
    const finalData: NewNoteValues = {
      ...data,
      folder_id: data.folder_id || currentFolderId,
    }
    onSubmit?.(finalData)
    handleClose()
  }

  if (!mounted) return null

  return (
    <TooltipProvider delayDuration={200}>
      <div className="pointer-events-auto absolute inset-0 z-50 overflow-hidden">
        {/* Backdrop inside modal with smooth fade */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-out',
            visible ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Slide-in Panel from Right */}
        <aside
          className={cn(
            'absolute top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-ns-border/60 bg-ns-panel shadow-2xl transition-transform duration-300 ease-out',
            visible ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ns-border-soft/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ns-primary/15 text-ns-primary-lt">
                <FilePlus size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">New Note</h3>
                <p className="text-[0.68rem] text-ns-ghost">
                  Create and organize your note
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Pin Toggle Button with Tooltip */}
              <Controller
                name="isPinned"
                control={form.control}
                render={({ field }) => (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all',
                          field.value
                            ? 'border border-ns-primary/40 bg-ns-primary/20 text-ns-primary-lt shadow-xs'
                            : 'text-ns-ghost hover:bg-ns-hover hover:text-white'
                        )}
                        aria-label={
                          field.value ? 'Unpin note' : 'Pin this note'
                        }
                      >
                        <Pin
                          size={14}
                          className={cn(
                            'transition-transform duration-200',
                            field.value
                              ? 'rotate-45 fill-ns-primary-lt text-ns-primary-lt'
                              : 'hover:rotate-12'
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{field.value ? 'Unpin note' : 'Pin this note'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              />

              {/* Close Button with Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-ns-ghost transition-colors hover:bg-ns-hover hover:text-white"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
            <form
              id="new-note-inline-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-5"
            >
              <FieldGroup className="gap-4">
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
                        className="h-10 bg-ns-surface/60 text-sm focus:bg-ns-surface"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Workspace Combobox */}
                <Controller
                  name="workspace_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="note-workspace">
                        Workspace
                      </FieldLabel>
                      <CustomCombobox
                        id="note-workspace"
                        value={field.value}
                        onChange={field.onChange}
                        options={workspaceOptions}
                        placeholder="Select workspace"
                        searchPlaceholder="Search workspace…"
                        icon={<Layers size={12} />}
                        error={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Tags Combobox */}
                <Controller
                  name="tags"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        <Hash size={11} className="mr-0.5 text-ns-ghost" />
                        Tags
                      </FieldLabel>

                      <Combobox
                        multiple
                        autoHighlight
                        items={tagOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxChips
                          ref={anchor}
                          className="min-h-10 w-full border-ns-border bg-ns-surface/60 text-xs transition-colors focus-within:border-ns-primary/50 focus-within:ring-2 focus-within:ring-ns-primary/20"
                        >
                          <ComboboxValue>
                            {(values: string[]) => (
                              <React.Fragment>
                                {values.map((value: string) => (
                                  <ComboboxChip key={value}>
                                    {value}
                                  </ComboboxChip>
                                ))}
                                <ComboboxChipsInput
                                  placeholder={
                                    values.length === 0 ? 'Add tags…' : ''
                                  }
                                />
                              </React.Fragment>
                            )}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: string) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-ns-border-soft/40 bg-ns-bg/30 px-5 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form="new-note-inline-form"
              className="cursor-pointer bg-ns-primary font-semibold text-white shadow-md hover:bg-ns-primary/85"
            >
              Create Note
            </Button>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  )
}

export default NewNotePanel
