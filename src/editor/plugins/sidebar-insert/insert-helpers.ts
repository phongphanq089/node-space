import { $createCodeNode } from '@lexical/code'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $getRoot,
} from 'lexical'
import type { ElementNode, LexicalEditor, LexicalNode } from 'lexical'
import type { SidebarInsertBlockType } from './types'

export function insertBlockIntoEditor(
  editor: LexicalEditor,
  blockType: SidebarInsertBlockType,
  targetNode?: LexicalNode | null
) {
  editor.update(() => {
    let newNode: ElementNode | null = null

    switch (blockType) {
      case 'text': {
        newNode = $createParagraphNode()
        newNode.append($createTextNode('New paragraph text...'))
        break
      }
      case 'h1': {
        newNode = $createHeadingNode('h1')
        newNode.append($createTextNode('Heading 1'))
        break
      }
      case 'h2': {
        newNode = $createHeadingNode('h2')
        newNode.append($createTextNode('Heading 2'))
        break
      }
      case 'h3': {
        newNode = $createHeadingNode('h3')
        newNode.append($createTextNode('Heading 3'))
        break
      }
      case 'card':
      case 'page': {
        newNode = $createQuoteNode()
        newNode.append(
          $createTextNode('📌 Note Card / Callout block content...')
        )
        break
      }
      case 'code': {
        newNode = $createCodeNode('javascript')
        newNode.append(
          $createTextNode(
            '// Write your code here\nconsole.log("Hello NoteFlow!");'
          )
        )
        break
      }
      case 'mermaid': {
        newNode = $createCodeNode('mermaid')
        newNode.append(
          $createTextNode(
            'graph TD;\n  A[Start] --> B{Process};\n  B -->|Yes| C[Done];\n  B -->|No| D[Retry];'
          )
        )
        break
      }
      case 'tex': {
        newNode = $createCodeNode('latex')
        newNode.append(
          $createTextNode(
            'f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x} \\, d\\xi'
          )
        )
        break
      }
      case 'whiteboard':
      case 'gallery':
      case 'kanban':
      case 'file': {
        newNode = $createQuoteNode()
        const label =
          blockType === 'whiteboard'
            ? '🎨 Whiteboard Canvas'
            : blockType === 'gallery'
              ? '🖼️ Media Gallery'
              : blockType === 'kanban'
                ? '📋 Kanban Board'
                : '📎 File Attachment'
        newNode.append($createTextNode(`[${label}] - Click to configure`))
        break
      }
      case 'image':
      case 'image-unsplash': {
        newNode = $createParagraphNode()
        newNode.append(
          $createTextNode(
            '🖼️ [Image Block: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800]'
          )
        )
        break
      }
      default:
        break
    }

    if (newNode) {
      if (targetNode) {
        targetNode.insertAfter(newNode)
        newNode.select()
      } else {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor.getNode()
          const topElement = anchor.getTopLevelElement()
          if (topElement) {
            topElement.insertAfter(newNode)
          } else {
            $getRoot().append(newNode)
          }
          newNode.select()
        } else {
          $getRoot().append(newNode)
          newNode.select()
        }
      }
      return
    }

    // Commands based insertions
    switch (blockType) {
      case 'table': {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: '3',
          rows: '3',
          includeHeaders: true,
        })
        break
      }
      case 'line-solid':
      case 'line-dashed':
      case 'line-dotted':
      case 'page-break': {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
        break
      }
      case 'bullet-list': {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      }
      case 'numbered-list': {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      }
      case 'checklist': {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        break
      }
      default:
        break
    }
  })
}
