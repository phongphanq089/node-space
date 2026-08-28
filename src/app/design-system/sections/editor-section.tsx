import { useState } from 'react'
import {
  FileText,
  Eye,
  Laptop,
  Minimize2,
  Layers,
  Smartphone,
  CheckCircle2,
  PanelRightOpen,
  Sparkles,
} from 'lucide-react'
import { Editor } from '@/editor'
import type { EditorChangeData, EditorVariant } from '@/editor'
import { ShowcaseCard } from '../components/showcase-card'

type ShowcaseTab = EditorVariant | 'sidebar-palette'

/* Variant metadata — used for tabs & showcase card */
const TABS_CONFIG: Array<{
  id: ShowcaseTab
  icon: typeof Laptop
  label: string
  badge: string
  cardTitle: string
  cardDescription: string
  hint: string
}> = [
  {
    id: 'default',
    icon: Laptop,
    label: 'Full Desktop',
    badge: 'variant="default"',
    cardTitle: 'Full Desktop Editor',
    cardDescription:
      'Production-grade writing surface. Sticky top toolbar with block formatting, font controls, colors, alignment, and insert objects. Bottom status bar tracks document stats and provides quick actions via icon dock.',
    hint: 'Tip: Try "/" for slash commands or select any text for the bubble menu.',
  },
  {
    id: 'sidebar-palette',
    icon: PanelRightOpen,
    label: 'Slide Tool Palette (Drag & Drop)',
    badge: 'Drag & Drop Blocks',
    cardTitle: 'Slide-out Tool Palette with Native Drag & Drop',
    cardDescription:
      'Slide out the tool palette containing Text, Page, Card, Image, Code, TeX Formula, Mermaid, Whiteboard, Table, Kanban, and Custom Dividers. Grab the ⋮⋮ handle and drag any block into the editor canvas!',
    hint: 'Drag any block card from the sidebar and drop it between lines, or click it to insert.',
  },
  {
    id: 'basic',
    icon: Minimize2,
    label: 'Basic Editor',
    badge: 'variant="basic"',
    cardTitle: 'Basic Compact Editor',
    cardDescription:
      'Minimal 36px toolbar — Bold, Italic, Underline, Lists, and Link. Designed for comment boxes, feedback widgets, and inline note forms where simplicity wins.',
    hint: 'Tip: Select text to see the floating bubble menu.',
  },
  {
    id: 'frameless',
    icon: Layers,
    label: 'Frameless Canvas',
    badge: 'variant="frameless"',
    cardTitle: 'Frameless Canvas — Notion / Medium Style',
    cardDescription:
      'Zero chrome. No border, no card background. Pure writing surface that inherits the host page\'s background. Powered entirely by Slash "/" commands and the Floating Bubble Menu.',
    hint: 'Type "/" anywhere to open the block command palette.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    label: 'Mobile App',
    badge: 'variant="mobile"',
    cardTitle: 'Mobile App Editor',
    cardDescription:
      'Touch-optimized bottom keyboard dock. 44px touch targets following Apple HIG guidelines. Sticky to the bottom of the screen — format text without leaving the keyboard.',
    hint: 'Simulated iOS device frame. Bottom dock scrolls horizontally.',
  },
]

