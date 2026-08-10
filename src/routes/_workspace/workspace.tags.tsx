import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Tag, Search, Hash } from 'lucide-react'
import { Button, Input } from '@/shared/ui'
import { NODES, NOTES } from '@/shared/mocks/mock-data'

export const Route = createFileRoute('/_workspace/workspace/tags')({
  component: TagsPage,
})

interface TagInfo {
  name: string
  count: number
  color: string
  bg: string
}

const TAGS_DATA: readonly TagInfo[] = [
  {
    name: 'productivity',
    count: 5,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
  },
  {
    name: 'algorithm',
    count: 3,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
  },
  {
    name: 'devops',
    count: 4,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.12)',
  },
  { name: 'book', count: 2, color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
  {
    name: 'database',
    count: 4,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
  },
  {
    name: 'clean-code',
    count: 6,
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  { name: 'linux', count: 3, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  {
    name: 'overview',
    count: 3,
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    name: 'feature',
    count: 4,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  { name: 'tech', count: 7, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { name: 'stack', count: 2, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  {
    name: 'roadmap',
    count: 2,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
  },
  {
    name: 'usecase',
    count: 3,
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.12)',
  },
  {
    name: 'example',
    count: 2,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
  },
]

function TagsPage() {
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredTags = TAGS_DATA.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeTagObj = TAGS_DATA.find((t) => t.name === selectedTag)

  // Items related to selected tag
  const matchingNodes = selectedTag
    ? NODES.filter(
        (n) =>
          n.tag?.replace('#', '').toLowerCase() === selectedTag.toLowerCase()
      )
    : []
  const matchingNotes = selectedTag
    ? NOTES.filter((n) =>
        n.tags.some(
          (t) => t.replace('#', '').toLowerCase() === selectedTag.toLowerCase()
        )
      )
    : []

  return (
    <div className="flex flex-1 flex-col gap-6 bg-ns-bg p-4 font-sans sm:p-6 lg:p-8">
      {/* ── Top Hero Header ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-ns-border-md bg-ns-surface/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div className="ns-orb-purple-20 pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-30 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[0.7rem] font-semibold text-purple-300">
              <Tag className="size-3.5" />
              <span>Classification System</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Tag Management
            </h1>
            <p className="max-w-xl text-xs text-ns-muted sm:text-sm">
              Organize and filter your node workspace by custom topic tags,
              categories, and keywords.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-ns-border-soft bg-ns-bg/50 px-4 py-2.5 backdrop-blur-md">
              <span className="text-lg font-bold text-purple-400">
                {TAGS_DATA.length}
              </span>
              <span className="text-[0.65rem] font-semibold text-ns-ghost uppercase">
                Total Tags
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Control Bar ────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder="Search tags by keyword..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            suffix={<Search size={14} className="text-ns-ghost" />}
          />
        </div>

        {selectedTag && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="self-start border-ns-border-soft text-xs text-ns-muted hover:text-white sm:self-auto"
          >
            Clear tag selection
          </Button>
        )}
      </div>

      {/* ── Tag Grid Cloud ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTags.map((tag) => {
          const isSelected = selectedTag === tag.name
          return (
            <button
              key={tag.name}
              type="button"
              onClick={() => setSelectedTag(isSelected ? null : tag.name)}
              className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-ns-primary bg-ns-primary/20 shadow-lg shadow-ns-primary/20'
                  : 'border-ns-border-soft bg-ns-panel/70 hover:border-ns-border-md hover:bg-ns-panel hover:shadow-lg'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10"
                  style={{ backgroundColor: tag.bg, color: tag.color }}
                >
                  <Hash size={14} />
                </div>
                <span
                  className={`truncate text-xs font-bold transition-colors ${
                    isSelected
                      ? 'text-white'
                      : 'text-ns-text group-hover:text-ns-primary-lt'
                  }`}
                >
                  #{tag.name}
                </span>
              </div>

              <span
                className="shrink-0 rounded-md border border-ns-border-soft bg-ns-bg/60 px-2 py-0.5 font-mono text-[0.625rem] font-bold text-ns-muted"
                style={{ color: isSelected ? tag.color : undefined }}
              >
                {tag.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Selected Tag Preview Section ───────────────────────────── */}
      {selectedTag && (
        <section className="mt-4 flex flex-col gap-4 rounded-2xl border border-ns-border-md bg-ns-panel/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-ns-border-soft pb-3">
            <div className="flex items-center gap-2">
              <div
                className="flex size-7 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: activeTagObj?.bg,
                  color: activeTagObj?.color,
                }}
              >
                <Hash size={14} />
              </div>
              <h2 className="text-base font-bold text-white">
                Items tagged with{' '}
                <span style={{ color: activeTagObj?.color }}>
                  #{selectedTag}
                </span>
              </h2>
            </div>
            <span className="text-xs text-ns-muted">
              {matchingNodes.length + matchingNotes.length} matching items
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Matching Nodes */}
            <div className="flex flex-col gap-2">
              <span className="text-[0.68rem] font-bold text-ns-ghost uppercase">
                Nodes
              </span>
              {matchingNodes.map((n) => (
                <div
                  key={n.title}
                  className="flex items-center justify-between rounded-xl border border-ns-border-soft bg-ns-bg/40 p-3 text-xs font-semibold text-ns-text"
                >
                  <span>{n.title}</span>
                  <span className="text-[0.65rem] text-ns-ghost">
                    {n.count} notes
                  </span>
                </div>
              ))}
              {matchingNodes.length === 0 && (
                <p className="text-xs text-ns-ghost italic">
                  No specific nodes tagged with #{selectedTag}
                </p>
              )}
            </div>

            {/* Matching Notes */}
            <div className="flex flex-col gap-2">
              <span className="text-[0.68rem] font-bold text-ns-ghost uppercase">
                Notes
              </span>
              {matchingNotes.map((n) => (
                <div
                  key={n.title}
                  className="flex items-center justify-between rounded-xl border border-ns-border-soft bg-ns-bg/40 p-3 text-xs font-semibold text-ns-text"
                >
                  <span>{n.title}</span>
                  <span className="text-[0.65rem] text-ns-ghost">
                    {n.updated}
                  </span>
                </div>
              ))}
              {matchingNotes.length === 0 && (
                <p className="text-xs text-ns-ghost italic">
                  No specific notes tagged with #{selectedTag}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
