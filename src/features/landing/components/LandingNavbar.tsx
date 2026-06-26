import { Link } from '@tanstack/react-router'

import CornerCutButton from '@/components/ui/core/neon-button'

const NAV_LINKS = [
  { label: 'Features', href: '#' },
  { label: 'Templates', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Changelog', href: '#' },
]

export default function LandingNavbar() {
  return (
    <header className="relative z-50 w-full">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline transition-opacity hover:opacity-90"
        >
          <img
            src="/logo.png"
            alt="NodeSpace Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ns-muted no-underline transition-all hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <CornerCutButton color="red" variant="outline">
            Login
          </CornerCutButton>
          <CornerCutButton
            color="pink"
            hoverEffect="pulse"
            glowIntensity="high"
          >
            Get started free
          </CornerCutButton>
        </div>
      </div>
    </header>
  )
}
