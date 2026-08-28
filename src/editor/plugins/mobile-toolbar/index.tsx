/* eslint-disable @typescript-eslint/consistent-type-imports */
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $setBlocksType } from '@lexical/selection'
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
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import * as React from 'react'

// 44px touch-safe button with active dot indicator
function MobileBtn({
  children,
  onClick,
  title,
  active = false,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        'relative inline-flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground/60 hover:bg-muted/60 hover:text-foreground',
      ].join(' ')}
    >
      {children}
      {/* Active indicator dot */}
      {active && (
        <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
      )}
    </button>
  )
}

// Hairline vertical group divider
function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 rounded-full bg-border/60" />
}

export function MobileToolbarPlugin({
  onUploadImage: _onUploadImage,
}: {
  onUploadImage?: (file: File) => Promise<string>
}) {
  const [editor] = useLexicalComposerContext()

  const [isBold, setIsBold] = React.useState(false)
  const [isItalic, setIsItalic] = React.useState(false)
  const [isUnderline, setIsUnderline] = React.useState(false)
  const [isStrikethrough, setIsStrikethrough] = React.useState(false)
  const [isCode, setIsCode] = React.useState(false)

  const syncState = React.useCallback(() => {
    const sel = $getSelection()
    if ($isRangeSelection(sel)) {
      setIsBold(sel.hasFormat('bold'))
      setIsItalic(sel.hasFormat('italic'))
      setIsUnderline(sel.hasFormat('underline'))
      setIsStrikethrough(sel.hasFormat('strikethrough'))
      setIsCode(sel.hasFormat('code'))
    }
  }, [])

  React.useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(syncState)
      ),
    [editor, syncState]
  )

  React.useEffect(
    () =>
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          syncState()
          return false
        },
        1
      ),
    [editor, syncState]
  )

  const setBlock = (
    fn: () =>
      | import('@lexical/rich-text').HeadingNode
      | import('@lexical/rich-text').QuoteNode
  ) =>
    editor.update(() => {
      const sel = $getSelection()
      if ($isRangeSelection(sel)) $setBlocksType(sel, fn)
    })

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="sticky bottom-0 z-30 flex h-[52px] w-full scrollbar-none items-center gap-0 overflow-x-auto border-t border-border/60 bg-background px-1 select-none"
    >
      {/* Group 1 — History */}
      <MobileBtn
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        <Undo2 className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        <Redo2 className="size-5" />
      </MobileBtn>

      <Divider />

      {/* Group 2 — Inline formats */}
      <MobileBtn
        active={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold"
      >
        <Bold className="size-5" />
      </MobileBtn>
      <MobileBtn
        active={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic"
      >
        <Italic className="size-5" />
      </MobileBtn>
      <MobileBtn
        active={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline"
      >
        <Underline className="size-5" />
      </MobileBtn>
      <MobileBtn
        active={isStrikethrough}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }
        title="Strikethrough"
      >
        <Strikethrough className="size-5" />
      </MobileBtn>
      <MobileBtn
        active={isCode}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        title="Inline code"
      >
        <Code className="size-5" />
      </MobileBtn>

      <Divider />

      {/* Group 3 — Block types */}
      <MobileBtn
        onClick={() => setBlock(() => $createHeadingNode('h1'))}
        title="Heading 1"
      >
        <Heading1 className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() => setBlock(() => $createHeadingNode('h2'))}
        title="Heading 2"
      >
        <Heading2 className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() => setBlock(() => $createHeadingNode('h3'))}
        title="Heading 3"
      >
        <Heading3 className="size-5" />
      </MobileBtn>

      <Divider />

      {/* Group 4 — Lists */}
      <MobileBtn
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        title="Bullet list"
      >
        <List className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title="Numbered list"
      >
        <ListOrdered className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        }
        title="Checklist"
      >
        <ListTodo className="size-5" />
      </MobileBtn>
      <MobileBtn
        onClick={() => setBlock(() => $createQuoteNode())}
        title="Quote"
      >
        <Quote className="size-5" />
      </MobileBtn>
    </div>
  )
}

export default MobileToolbarPlugin
