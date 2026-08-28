import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '../../components/ui/button'
import { getSelectedNode } from '../../utils/get-selected-node'

// Minimal visual divider
function ToolbarDivider() {
  return <span className="mx-1 h-4 w-px shrink-0 rounded-full bg-border/60" />
}

export function BasicToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = React.useState(false)
  const [isItalic, setIsItalic] = React.useState(false)
  const [isUnderline, setIsUnderline] = React.useState(false)
  const [isLink, setIsLink] = React.useState(false)

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      const node = getSelectedNode(selection)
      const parent = node.getParent()
      setIsLink($isLinkNode(parent) || $isLinkNode(node))
    }
  }, [])

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar())
    })
  }, [editor, updateToolbar])

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      1
    )
  }, [editor, updateToolbar])

  return (
    <div
      className="flex h-9 items-center gap-0 border-b border-border/60 bg-muted/20 px-1.5 select-none"
      role="toolbar"
      aria-label="Text formatting"
    >
      {/* History */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Undo"
      >
        <Undo2 className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Redo"
      >
        <Redo2 className="size-3.5" />
      </Button>

      <ToolbarDivider />

      {/* Inline formats */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`size-7 ${isBold ? 'bg-foreground/10 font-bold text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`size-7 ${isItalic ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`size-7 ${isUnderline ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        title="Underline (Ctrl+U)"
      >
        <Underline className="size-3.5" />
      </Button>

      <ToolbarDivider />

      {/* Lists */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Bullet List"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Numbered List"
      >
        <ListOrdered className="size-3.5" />
      </Button>

      <ToolbarDivider />

      {/* Link */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          if (!isLink) {
            const url = prompt('Enter URL:')
            if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
          }
        }}
        className={`size-7 ${isLink ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
        title="Link"
      >
        <Link2 className="size-3.5" />
      </Button>
    </div>
  )
}

export default BasicToolbarPlugin
