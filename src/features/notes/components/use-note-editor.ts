import { useState } from 'react'
import type { NoteItem } from '../types'

export type ViewMode = 'edit' | 'preview' | 'split'

export type ActiveFormats = Record<
  'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'highlight',
  boolean
>

export type ActiveFormatKey = keyof ActiveFormats

export interface NoteEditorState {
  selectedBlockType: string
  activeFormats: ActiveFormats
  wordCount: number
  charCount: number
  readingTime: number
  toggleFormat: (fmt: ActiveFormatKey) => void
  setSelectedBlockType: (type: string) => void
}

export function useNoteEditor(content: string): NoteEditorState {
  const [selectedBlockType, setSelectedBlockType] = useState('paragraph')
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    highlight: false,
  })

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const toggleFormat = (fmt: ActiveFormatKey) => {
    setActiveFormats((prev) => ({ ...prev, [fmt]: !prev[fmt] }))
  }

  return {
    selectedBlockType,
    activeFormats,
    wordCount,
    charCount,
    readingTime,
    toggleFormat,
    setSelectedBlockType,
  }
}

export type { NoteItem }
