import type { LexicalEditor } from 'lexical'
import { Minus, Plus } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  DEFAULT_FONT_SIZE,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
} from '../../../core/context/toolbar-context'
import { updateFontSize, UpdateFontSizeType } from '../utils'

export function FontSizeControl({
  editor,
  fontSize,
  disabled = false,
}: {
  editor: LexicalEditor
  fontSize: string
  disabled?: boolean
}) {
  const currentSizeNumber = parseInt(fontSize, 10) || DEFAULT_FONT_SIZE

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-input bg-background/50 p-0.5">
      <Button
        variant="ghost"
        size="icon-xs"
        disabled={disabled || currentSizeNumber <= MIN_ALLOWED_FONT_SIZE}
        onClick={() =>
          updateFontSize(
            editor,
            UpdateFontSizeType.decrement,
            currentSizeNumber
          )
        }
        className="h-6 w-6 rounded-xs hover:bg-muted"
        title="Decrease font size"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <span className="min-w-[28px] text-center text-xs font-medium text-foreground select-none">
        {currentSizeNumber}
      </span>

      <Button
        variant="ghost"
        size="icon-xs"
        disabled={disabled || currentSizeNumber >= MAX_ALLOWED_FONT_SIZE}
        onClick={() =>
          updateFontSize(
            editor,
            UpdateFontSizeType.increment,
            currentSizeNumber
          )
        }
        className="h-6 w-6 rounded-xs hover:bg-muted"
        title="Increase font size"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
