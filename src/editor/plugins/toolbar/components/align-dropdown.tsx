import { FORMAT_ELEMENT_COMMAND } from 'lexical'
import type { ElementFormatType, LexicalEditor } from 'lexical'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'

const ALIGN_CONFIGS: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  left: { label: 'Left align', icon: AlignLeft },
  center: { label: 'Center align', icon: AlignCenter },
  right: { label: 'Right align', icon: AlignRight },
  justify: { label: 'Justify align', icon: AlignJustify },
}

export function AlignDropdown({
  editor,
  elementFormat = 'left',
  disabled = false,
}: {
  editor: LexicalEditor
  elementFormat: ElementFormatType
  disabled?: boolean
}) {
  const currentConfig = ALIGN_CONFIGS[elementFormat] || ALIGN_CONFIGS.left
  const CurrentIcon = currentConfig.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="h-8 w-8 hover:bg-muted"
          title={currentConfig.label}
        >
          <CurrentIcon className="h-4 w-4 text-muted-foreground" />
          <ChevronDown className="ml-0.5 h-2.5 w-2.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuItem
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          className={elementFormat === 'left' ? 'bg-accent font-medium' : ''}
        >
          <AlignLeft className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Left align</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }
          className={elementFormat === 'center' ? 'bg-accent font-medium' : ''}
        >
          <AlignCenter className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Center align</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }
          className={elementFormat === 'right' ? 'bg-accent font-medium' : ''}
        >
          <AlignRight className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Right align</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }
          className={elementFormat === 'justify' ? 'bg-accent font-medium' : ''}
        >
          <AlignJustify className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Justify</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
