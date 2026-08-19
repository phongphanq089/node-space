import { useState } from 'react'
import {
  ArrowLeft,
  Boxes,
  Code2,
  Component,
  Layers,
  Palette,
  Sparkles,
  Sliders,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Separator } from '@/shared/ui/core'

import { TokensSection } from './sections/tokens-section'
import { ButtonsSection } from './sections/buttons-section'
import { FormsSection } from './sections/forms-section'
import { OverlaysSection } from './sections/overlays-section'
import { FeedbackSection } from './sections/feedback-section'
import { SystemBrandSection } from './sections/system-brand-section'

const SECTIONS = [
  { id: 'tokens', label: 'Tokens & Colors', icon: Palette },
  { id: 'buttons', label: 'Buttons', icon: Component },
  { id: 'forms', label: 'Form Controls', icon: Sliders },
  { id: 'overlays', label: 'Overlays & Dialogs', icon: Layers },
  { id: 'feedback', label: 'Feedback & Layout', icon: Boxes },
  { id: 'system-brand', label: 'Brand & Patterns', icon: Sparkles },
]

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('tokens')

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-ns-bg text-ns-text">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-ns-border/40 bg-ns-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-ns-border-soft bg-ns-surface/60 px-2.5 py-1.5 text-xs font-medium text-ns-muted transition-colors hover:border-ns-border hover:text-ns-text"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to App</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-ns-primary/30 bg-ns-primary/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ns-primary-lt">
                Design System v1.0
              </span>
              <h1 className="text-sm font-bold tracking-tight text-ns-text sm:text-base">
                Node Space Component Showcase
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg bg-ns-primary px-5 py-1 md:flex">
              <span className="text-xs text-white">Source: src/shared/ui</span>
            </div>
          </div>
        </div>

        {/* Sticky Subnav Pills */}
        <div className="border-t border-ns-border-soft/60 bg-ns-surface/50 px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-7xl scrollbar-none items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon
              const isActive = activeTab === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-ns-primary text-white shadow-sm'
                      : 'text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {sec.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Info Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-ns-border/60 bg-gradient-to-br from-ns-surface via-ns-surface-alt to-ns-bg p-6 shadow-xl sm:p-8">
          <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 size-64 rounded-full bg-ns-primary/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-ns-primary/30 bg-ns-primary/10 px-3 py-1 text-xs font-medium text-ns-primary-lt">
              <Code2 className="size-3.5" />
              Single Source of Truth
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ns-text sm:text-3xl">
              Node Space UI Library & Token Registry
            </h2>
            <p className="text-sm leading-relaxed text-ns-muted">
              Interactive showcase and reference catalog for all UI components
              located in the{' '}
              <code className="text-ns-primary-lt">src/shared/ui/</code>{' '}
              directory. All components follow stateless, reusable primitives
              and design patterns ready for theming, dark mode, and custom
              accent colors.
            </p>
          </div>
        </div>

        {/* Sections */}
        <TokensSection />
        <Separator className="bg-ns-border-soft" />
        <ButtonsSection />
        <Separator className="bg-ns-border-soft" />
        <FormsSection />
        <Separator className="bg-ns-border-soft" />
        <OverlaysSection />
        <Separator className="bg-ns-border-soft" />
        <FeedbackSection />
        <Separator className="bg-ns-border-soft" />
        <SystemBrandSection />
      </main>
    </div>
  )
}
