import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tags')({
  component: TagsPage,
})

function TagsPage() {
  return (
    <div className="min-h-full bg-ns-bg p-4">
      <section className="rounded-xl border border-ns-border bg-ns-panel p-6">
        <p className="mb-2 text-xs font-bold tracking-[0.12em] text-ns-faint uppercase">
          Dashboard
        </p>
        <h1 className="mb-2 text-xl font-bold text-ns-text">Tags</h1>
        <p className="max-w-2xl text-sm leading-6 text-ns-muted">
          Manage and filter content by tags.
        </p>
      </section>
    </div>
  )
}
