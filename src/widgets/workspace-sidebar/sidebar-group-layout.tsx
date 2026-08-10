import type { ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/shared/ui/core/sidebar'
import {
  Home,
  Hexagon,
  Star,
  Clock,
  Tag,
  Trash2,
  Music,
  FolderClosed,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/** Standardized item data schema for generic sidebar groups */
export interface SidebarGroupItemData {
  id?: string
  label: string
  to?: string
  href?: string
  icon?: string | ReactNode

  color?: string
  exact?: boolean
  badge?: string | number
  active?: boolean
  onClick?: () => void
  disabled?: boolean
}

export interface SidebarGroupLayoutProps<T = SidebarGroupItemData> {
  /** Optional header title / label for the group */
  title?: string
  /** Optional action element for header (e.g. Plus button) */
  headerAction?: ReactNode
  /** Array of items to render (supports both mutable and readonly arrays) */
  items: readonly T[]
  /** Extra class names for the root SidebarGroup */
  className?: string
  /** Extra class names for the SidebarGroupLabel */
  labelClassName?: string
  /** Custom mapper if item structure differs from SidebarGroupItemData */
  mapItem?: (item: T) => SidebarGroupItemData
  /** Custom render function for item leading icon / indicator */
  renderLeading?: (item: T, mapped: SidebarGroupItemData) => ReactNode
  /** Custom render function for per-item trailing actions (e.g. DropdownMenu) */
  renderActions?: (item: T, mapped: SidebarGroupItemData) => ReactNode
  /** Custom render function for badge or trailing content */
  renderTrailing?: (item: T, mapped: SidebarGroupItemData) => ReactNode
  /** Toggle "More" button at bottom of item list */
  showMoreButton?: boolean
  /** Label for the "More" button */
  moreLabel?: string
  /** Click handler for the "More" button */
  onMoreClick?: () => void
}

const defaultIconMap: Record<string, ReactNode> = {
  home: <Home size={15} />,
  folder: <FolderClosed size={15} />,
  hexagon: <Hexagon size={15} />,
  star: <Star size={15} />,
  clock: <Clock size={15} />,
  tag: <Tag size={15} />,
  trash: <Trash2 size={15} />,
  music: <Music size={15} />,
}

export function SidebarGroupLayout<T = SidebarGroupItemData>({
  title,
  headerAction,
  items,
  className,
  labelClassName,
  mapItem,
  renderLeading,
  renderActions,
  renderTrailing,
  showMoreButton = false,
  moreLabel = 'More',
  onMoreClick,
}: SidebarGroupLayoutProps<T>) {
  // Safe route location lookup for TanStack Router
  let pathname = ''
  try {
    pathname = useRouterState({ select: (s) => s.location.pathname })
  } catch {
    // Fallback if rendered outside TanStack Router provider
  }

  const defaultRenderLeading = (mapped: SidebarGroupItemData) => {
    if (mapped.icon) {
      if (typeof mapped.icon === 'string') {
        return (
          <span className="flex-shrink-0 text-current">
            {defaultIconMap[mapped.icon] || <Hexagon size={15} />}
          </span>
        )
      }
      return <span className="flex-shrink-0 text-current">{mapped.icon}</span>
    }

    if (mapped.color) {
      return (
        <span
          className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full"
          style={{ backgroundColor: mapped.color }}
        />
      )
    }

    return null
  }

  return (
    <SidebarGroup className={cn('gap-1 p-0', className)}>
      {title && (
        <SidebarGroupLabel
          className={cn(
            'flex items-center justify-between px-3 text-[0.65rem] font-bold tracking-wider text-ns-faint uppercase',
            labelClassName
          )}
        >
          <span>{title}</span>
          {headerAction}
        </SidebarGroupLabel>
      )}

      <SidebarMenu className="gap-0.5">
        {items.map((rawItem, index) => {
          const mapped = mapItem
            ? mapItem(rawItem)
            : (rawItem as unknown as SidebarGroupItemData)
          const key =
            mapped.id || mapped.to || mapped.href || `${mapped.label}-${index}`

          const isActive =
            mapped.active ??
            (mapped.to
              ? mapped.exact
                ? pathname === mapped.to
                : pathname.startsWith(mapped.to) && mapped.to !== '/dashboard'
              : false)

          const itemContent = (
            <>
              {renderLeading
                ? renderLeading(rawItem, mapped)
                : defaultRenderLeading(mapped)}
              <span className="truncate">{mapped.label}</span>
              {renderTrailing && renderTrailing(rawItem, mapped)}
              {mapped.badge !== undefined && (
                <span className="ml-auto rounded-full bg-ns-active px-1.5 py-0.5 text-[10px] font-semibold text-ns-muted">
                  {mapped.badge}
                </span>
              )}
            </>
          )

          const baseItemClasses = cn(
            'flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium no-underline transition-all',
            isActive
              ? 'bg-ns-active text-ns-primary-lt shadow-[inset_0_0_0_1px_var(--color-ns-border-em)]'
              : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text-2'
          )

          return (
            <SidebarMenuItem key={key} className="group/item relative">
              <SidebarMenuButton asChild isActive={isActive}>
                {mapped.to ? (
                  <Link to={mapped.to} className={baseItemClasses}>
                    {itemContent}
                  </Link>
                ) : mapped.href ? (
                  <a href={mapped.href} className={baseItemClasses}>
                    {itemContent}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={mapped.onClick}
                    disabled={mapped.disabled}
                    className={baseItemClasses}
                  >
                    {itemContent}
                  </button>
                )}
              </SidebarMenuButton>

              {renderActions && renderActions(rawItem, mapped)}
            </SidebarMenuItem>
          )
        })}

        {showMoreButton && (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onMoreClick}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ns-muted transition-all hover:bg-ns-hover hover:text-ns-text-2"
            >
              <MoreHorizontal size={15} />
              <span>{moreLabel}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default SidebarGroupLayout
