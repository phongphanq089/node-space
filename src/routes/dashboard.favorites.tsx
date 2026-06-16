import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  return (
    <div className="min-h-full bg-ns-bg p-4">
      <section className="rounded-xl border border-ns-border bg-ns-panel p-6">
        <p className="mb-2 text-xs font-bold tracking-[0.12em] text-ns-faint uppercase">
          Dashboard
        </p>
        <h1 className="mb-2 text-xl font-bold text-ns-text">Yêu thích</h1>
        <p className="max-w-2xl text-sm leading-6 text-ns-muted">
          Các nodes và notes bạn đã đánh dấu yêu thích.
        </p>
      </section>
    </div>
  )
}
