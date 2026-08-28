import { $createCodeNode } from '@lexical/code'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import type { HeadingTagType } from '@lexical/rich-text'
import { $patchStyleText, $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from 'lexical'
import type { LexicalEditor } from 'lexical'

import {
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
} from '../../core/context/toolbar-context'

export enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

export const calculateNextFontSize = (
  currentFontSize: number,
  updateType: UpdateFontSizeType | null
) => {
  if (!updateType) {
    return currentFontSize
  }

  let updatedFontSize: number = currentFontSize
  switch (updateType) {
    case UpdateFontSizeType.decrement:
      if (currentFontSize > MAX_ALLOWED_FONT_SIZE) {
        updatedFontSize = MAX_ALLOWED_FONT_SIZE
      } else if (currentFontSize >= 48) {
        updatedFontSize -= 12
      } else if (currentFontSize >= 24) {
        updatedFontSize -= 4
      } else if (currentFontSize >= 14) {
        updatedFontSize -= 2
      } else if (currentFontSize >= 9) {
        updatedFontSize -= 1
      } else {
        updatedFontSize = MIN_ALLOWED_FONT_SIZE
      }
      break

    case UpdateFontSizeType.increment:
      if (currentFontSize < MIN_ALLOWED_FONT_SIZE) {
        updatedFontSize = MIN_ALLOWED_FONT_SIZE
      } else if (currentFontSize < 12) {
        updatedFontSize += 1
      } else if (currentFontSize < 20) {
        updatedFontSize += 2
      } else if (currentFontSize < 36) {
        updatedFontSize += 4
      } else if (currentFontSize <= 60) {
        updatedFontSize += 12
      } else {
        updatedFontSize = MAX_ALLOWED_FONT_SIZE
      }
      break

    default:
      break
  }
  return updatedFontSize
}

export const updateFontSize = (
  editor: LexicalEditor,
  updateType: UpdateFontSizeType | null,
  currentFontSize: number
) => {
  const newFontSize = calculateNextFontSize(currentFontSize, updateType)
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, {
        'font-size': `${newFontSize}px`,
      })
    }
  })
}

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode())
    }
  })
}

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }
}

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
  }
}

export const formatNumberedList = (
  editor: LexicalEditor,
  blockType: string
) => {
  if (blockType !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
  }
}

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'check') {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
  }
}

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }
}

export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'code') {
    editor.update(() => {
      let selection = $getSelection()
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          $setBlocksType(selection, () => $createCodeNode())
        } else {
          const textContent = selection.getTextContent()
          const codeNode = $createCodeNode()
          selection.insertNodes([codeNode])
          selection = $getSelection()
          if ($isRangeSelection(selection)) {
            selection.insertRawText(textContent)
          }
        }
      }
    })
  }
}

export const clearFormatting = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor
      const focus = selection.focus
      const nodes = selection.getNodes()

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return
      }

      nodes.forEach((node, idx) => {
        if ($isTextNode(node)) {
          let targetNode = node
          if (idx === 0 && anchor.offset !== 0) {
            targetNode = node.splitText(anchor.offset)[1] || node
          }
          if (idx === nodes.length - 1) {
            targetNode = targetNode.splitText(focus.offset)[0] || targetNode
          }

          targetNode.setFormat(0)
          targetNode.setStyle('')
        }
      })
    }
  })
}
