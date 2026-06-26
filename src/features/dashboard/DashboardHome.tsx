import FeatureHighlights from './components/FeatureHighlights'
import MusicPlayer from './components/MusicPlayer'
import NodesList from './components/NodesList'
import NotesList from './components/NotesList'

export default function DashboardHome() {
  return (
    <div className="min-h-full bg-ns-bg p-4">
      {/* Hero banner */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-ns-border bg-gradient-to-br from-ns-surface to-ns-panel p-6 sm:p-8">
        <div
          aria-hidden
          className="ns-hero-blur-accent-30 pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full opacity-50"
        />
        <div
          aria-hidden
          className="ns-hero-blur-purple-25 pointer-events-none absolute -right-8 -bottom-16 h-48 w-48 rounded-full opacity-40"
        />
        <h1 className="relative mb-2 text-xl font-bold text-ns-text sm:text-2xl">
          Welcome back, Kien 👋
          <br />
          Ready to connect ideas?
        </h1>
        <p className="relative mb-4 max-w-md text-sm text-ns-muted">
          Node-based notes help you think freely, connect all ideas, and build
          your knowledge.
        </p>
        <button
          id="btn-hero-explore"
          className="relative inline-flex items-center gap-2 rounded-xl border border-ns-border-em bg-ns-active px-5 py-2 text-sm font-semibold text-ns-accent-lt transition-all hover:bg-ns-hover-md"
        >
          Explore now →
        </button>
        <p className="relative mt-4 text-xs text-ns-faint">
          ✦ "The best way to predict the future is to invent it." – Alan Kay
        </p>
      </div>

      <FeatureHighlights />

      {/* 3-column layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_280px]">
        <NodesList />
        <NotesList />
        <MusicPlayer />
      </div>
    </div>
  )
}
