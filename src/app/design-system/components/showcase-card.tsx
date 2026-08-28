import React from 'react'
import { cn } from '@/shared/lib/utils'

interface ShowcaseCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  codeBadge?: string
}

export function ShowcaseCard({
  title,
  description,
  children,
  className,
  codeBadge,
}: ShowcaseCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border border-ns-border/40 bg-ns-surface/80 p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-ns-border/80',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-ns-text">
            {title}
          </h4>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-ns-muted">
              {description}
            </p>
          )}
        </div>
        {codeBadge && (
          <code className="rounded border border-ns-border-soft bg-ns-surface-alt px-2 py-0.5 font-mono text-[11px] text-ns-primary-lt">
            {codeBadge}
          </code>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-ns-border-soft/60 bg-ns-bg/50 p-4">
        {children}
      </div>
    </div>
  )
}
