import type * as React from 'react'

export type SidebarInsertBlockType =
  | 'text'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'page'
  | 'card'
  | 'file'
  | 'image'
  | 'image-unsplash'
  | 'code'
  | 'tex'
  | 'mermaid'
  | 'whiteboard'
  | 'table'
  | 'gallery'
  | 'kanban'
  | 'line-solid'
  | 'line-dashed'
  | 'line-dotted'
  | 'page-break'
  | 'bullet-list'
  | 'numbered-list'
  | 'checklist'

export interface SidebarBlockItem {
  id: SidebarInsertBlockType
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  category: 'general' | 'collections' | 'lines' | 'breaks'
}
