import { $generateHtmlFromNodes } from '@lexical/html'
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { $getRoot } from 'lexical'
import type { EditorState, LexicalEditor } from 'lexical'
import * as React from 'react'

import type { EditorChangeData } from '../../types'

export function OnChangeHandlerPlugin({
  onChange,
}: {
  onChange?: (data: EditorChangeData) => void
}) {
  const handleChange = React.useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      if (!onChange) return

      editorState.read(() => {
        const root = $getRoot()
        const text = root.getTextContent()
        const isEmpty = text.trim().length === 0 && root.getChildrenSize() <= 1

        const jsonState = editorState.toJSON()
        const json = JSON.stringify(jsonState)

        let html = ''
        try {
          html = $generateHtmlFromNodes(editor, null)
        } catch (e) {
          console.warn('[Editor] Failed to generate HTML:', e)
        }

        let markdown = ''
        try {
          markdown = $convertToMarkdownString(TRANSFORMERS)
        } catch (e) {
          console.warn('[Editor] Failed to generate Markdown:', e)
        }

        onChange({
          json,
          state: jsonState as unknown as Record<string, unknown>,
          html,
          markdown,
          text,
          isEmpty,
        })
      })
    },
    [onChange]
  )

  if (!onChange) return null

  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
}
