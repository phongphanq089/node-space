import { NOTES } from '../data/mock'

const iconBtnSm =
  'flex h-7 w-7 items-center justify-center rounded-lg text-ns-ghost hover:bg-ns-hover-md hover:text-ns-accent-lt transition-all'

export default function NotesList() {
  return (
    <div className="overflow-hidden rounded-xl border border-ns-border bg-ns-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ns-border-soft px-4 py-3">
        <div>
          <span className="text-sm font-semibold text-ns-text-2">
            Danh sách notes trong node
          </span>
          <span className="ml-2 text-xs text-ns-faint">6 notes</span>
        </div>
        <div className="flex gap-1">
          {(['🗑', '≡', '⊞'] as const).map((ic, i) => (
            <button key={i} className={`${iconBtnSm} text-xs`}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-ns-border-soft">
        {NOTES.map((note) => (
          <div
            key={note.title}
            className="flex items-start gap-3 px-4 py-3 transition-all hover:bg-ns-hover"
          >
            <span className="mt-0.5 text-base text-ns-accent">◎</span>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold text-ns-text">
                {note.title}
              </p>
              <div className="mb-1 flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-ns-active px-1.5 py-0.5 text-[0.62rem] text-ns-accent-lt"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[0.65rem] text-ns-faint">
                Cập nhật {note.updated}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {'starred' in note && note.starred && (
                <span className="text-xs text-yellow-400">★</span>
              )}
              <button className="text-xs text-ns-ghost transition-all hover:text-ns-accent-lt">
                ···
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
