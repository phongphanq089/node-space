import { FEATURES } from '../data/mock'

export default function FeatureHighlights() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="rounded-xl border border-ns-border bg-ns-input p-4 transition-all hover:-translate-y-0.5 hover:border-ns-border-md"
        >
          <div
            className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-${f.color}/15 text-${f.color}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="21" y2="12" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="12" y1="15" x2="12" y2="21" />
            </svg>
          </div>
          <p className="mb-1 text-xs font-bold text-ns-text">{f.title}</p>
          <p className="text-[0.68rem] leading-snug text-ns-ghost">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}
