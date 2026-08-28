import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $patchStyleText, $setBlocksType } from '@lexical/selection'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { $isCodeNode } from '@lexical/code'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  Link2,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { getSelectedNode } from '../../utils/get-selected-node'

// Individual pill-button
function FloatBtn({
  children,
  active = false,
  title,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        'relative inline-flex size-7 items-center justify-center rounded-md transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'text-foreground/80 hover:bg-foreground/10 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function FloatDivider() {
  return <span className="h-4 w-px shrink-0 rounded-full bg-border" />
}

export function FloatingToolbarPlugin({
  anchorElem = typeof document !== 'undefined' ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}) {
  const [editor] = useLexicalComposerContext()
  const popupRef = React.useRef<HTMLDivElement | null>(null)

  const [isText, setIsText] = React.useState(false)
  const [isBold, setIsBold] = React.useState(false)
  const [isItalic, setIsItalic] = React.useState(false)
  const [isUnderline, setIsUnderline] = React.useState(false)
  const [isStrikethrough, setIsStrikethrough] = React.useState(false)
  const [isCode, setIsCode] = React.useState(false)
  const [isLink, setIsLink] = React.useState(false)
  const [isHighlight, setIsHighlight] = React.useState(false)

  const updateFloatingToolbar = React.useCallback(() => {
    const selection = $getSelection()
    const nativeSelection = window.getSelection()
    const popup = popupRef.current

    if (!popup || !editor.isEditable()) return

    if (
      $isRangeSelection(selection) &&
      !selection.isCollapsed() &&
      nativeSelection &&
      nativeSelection.rangeCount > 0
    ) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()

      if ($isCodeNode(node) || $isCodeNode(parent)) {
        setIsText(false)
        return
      }

      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))
      setIsLink($isLinkNode(parent) || $isLinkNode(node))
      setIsHighlight(
        selection.hasFormat('highlight') ||
          Boolean(node.getStyle && node.getStyle().includes('background-color'))
      )

      const domRange = nativeSelection.getRangeAt(0)
      const rect = domRange.getBoundingClientRect()

      if (rect.width > 0 && rect.height > 0) {
        setIsText(true)
        // Position: centered above selection, 10px gap
        const top = rect.top - 44 + window.scrollY
        const left =
          rect.left +
          rect.width / 2 -
          (popup.offsetWidth || 240) / 2 +
          window.scrollX
        popup.style.top = `${Math.max(8, top)}px`
        popup.style.left = `${Math.max(8, left)}px`
        return
      }
    }
    setIsText(false)
  }, [editor])

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateFloatingToolbar())
    })
  }, [editor, updateFloatingToolbar])

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateFloatingToolbar()
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor, updateFloatingToolbar])

  React.useEffect(() => {
    const onScrollResize = () => {
      if (isText) editor.getEditorState().read(() => updateFloatingToolbar())
    }
    window.addEventListener('resize', onScrollResize)
    window.addEventListener('scroll', onScrollResize, true)
    return () => {
      window.removeEventListener('resize', onScrollResize)
      window.removeEventListener('scroll', onScrollResize, true)
    }
  }, [editor, isText, updateFloatingToolbar])

  if (!anchorElem || !isText) return null

  return createPortal(
    <div
      ref={popupRef}
      role="toolbar"
      aria-label="Text format"
      className="fixed z-50 flex animate-in items-center gap-0.5 rounded-lg border border-border/70 bg-popover p-1 shadow-xl ring-1 ring-black/5 duration-100 fade-in-0 zoom-in-95"
      style={{ pointerEvents: 'auto' }}
    >
      <FloatBtn
        active={isBold}
        title="Bold (Ctrl+B)"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        <Bold className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        active={isItalic}
        title="Italic (Ctrl+I)"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        <Italic className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        active={isUnderline}
        title="Underline"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <Underline className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        active={isStrikethrough}
        title="Strikethrough"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }
      >
        <Strikethrough className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        active={isCode}
        title="Inline Code"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
      >
        <Code className="size-3.5" />
      </FloatBtn>

      <FloatDivider />

      <FloatBtn
        title="Heading 1"
        onClick={() =>
          editor.update(() => {
            const sel = $getSelection()
            if ($isRangeSelection(sel))
              $setBlocksType(sel, () => $createHeadingNode('h1'))
          })
        }
      >
        <Heading1 className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        title="Heading 2"
        onClick={() =>
          editor.update(() => {
            const sel = $getSelection()
            if ($isRangeSelection(sel))
              $setBlocksType(sel, () => $createHeadingNode('h2'))
          })
        }
      >
        <Heading2 className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        title="Quote"
        onClick={() =>
          editor.update(() => {
            const sel = $getSelection()
            if ($isRangeSelection(sel))
              $setBlocksType(sel, () => $createQuoteNode())
          })
        }
      >
        <Quote className="size-3.5" />
      </FloatBtn>

      <FloatDivider />

      <FloatBtn
        active={isHighlight}
        title="Highlight"
        onClick={() =>
          editor.update(() => {
            const sel = $getSelection()
            if ($isRangeSelection(sel)) {
              $patchStyleText(sel, {
                'background-color': isHighlight ? '' : '#fef08a',
              })
              setIsHighlight(!isHighlight)
            }
          })
        }
      >
        <Highlighter className="size-3.5" />
      </FloatBtn>

      <FloatBtn
        active={isLink}
        title="Link"
        onClick={() => {
          if (!isLink) {
            const url = prompt('Enter URL:')
            if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
          }
        }}
      >
        <Link2 className="size-3.5" />
      </FloatBtn>
    </div>,
    anchorElem
  )
}

export default FloatingToolbarPlugin
