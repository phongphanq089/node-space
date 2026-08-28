const COLOR_GROUPS = [
  {
    title: 'Backgrounds & Surfaces',
    tokens: [
      {
        name: '--color-ns-bg',
        hex: '#09070f',
        label: 'Deepest Background',
        class: 'bg-ns-bg',
      },
      {
        name: '--color-ns-surface',
        hex: '#0e0c1b',
        label: 'Card Surface',
        class: 'bg-ns-surface',
      },
      {
        name: '--color-ns-surface-alt',
        hex: '#0a0813',
        label: 'Surface Alt',
        class: 'bg-ns-surface-alt',
      },
      {
        name: '--color-ns-panel',
        hex: '#0d0b18',
        label: 'Panel / Popover',
        class: 'bg-ns-panel',
      },
      {
        name: '--color-ns-topbar',
        hex: '#09070f',
        label: 'Topbar Surface',
        class: 'bg-ns-topbar',
      },
    ],
  },
  {
    title: 'Brand & Accents',
    tokens: [
      {
        name: '--color-ns-primary',
        hex: '#7c3aed',
        label: 'Primary (Violet)',
        class: 'bg-ns-primary',
      },
      {
        name: '--color-ns-primary-lt',
        hex: '#a78bfa',
        label: 'Primary Light',
        class: 'bg-ns-primary-lt',
      },
      {
        name: '--color-ns-secondary',
        hex: '#6366f1',
        label: 'Secondary (Indigo)',
        class: 'bg-ns-secondary',
      },
      {
        name: '--color-ns-pink',
        hex: '#e05c9a',
        label: 'Pink Accent',
        class: 'bg-ns-pink',
      },
      {
        name: '--color-ns-amber',
        hex: '#f59e0b',
        label: 'Amber Accent',
        class: 'bg-ns-amber',
      },
    ],
  },
  {
    title: 'Text & Typography Tokens',
    tokens: [
      {
        name: '--color-ns-text',
        hex: '#f5f3ff',
        label: 'Primary Text',
        class: 'bg-ns-text',
      },
      {
        name: '--color-ns-text-2',
        hex: '#ddd6fe',
        label: 'Secondary Text',
        class: 'bg-ns-text-2',
      },
      {
        name: '--color-ns-muted',
        hex: 'rgba(221,214,254,0.65)',
        label: 'Muted Text',
        class: 'bg-ns-muted',
      },
      {
        name: '--color-ns-faint',
        hex: 'rgba(221,214,254,0.35)',
        label: 'Faint Text',
        class: 'bg-ns-faint',
      },
      {
        name: '--color-ns-placeholder',
        hex: 'rgba(221,214,254,0.30)',
        label: 'Placeholder',
        class: 'bg-ns-placeholder',
      },
    ],
  },
  {
    title: 'Borders & Focus States',
    tokens: [
      {
        name: '--color-ns-border',
        hex: 'rgba(124,58,237,0.40)',
        label: 'Standard Border',
        class: 'bg-ns-border',
      },
      {
        name: '--color-ns-border-soft',
        hex: 'rgba(124,58,237,0.08)',
        label: 'Subtle Divider',
        class: 'bg-ns-border-soft',
      },
      {
        name: '--color-ns-border-md',
        hex: 'rgba(124,58,237,0.20)',
        label: 'Medium Emphasis',
        class: 'bg-ns-border-md',
      },
      {
        name: '--color-ns-border-em',
        hex: 'rgba(124,58,237,0.35)',
        label: 'High Emphasis',
        class: 'bg-ns-border-em',
      },
      {
        name: '--color-ns-input-focus',
        hex: 'rgba(124,58,237,0.50)',
        label: 'Input Focus',
        class: 'bg-ns-input-focus',
      },
    ],
  },
]

