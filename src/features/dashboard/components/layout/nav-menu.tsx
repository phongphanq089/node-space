import { Link, useRouterState } from '@tanstack/react-router'
import { NAV } from '../../data/mock'

const NavMenu = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <div className="px-4 pb-4">
      {NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to) && item.to !== '/dashboard'
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium no-underline transition-all ${
              isActive
                ? 'bg-ns-active text-ns-accent-lt shadow-[inset_0_0_0_1px_var(--color-ns-border-em)]'
                : 'text-ns-muted hover:bg-ns-hover hover:text-ns-text-2'
            }`}
          >
            <span className="w-4 text-center text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default NavMenu
