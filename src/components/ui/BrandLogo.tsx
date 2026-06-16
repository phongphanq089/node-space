type BrandLogoProps = {
  size?: 'sm' | 'md'
  showWordmark?: boolean
}

const sizes = {
  sm: { box: 'h-8 w-8', icon: 14 },
  md: { box: 'h-9 w-9', icon: 16 },
}

export default function BrandLogo({
  size = 'md',
  showWordmark = true,
}: BrandLogoProps) {
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.box} flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ns-accent to-ns-purple shadow-[0_0_16px_var(--color-ns-accent)]`}
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-ns-on-accent)"
          strokeWidth="2.5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <line x1="3" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="21" y2="12" />
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="21" />
        </svg>
      </div>

      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-ns-text">
          NodeSpace
        </span>
      )}
    </div>
  )
}