export function EditorSection() {
  const [editorData, setEditorData] = useState<EditorChangeData | null>(null)
  const [selected, setSelected] = useState<ShowcaseTab>('sidebar-palette')
  const [readOnly, setReadOnly] = useState(false)

  const current = TABS_CONFIG.find((v) => v.id === selected)!

  const characters = editorData?.text?.length ?? 0
  const words = editorData?.text?.trim()
    ? editorData.text.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <section id="editor" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-ns-primary/10 text-ns-primary-lt">
              <FileText className="size-3.5" />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-ns-text">
              Universal Rich Text Editor
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-500">
              Drag & Drop Enabled
            </span>
          </div>
          <p className="mt-1 text-xs text-ns-muted">
            Includes Slide-out Tool Palette, Native Drag & Drop, Slash Commands,
            Bubble Menu, and 4 Presets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReadOnly((prev) => !prev)}
          className={`mt-2 inline-flex items-center gap-1.5 self-start rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors sm:mt-0 ${
            readOnly
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
              : 'border-ns-border-soft bg-ns-surface text-ns-muted hover:text-ns-text'
          }`}
        >
          <Eye className="size-3.5" />
          {readOnly ? 'ReadOnly mode' : 'Editable mode'}
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-ns-border/50 bg-ns-surface/60 p-1.5">
        {TABS_CONFIG.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
              selected === id
                ? 'bg-ns-primary text-white shadow-sm'
                : 'text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text'
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Showcase Card */}
      <ShowcaseCard
        title={current.cardTitle}
        description={current.cardDescription}
        codeBadge={current.badge}
        className="overflow-hidden"
      >
        {/* 1. Slide Tool Palette Preview */}
        {selected === 'sidebar-palette' && (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-amber-400" />
                Click the top-right tool icon on the side dock to toggle the
                Sidebar Tool Palette, or drag cards directly!
              </span>
            </div>

            <Editor
              variant="default"
              documentId="DOC-PALETTE"
              placeholder="Drag and drop blocks from the right sidebar palette or write here..."
              readOnly={readOnly}
              features={{
                floatingDock: true,
                sidebarInsert: true,
              }}
              onChange={(data) => setEditorData(data)}
              minHeight={340}
              className="w-full shadow-lg"
            />

            {!readOnly && (
              <div className="flex items-center gap-4 font-mono text-[11px] text-ns-muted">
                <span className="flex items-center gap-1">
                  {editorData && !editorData.isEmpty && (
                    <CheckCircle2 className="size-3 text-emerald-500" />
                  )}
                  {characters.toLocaleString()} chars · {words.toLocaleString()}{' '}
                  words
                </span>
                <span className="ml-auto opacity-70">{current.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Full Desktop Preview */}
        {selected === 'default' && (
          <div className="w-full space-y-3">
            <Editor
              variant="default"
              documentId="DOC-001"
              placeholder="Start writing... Press '/' for commands or select text for the bubble menu."
              readOnly={readOnly}
              features={{ floatingDock: true, sidebarInsert: true }}
              onChange={(data) => setEditorData(data)}
              minHeight={280}
              className="w-full"
            />
            {!readOnly && (
              <div className="flex items-center gap-4 font-mono text-[11px] text-ns-muted">
                <span className="flex items-center gap-1">
                  {editorData && !editorData.isEmpty && (
                    <CheckCircle2 className="size-3 text-emerald-500" />
                  )}
                  {characters.toLocaleString()} chars · {words.toLocaleString()}{' '}
                  words
                </span>
                <span className="ml-auto opacity-50">{current.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Basic Editor Preview */}
        {selected === 'basic' && (
          <div className="w-full max-w-xl">
            <div className="rounded-xl border border-ns-border/60 bg-ns-surface/40 p-4">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-ns-primary/30 to-ns-primary/60" />
                <div>
                  <p className="text-xs font-semibold text-ns-text">
                    Phong Phan
                  </p>
                  <p className="text-[11px] text-ns-muted">
                    Leave a comment...
                  </p>
                </div>
              </div>
              <Editor
                variant="basic"
                placeholder="Write a comment or quick note..."
                readOnly={readOnly}
                onChange={(data) => setEditorData(data)}
                minHeight={90}
                className="w-full bg-ns-bg"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-ns-muted">
                  {current.hint}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-ns-primary px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Frameless Canvas Preview */}
        {selected === 'frameless' && (
          <div className="w-full">
            <div className="w-full rounded-xl border border-dashed border-border/50 bg-background">
              <div className="border-b border-border/40 px-8 py-5">
                <div className="mx-auto max-w-2xl">
                  <div className="mb-1 h-2 w-16 rounded-full bg-muted/60" />
                  <div className="h-7 w-56 rounded-lg bg-muted/40" />
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="mx-auto max-w-2xl">
                  <Editor
                    variant="frameless"
                    placeholder='Type "/" for block commands or start writing...'
                    readOnly={readOnly}
                    onChange={(data) => setEditorData(data)}
                    minHeight={220}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="border-t border-border/30 px-8 py-2 font-mono text-[11px] text-muted-foreground/60">
                {current.hint}
              </div>
            </div>
          </div>
        )}

        {/* 5. Mobile App Preview */}
        {selected === 'mobile' && (
          <div className="flex w-full justify-center py-2">
            <div className="relative w-[375px]">
              <div className="overflow-hidden rounded-[40px] border-[3px] border-foreground/20 bg-background shadow-2xl ring-1 ring-foreground/5">
                <div className="flex h-12 items-end justify-between bg-background px-6 pb-2">
                  <span className="font-mono text-[13px] font-semibold text-foreground">
                    9:41
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`block rounded-full ${i === 3 ? 'size-2.5 bg-foreground' : 'size-2 bg-foreground/30'}`}
                      />
                    ))}
                    <div className="ml-1 flex items-center">
                      <div className="h-3.5 w-6 rounded-sm border border-foreground/50 p-px">
                        <div className="h-full w-3/4 rounded-xs bg-foreground/80" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
                  <button
                    type="button"
                    className="text-[13px] font-medium text-primary"
                  >
                    ‹ Notes
                  </button>
                  <span className="text-[14px] font-semibold text-foreground">
                    New Note
                  </span>
                  <button
                    type="button"
                    className="text-[13px] font-medium text-primary"
                  >
                    Done
                  </button>
                </div>

                <Editor
                  variant="mobile"
                  placeholder="Tap to start writing..."
                  readOnly={readOnly}
                  onChange={(data) => setEditorData(data)}
                  minHeight={320}
                  className="rounded-none border-none shadow-none"
                />

                <div className="flex justify-center bg-background py-2">
                  <div className="h-1 w-28 rounded-full bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>
        )}
      </ShowcaseCard>
    </section>
  )
}