const RADIUS_TOKENS = [
  {
    name: '--radius-sm',
    value: 'calc(var(--radius) * 0.6) ~ 6px',
    class: 'rounded-sm',
  },
  {
    name: '--radius-md',
    value: 'calc(var(--radius) * 0.8) ~ 8px',
    class: 'rounded-md',
  },
  { name: '--radius-lg', value: 'var(--radius) ~ 10px', class: 'rounded-lg' },
  {
    name: '--radius-xl',
    value: 'calc(var(--radius) * 1.4) ~ 14px',
    class: 'rounded-xl',
  },
  {
    name: '--radius-2xl',
    value: 'calc(var(--radius) * 1.8) ~ 18px',
    class: 'rounded-2xl',
  },
  {
    name: '--radius-3xl',
    value: 'calc(var(--radius) * 2.2) ~ 22px',
    class: 'rounded-3xl',
  },
]

export function TokensSection() {
  return (
    <section id="tokens" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            01
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Design Tokens & Variables
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          Core design tokens defining color palettes, typography, z-index
          layers, and border radii in Tailwind CSS v4.
        </p>
      </div>

      {/* Color Palette Grid */}
      <div className="space-y-6">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
              {group.title}
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {group.tokens.map((token) => (
                <div
                  key={token.name}
                  className="flex flex-col overflow-hidden rounded-lg border border-ns-border-soft bg-ns-surface p-2.5 transition-all hover:border-ns-border/70"
                >
                  <div
                    className={`h-14 w-full rounded-md border border-ns-border-soft/50 shadow-inner ${token.class}`}
                  />
                  <div className="mt-2.5 space-y-0.5">
                    <p className="text-xs font-medium text-ns-text">
                      {token.label}
                    </p>
                    <p className="truncate font-mono text-[11px] text-ns-muted">
                      {token.name}
                    </p>
                    <p className="font-mono text-[10px] text-ns-primary-lt">
                      {token.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Typography Scale */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
          Typography Scale (Geist Variable)
        </h4>
        <div className="space-y-3 rounded-xl border border-ns-border-soft bg-ns-surface/50 p-6">
          <div className="flex flex-col gap-1 border-b border-ns-border-soft/60 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-ns-text sm:text-4xl">
              Heading 1 — 36px/40px
            </h1>
            <span className="font-mono text-xs text-ns-muted">
              text-4xl font-extrabold
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-ns-border-soft/60 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-ns-text sm:text-3xl">
              Heading 2 — 28px/32px
            </h2>
            <span className="font-mono text-xs text-ns-muted">
              text-3xl font-bold
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-ns-border-soft/60 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-ns-text">
              Heading 3 — 20px/24px
            </h3>
            <span className="font-mono text-xs text-ns-muted">
              text-xl font-semibold
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-ns-border-soft/60 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-base text-ns-text">
              Body Regular — The quick brown fox jumps over the lazy dog. Smart
              workspace for notes & ideas.
            </p>
            <span className="font-mono text-xs text-ns-muted">
              text-base text-ns-text
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-ns-border-soft/60 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-ns-muted">
              Body Muted — Secondary helper text, descriptions, and timestamps.
            </p>
            <span className="font-mono text-xs text-ns-muted">
              text-sm text-ns-muted
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <code className="font-mono text-xs text-ns-primary-lt">
              font-mono: ui-monospace, 'Cascadia Code', Menlo, monospace
            </code>
            <span className="font-mono text-xs text-ns-muted">
              font-mono text-xs
            </span>
          </div>
        </div>
      </div>

      {/* Radius Scale */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
          Radius Scale
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {RADIUS_TOKENS.map((rad) => (
            <div
              key={rad.name}
              className={`flex flex-col items-center justify-center border-2 border-ns-primary/50 bg-ns-surface p-4 text-center ${rad.class}`}
            >
              <span className="font-mono text-xs font-semibold text-ns-text">
                {rad.name.replace('--radius-', '')}
              </span>
              <span className="mt-1 font-mono text-[10px] text-ns-muted">
                {rad.value.split('~')[1]?.trim()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
