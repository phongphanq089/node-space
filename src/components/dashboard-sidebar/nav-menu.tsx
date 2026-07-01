import { NAV } from '@/constants/moc-data'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Hexagon, Star, Clock, Tag, Trash2, Music } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={15} />,
  hexagon: <Hexagon size={15} />,
  star: <Star size={15} />,
  clock: <Clock size={15} />,
  tag: <Tag size={15} />,
  trash: <Trash2 size={15} />,
  music: <Music size={15} />,
}

const NavMenu = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="flex flex-col gap-0.5 px-4 pb-4">
      {NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to) && item.to !== '/dashboard'
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium no-underline transition-all ${
              isActive
                ? 'text-ns-primary-lt bg-ns-active shadow-[inset_0_0_0_1px_var(--color-ns-border-em)]'
                : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text-2'
            }`}
          >
            <span className="flex-shrink-0 text-current">
              {iconMap[item.icon] || iconMap.hexagon}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default NavMenu
