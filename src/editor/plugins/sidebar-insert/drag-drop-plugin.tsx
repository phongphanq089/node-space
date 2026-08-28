import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getNearestNodeFromDOMNode,
  COMMAND_PRIORITY_HIGH,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
} from 'lexical'
import * as React from 'react'
import { insertBlockIntoEditor } from './insert-helpers'
import type { SidebarInsertBlockType } from './types'

export const DRAG_DATA_FORMAT = 'application/x-lexical-block'

export function DragDropPlugin() {
  const [editor] = useLexicalComposerContext()
  const indicatorRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    // Create floating drop line indicator element
    const indicator = document.createElement('div')
    indicator.className =
      'pointer-events-none absolute z-40 hidden h-0.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-75'
    document.body.appendChild(indicator)
    indicatorRef.current = indicator

    const hideIndicator = () => {
      if (indicatorRef.current) {
        indicatorRef.current.style.display = 'none'
      }
    }

    const unregisterDragOver = editor.registerCommand<DragEvent>(
      DRAGOVER_COMMAND,
      (event) => {
        const hasBlockData =
          event.dataTransfer?.types.includes(DRAG_DATA_FORMAT) ||
          event.dataTransfer?.types.includes('text/plain')

        if (!hasBlockData) return false

        event.preventDefault()

        const rootElement = editor.getRootElement()
        if (!rootElement) return false

        const target = document.elementFromPoint(
          event.clientX,
          event.clientY
        ) as HTMLElement | null

        if (target && rootElement.contains(target)) {
          // Find top-level block inside root
          let blockElement: HTMLElement | null = target
          while (
            blockElement &&
            blockElement.parentElement &&
            blockElement.parentElement !== rootElement
          ) {
            blockElement = blockElement.parentElement
          }

          if (blockElement && indicatorRef.current) {
            const rect = blockElement.getBoundingClientRect()
            const isBottomHalf = event.clientY > rect.top + rect.height / 2
            const topPos = isBottomHalf ? rect.bottom : rect.top

            indicatorRef.current.style.display = 'block'
            indicatorRef.current.style.top = `${topPos + window.scrollY}px`
            indicatorRef.current.style.left = `${rect.left + window.scrollX}px`
            indicatorRef.current.style.width = `${rect.width}px`
          }
        }

        return true
      },
      COMMAND_PRIORITY_HIGH
    )

    const unregisterDrop = editor.registerCommand<DragEvent>(
      DROP_COMMAND,
      (event) => {
        hideIndicator()
        const blockType = event.dataTransfer?.getData(DRAG_DATA_FORMAT) as
          SidebarInsertBlockType | undefined

        if (!blockType) return false

        event.preventDefault()

        const rootElement = editor.getRootElement()
        if (!rootElement) return false

        const target = document.elementFromPoint(
          event.clientX,
          event.clientY
        ) as HTMLElement | null

        editor.update(() => {
          let targetNode = null
          if (target) {
            const domNode = target
            const nearestNode = $getNearestNodeFromDOMNode(domNode)
            if (nearestNode) {
              targetNode = nearestNode.getTopLevelElement()
            }
          }

          insertBlockIntoEditor(editor, blockType, targetNode)
        })

        return true
      },
      COMMAND_PRIORITY_HIGH
    )

    const handleDragLeave = (e: DragEvent) => {
      const rootElement = editor.getRootElement()
      if (rootElement && !rootElement.contains(e.relatedTarget as Node)) {
        hideIndicator()
      }
    }

    const rootElement = editor.getRootElement()
    rootElement?.addEventListener('dragleave', handleDragLeave)

    return () => {
      unregisterDragOver()
      unregisterDrop()
      rootElement?.removeEventListener('dragleave', handleDragLeave)
      if (indicator.parentElement) {
        indicator.parentElement.removeChild(indicator)
      }
    }
  }, [editor])

  return null
}
