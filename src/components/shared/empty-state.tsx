/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react'
import {
  FolderOpen,
  SearchX,
  Inbox,
  FileQuestion,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type EmptyStateVariant =
  | 'folder'
  | 'search'
  | 'data'
  | 'notFound'
  | 'default'

interface EmptyStateProps {
  icon?: React.ElementType
  variant?: EmptyStateVariant
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  compact?: boolean
}

const DEFAULT_CONFIG: Record<
  EmptyStateVariant,
  { icon: React.ElementType; title: string; description: string }
> = {
  folder: {
    icon: FolderOpen,
    title: 'No items in this folder',
    description:
      'This folder is empty. Create a new node or select another filter.',
  },
  search: {
    icon: SearchX,
    title: 'No matching results',
    description:
      'We couldn’t find anything matching your search criteria. Try a different query.',
  },
  data: {
    icon: Inbox,
    title: 'No data available',
    description: 'There are no items to display at the moment.',
  },
  notFound: {
    icon: FileQuestion,
    title: 'Content not found',
    description: 'The requested resource might have been moved or deleted.',
  },
  default: {
    icon: Sparkles,
    title: 'Nothing here yet',
    description: 'Get started by creating your first item.',
  },
}

export function EmptyState({
  icon: CustomIcon,
  variant = 'default',
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  const config = DEFAULT_CONFIG[variant] ?? DEFAULT_CONFIG.default
  const Icon = CustomIcon ?? config.icon
  const displayTitle = title ?? config.title
  const displayDesc = description ?? config.description

  return (
    <div
      className={cn(
        'group relative mx-auto flex min-h-[400px] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ns-border-soft/80 bg-gradient-to-b from-ns-panel/60 to-ns-panel/20 p-8 text-center backdrop-blur-md transition-all hover:border-ns-border-md/60 hover:bg-ns-panel/50',
        compact && 'p-5',
        className
      )}
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 rounded-full bg-ns-primary/10 blur-2xl transition-all group-hover:bg-ns-primary/20" />

      {/* Icon Badge Wrapper */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-ns-primary/20 blur-md transition-all group-hover:blur-lg" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-ns-border-em/60 bg-ns-active/80 text-ns-primary-lt shadow-lg shadow-ns-primary/10 transition-all group-hover:scale-105 group-hover:text-white">
          <Icon className={cn('h-6 w-6', compact && 'h-5 w-5')} />
        </div>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-sm font-extrabold text-ns-text transition-colors group-hover:text-white',
          compact && 'text-xs'
        )}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      {displayDesc && (
        <p
          className={cn(
            'mt-1 max-w-sm text-xs leading-relaxed text-ns-faint',
            compact && 'text-[0.68rem]'
          )}
        >
          {displayDesc}
        </p>
      )}

      {/* Action Slot */}
      {action && <div className="mt-4 flex items-center gap-2">{action}</div>}
    </div>
  )
}
