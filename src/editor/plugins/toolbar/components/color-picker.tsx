import { Button } from '@/editor/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/editor/components/ui/popover'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import type { LexicalEditor } from 'lexical'
import { Baseline, Highlighter } from 'lucide-react'
import * as React from 'react'

const COLOR_PALETTE = [
  '#000000',
  '#374151',
  '#6b7280',
  '#9ca3af',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
  '#fee2e2',
  '#ffedd5',
  '#fef3c7',
  '#d1fae5',
  '#cffafe',
  '#dbeafe',
  '#e0e7ff',
  '#ede9fe',
  '#fce7f3',
]

export function ColorPickerPopover({
  editor,
  type,
  currentColor,
  disabled = false,
}: {
  editor: LexicalEditor
  type: 'font' | 'background'
  currentColor: string
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  const applyColor = React.useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          if (type === 'font') {
            $patchStyleText(selection, { color })
          } else {
            $patchStyleText(selection, { 'background-color': color })
          }
        }
      })
      setOpen(false)
    },
    [editor, type]
  )

  const Icon = type === 'font' ? Baseline : Highlighter
  const label = type === 'font' ? 'Text Color' : 'Highlight Color'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="relative h-8 w-8 hover:bg-muted"
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span
            className="absolute right-2 bottom-1 left-2 h-0.5 rounded-full"
            style={{
              backgroundColor:
                currentColor || (type === 'font' ? '#000000' : 'transparent'),
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2.5" align="start">
        <div className="mb-2 text-xs font-semibold text-muted-foreground">
          {label}
        </div>

        <div className="mb-3 grid grid-cols-6 gap-1.5">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => applyColor(color)}
              className="h-6 w-6 rounded-md border border-border/60 transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyColor('')}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <span>Custom</span>
            <input
              type="color"
              value={currentColor || '#000000'}
              onChange={(e) => applyColor(e.target.value)}
              className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  )
}
