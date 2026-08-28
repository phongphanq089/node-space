import {
  Code2,
  FileSpreadsheet,
  FileText,
  GripVertical,
  ImageIcon,
  Kanban,
  LayoutGrid,
  Paperclip,
  PenTool,
  Sparkles,
  Type,
  X,
  Sigma,
  GitFork,
  CreditCard,
  Search,
} from 'lucide-react'
import * as React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { insertBlockIntoEditor } from './insert-helpers'
import { DRAG_DATA_FORMAT } from './drag-drop-plugin'
import type { SidebarBlockItem, SidebarInsertBlockType } from './types'

const SIDEBAR_ITEMS: SidebarBlockItem[] = [
  // 1. General
  {
    id: 'text',
    title: 'Text',
    icon: Type,
    iconColor: 'text-blue-400',
    category: 'general',
  },
  {
    id: 'page',
    title: 'Page',
    icon: FileText,
    iconColor: 'text-emerald-400',
    category: 'general',
  },
  {
    id: 'card',
    title: 'Card',
    icon: CreditCard,
    iconColor: 'text-purple-400',
    category: 'general',
  },
  {
    id: 'file',
    title: 'File Attachment',
    icon: Paperclip,
    iconColor: 'text-amber-400',
    category: 'general',
  },
  {
    id: 'image',
    title: 'Image',
    icon: ImageIcon,
    iconColor: 'text-sky-400',
    category: 'general',
  },
  {
    id: 'image-unsplash',
    title: 'Image from Unsplash',
    icon: Sparkles,
    iconColor: 'text-rose-400',
    category: 'general',
  },
  {
    id: 'code',
    title: 'Code Block',
    icon: Code2,
    iconColor: 'text-cyan-400',
    category: 'general',
  },
  {
    id: 'tex',
    title: 'TeX Formula',
    icon: Sigma,
    iconColor: 'text-indigo-400',
    category: 'general',
  },
  {
    id: 'mermaid',
    title: 'Mermaid Diagram',
    icon: GitFork,
    iconColor: 'text-teal-400',
    category: 'general',
  },
  {
    id: 'whiteboard',
    title: 'Whiteboard',
    icon: PenTool,
    iconColor: 'text-orange-400',
    category: 'general',
  },

  // 2. Collections
  {
    id: 'table',
    title: 'Table',
    icon: FileSpreadsheet,
    iconColor: 'text-emerald-400',
    category: 'collections',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    icon: LayoutGrid,
    iconColor: 'text-violet-400',
    category: 'collections',
  },
  {
    id: 'kanban',
    title: 'Kanban',
    icon: Kanban,
    iconColor: 'text-blue-400',
    category: 'collections',
  },
]

export interface SidebarInsertPanelProps {
  open: boolean
  onClose: () => void
  onSelectItem?: (id: SidebarInsertBlockType) => void
  className?: string
}

