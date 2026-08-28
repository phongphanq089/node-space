import { $isCodeNode } from '@lexical/code'
import { $isListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $getSelectionStyleValueForProperty } from '@lexical/selection'
import { $getNearestNodeOfType } from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  Bold,
  Code,
  Eraser,
  Indent,
  Italic,
  Outdent,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import * as React from 'react'

import {
  blockTypeToBlockName,
  useToolbarState,
} from '../../core/context/toolbar-context'
import { cn } from '../../utils/cn'
import { getSelectedNode } from '../../utils/get-selected-node'
import { AlignDropdown } from './components/align-dropdown'
import { BlockFormatDropdown } from './components/block-format-dropdown'
import { ColorPickerPopover } from './components/color-picker'
import { FontSizeControl } from './components/font-size-control'
import { InsertDropdown } from './components/insert-dropdown'
import { clearFormatting } from './utils'
import { Button } from '@/editor/components/ui/button'
import { Separator } from '@/editor/components/ui/separator'

export function ToolbarPlugin({
  onUploadImage,
  className,
}: {
  onUploadImage?: (file: File) => Promise<string>
  className?: string
}) {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, updateToolbarState } = useToolbarState()
  const [isEditable, setIsEditable] = React.useState(() => editor.isEditable())

  const $updateToolbar = React.useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()

      // Update text format flags
      updateToolbarState('isBold', selection.hasFormat('bold'))
      updateToolbarState('isItalic', selection.hasFormat('italic'))
      updateToolbarState('isUnderline', selection.hasFormat('underline'))
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough')
      )
      updateToolbarState('isCode', selection.hasFormat('code'))
      updateToolbarState('isSubscript', selection.hasFormat('subscript'))
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'))

      // Update font size and colors
      const fontSize = $getSelectionStyleValueForProperty(
        selection,
        'font-size',
        '16px'
      )
      updateToolbarState('fontSize', fontSize)

      const fontColor = $getSelectionStyleValueForProperty(
        selection,
        'color',
        '#000000'
      )
      updateToolbarState('fontColor', fontColor)

      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        'background-color',
        ''
      )
      updateToolbarState('bgColor', bgColor)

      // Update block type
      if ($isListNode(parent)) {
        const listType = parent.getListType()
        updateToolbarState(
          'blockType',
          listType as keyof typeof blockTypeToBlockName
        )
      } else if ($isHeadingNode(parent)) {
        const tag = parent.getTag()
        updateToolbarState(
          'blockType',
          tag as keyof typeof blockTypeToBlockName
        )
      } else if ($isHeadingNode(node)) {
        const tag = node.getTag()
        updateToolbarState(
          'blockType',
          tag as keyof typeof blockTypeToBlockName
        )
      } else if ($isCodeNode(parent)) {
        updateToolbarState('blockType', 'code')
      } else {
        const type = $isElementNode(node) ? node.getType() : parent?.getType()
        if (type && type in blockTypeToBlockName) {
          updateToolbarState(
            'blockType',
            type as keyof typeof blockTypeToBlockName
          )
        } else {
          updateToolbarState('blockType', 'paragraph')
        }
      }

      // Update element format / text alignment
      const matchingParent = $isRootOrShadowRoot(parent)
        ? node
        : $getNearestNodeOfType(node, ElementNode)

      if (matchingParent && $isElementNode(matchingParent)) {
        updateToolbarState('elementFormat', matchingParent.getFormatType())
      }
    }
  }, [updateToolbarState])

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, $updateToolbar])

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar()
      })
    })
  }, [editor, $updateToolbar])

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        updateToolbarState('canUndo', payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbarState])

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        updateToolbarState('canRedo', payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbarState])

  React.useEffect(() => {
    return editor.registerEditableListener((editable) => {
      setIsEditable(editable)
    })
  }, [editor])

  return (
    <div
      className={cn(
        'sticky top-0 z-20 flex flex-wrap items-center gap-1 rounded-t-lg border-b border-border bg-background/95 p-1.5 backdrop-blur-xs select-none supports-backdrop-filter:bg-background/60',
        className
      )}
    >
      {/* 1. History (Undo / Redo) */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!toolbarState.canUndo || !isEditable}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="h-8 w-8 hover:bg-muted"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!toolbarState.canRedo || !isEditable}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="h-8 w-8 hover:bg-muted"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" />

      {/* 2. Block Formatting */}
      <BlockFormatDropdown
        editor={editor}
        blockType={toolbarState.blockType}
        disabled={!isEditable}
      />

      {/* 3. Font Size Control */}
      <FontSizeControl
        editor={editor}
        fontSize={toolbarState.fontSize}
        disabled={!isEditable}
      />

      <Separator orientation="vertical" />

      {/* 4. Text Formats */}
      <div className="flex items-center gap-0.5">
        <Button
          variant={toolbarState.isBold ? 'secondary' : 'ghost'}
          size="icon-sm"
          disabled={!isEditable}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={cn(
            'h-8 w-8',
            toolbarState.isBold && 'bg-accent font-bold text-accent-foreground'
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={toolbarState.isItalic ? 'secondary' : 'ghost'}
          size="icon-sm"
          disabled={!isEditable}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={cn(
            'h-8 w-8',
            toolbarState.isItalic && 'bg-accent text-accent-foreground'
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={toolbarState.isUnderline ? 'secondary' : 'ghost'}
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }
          className={cn(
            'h-8 w-8',
            toolbarState.isUnderline && 'bg-accent text-accent-foreground'
          )}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant={toolbarState.isStrikethrough ? 'secondary' : 'ghost'}
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }
          className={cn(
            'h-8 w-8',
            toolbarState.isStrikethrough && 'bg-accent text-accent-foreground'
          )}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={toolbarState.isCode ? 'secondary' : 'ghost'}
          size="icon-sm"
          disabled={!isEditable}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          className={cn(
            'h-8 w-8',
            toolbarState.isCode && 'bg-accent text-accent-foreground'
          )}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" />

      {/* 5. Colors */}
      <div className="flex items-center gap-0.5">
        <ColorPickerPopover
          editor={editor}
          type="font"
          currentColor={toolbarState.fontColor}
          disabled={!isEditable}
        />
        <ColorPickerPopover
          editor={editor}
          type="background"
          currentColor={toolbarState.bgColor}
          disabled={!isEditable}
        />
      </div>

      <Separator orientation="vertical" />

      {/* 6. Alignment & Indent */}
      <div className="flex items-center gap-0.5">
        <AlignDropdown
          editor={editor}
          elementFormat={toolbarState.elementFormat}
          disabled={!isEditable}
        />

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }
          className="h-8 w-8 hover:bg-muted"
          title="Decrease indent"
        >
          <Outdent className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }
          className="h-8 w-8 hover:bg-muted"
          title="Increase indent"
        >
          <Indent className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" />

      {/* 7. Insert Objects */}
      <InsertDropdown
        editor={editor}
        onUploadImage={onUploadImage}
        disabled={!isEditable}
      />

      <Separator orientation="vertical" />

      {/* 8. Clear Formatting */}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!isEditable}
        onClick={() => clearFormatting(editor)}
        className="h-8 w-8 hover:bg-muted"
        title="Clear formatting"
      >
        <Eraser className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  )
}

export default ToolbarPlugin