export function SidebarInsertPanel({
  open,
  onClose,
  onSelectItem,
  className = '',
}: SidebarInsertPanelProps) {
  const [editor] = useLexicalComposerContext()
  const [activeTab, setActiveTab] = React.useState<
    'insert' | 'format' | 'style' | 'info'
  >('insert')
  const [search, setSearch] = React.useState('')

  if (!open) return null

  const filteredItems = SIDEBAR_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  const generalItems = filteredItems.filter((i) => i.category === 'general')
  const collectionItems = filteredItems.filter(
    (i) => i.category === 'collections'
  )

  const handleDragStart = (e: React.DragEvent, id: SidebarInsertBlockType) => {
    e.dataTransfer.setData(DRAG_DATA_FORMAT, id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleItemClick = (id: SidebarInsertBlockType) => {
    if (onSelectItem) {
      onSelectItem(id)
    } else {
      insertBlockIntoEditor(editor, id)
    }
  }

  return (
    <div
      className={`relative z-30 flex h-full w-80 shrink-0 animate-in flex-col border-l border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl duration-200 select-none slide-in-from-right ${className}`}
    >
      {/* 1. Header Tabs matching Screenshot */}
      <div className="flex items-center justify-between border-b border-border/70 px-4 pt-3 pb-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('insert')}
            className={`cursor-pointer transition-colors ${
              activeTab === 'insert'
                ? 'font-bold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('format')}
            className={`cursor-pointer transition-colors ${
              activeTab === 'format'
                ? 'font-bold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Format
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`cursor-pointer transition-colors ${
              activeTab === 'style'
                ? 'font-bold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Style
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`cursor-pointer transition-colors ${
              activeTab === 'info'
                ? 'font-bold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Info
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Close panel"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 2. Search & Subtitle */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative mb-2">
          <Search className="absolute top-2 left-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-muted/30 py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
          />
        </div>
        <p className="text-[11px] font-medium text-muted-foreground">
          Drag and drop any item to the document
        </p>
      </div>

      {/* 3. Draggable Items List */}
      <div className="flex-1 scrollbar-thin space-y-4 overflow-y-auto px-3 pb-6">
        {/* General Category */}
        {generalItems.length > 0 && (
          <div className="space-y-1.5">
            {generalItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => handleItemClick(item.id)}
                  className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 hover:shadow-xs active:scale-[0.98] active:cursor-grabbing"
                  title="Click to insert or drag into document"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-7 items-center justify-center rounded-lg border border-border/40 bg-muted/40 ${
                        item.iconColor || 'text-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                  </div>

                  <GripVertical className="size-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                </div>
              )
            })}
          </div>
        )}

        {/* Collections Category */}
        {collectionItems.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <h4 className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Collections
            </h4>
            {collectionItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => handleItemClick(item.id)}
                  className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 hover:shadow-xs active:scale-[0.98] active:cursor-grabbing"
                  title="Click to insert or drag into document"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-7 items-center justify-center rounded-lg border border-border/40 bg-muted/40 ${
                        item.iconColor || 'text-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                  </div>

                  <GripVertical className="size-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                </div>
              )
            })}
          </div>
        )}

        {/* Lines Category */}
        <div className="space-y-2 pt-2">
          <h4 className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Insert Line
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {/* Dotted */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'line-dotted')}
              onClick={() => handleItemClick('line-dotted')}
              className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
              title="Dotted Divider"
            >
              <div className="flex items-center gap-1 opacity-60">
                <span className="size-1 rounded-full bg-foreground" />
                <span className="size-1 rounded-full bg-foreground" />
                <span className="size-1 rounded-full bg-foreground" />
              </div>
              <GripVertical className="size-3.5 text-muted-foreground/40" />
            </div>

            {/* Dashed */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'line-dashed')}
              onClick={() => handleItemClick('line-dashed')}
              className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
              title="Dashed Divider"
            >
              <div className="h-0.5 w-12 border-b-2 border-dashed border-foreground/60" />
              <GripVertical className="size-3.5 text-muted-foreground/40" />
            </div>

            {/* Solid */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'line-solid')}
              onClick={() => handleItemClick('line-solid')}
              className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
              title="Solid Divider"
            >
              <div className="h-0.5 w-12 rounded-full bg-foreground/60" />
              <GripVertical className="size-3.5 text-muted-foreground/40" />
            </div>

            {/* Bold Line */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'line-solid')}
              onClick={() => handleItemClick('line-solid')}
              className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
              title="Thick Divider"
            >
              <div className="h-1.5 w-12 rounded-full bg-foreground/80" />
              <GripVertical className="size-3.5 text-muted-foreground/40" />
            </div>
          </div>
        </div>

        {/* Page Break Category */}
        <div className="space-y-1.5 pt-2">
          <h4 className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Insert Page Break
          </h4>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'page-break')}
            onClick={() => handleItemClick('page-break')}
            className="group flex cursor-grab items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-accent/40 active:cursor-grabbing"
          >
            <div className="h-4 w-28 rounded-md border border-dashed border-border bg-muted/60" />
            <GripVertical className="size-3.5 text-muted-foreground/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
