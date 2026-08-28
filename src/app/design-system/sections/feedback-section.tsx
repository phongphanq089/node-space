import {
  AlertCircle,
  CheckCircle2,
  Folder,
  Home,
  Info,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  ScrollArea,
  Separator,
  Skeleton,
} from '@/shared/ui/core'
import { ShowcaseCard } from '../components/showcase-card'

export function FeedbackSection() {
  const triggerPromiseToast = () => {
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: 'Project NodeSpace' }), 2000)
      )

    toast.promise(promise, {
      loading: 'Syncing workspace data...',
      success: 'Workspace updated successfully!',
      error: 'Could not sync changes.',
    })
  }

  return (
    <section id="feedback" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            05
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Data Display & Feedback (`src/shared/ui/core/`)
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          User avatars, breadcrumb paths, skeleton loaders, and toast feedback
          notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Avatars & Groups */}
        <ShowcaseCard
          title="Avatar & Avatar Groups"
          description="User avatar images, fallback initials, and stacked avatar groups"
          codeBadge="<Avatar /> / <AvatarGroup />"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" />
                <AvatarFallback>DF</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </ShowcaseCard>

        {/* Sonner Toast Triggers */}
        <ShowcaseCard
          title="Interactive Sonner Toasts"
          description="Sonner toast notifications with action responses"
          codeBadge="toast.success() | toast.error() | toast.promise()"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success('Note saved to cloud!')}
            >
              <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-400" />
              Success
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.error('Failed to sync changes. Check network.')
              }
            >
              <AlertCircle className="mr-1.5 size-3.5 text-red-400" />
              Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('New version 2.4 available.')}
            >
              <Info className="mr-1.5 size-3.5 text-sky-400" />
              Info
            </Button>
            <Button size="sm" variant="outline" onClick={triggerPromiseToast}>
              <Sparkles className="mr-1.5 size-3.5 text-ns-primary-lt" />
              Promise Toast
            </Button>
          </div>
        </ShowcaseCard>

        {/* Breadcrumb Navigation */}
        <ShowcaseCard
          title="Breadcrumb Navigation"
          description="Hierarchical path navigation"
          codeBadge="<Breadcrumb />"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1">
                  <Home className="size-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspaces</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Design System</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ShowcaseCard>

        {/* Skeleton Placeholders */}
        <ShowcaseCard
          title="Skeleton Loading State"
          description="Placeholder shimmer states during asynchronous data fetching"
          codeBadge="<Skeleton />"
        >
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </ShowcaseCard>

        {/* ScrollArea & Separator */}
        <ShowcaseCard
          title="ScrollArea & Custom Scrollbar"
          description="Custom themed scroll container with sleek scrollbars"
          codeBadge="<ScrollArea />"
        >
          <ScrollArea className="h-28 w-full max-w-xs rounded-md border border-ns-border-soft p-3">
            <div className="space-y-2 text-xs text-ns-muted">
              <p className="font-semibold text-ns-text">Notes List</p>
              <Separator className="my-1 bg-ns-border-soft" />
              <p>1. Architectural Design tokens synchronization</p>
              <p>2. Responsive drawer and keyboard navigation</p>
              <p>3. Cloudflare D1 Drizzle migration check</p>
              <p>4. Dark mode & Custom Accent picker</p>
              <p>5. End-to-end Vitest suite setup</p>
            </div>
          </ScrollArea>
        </ShowcaseCard>

        {/* Core Empty Container */}
        <ShowcaseCard
          title="Core Empty Container"
          description="Minimal empty state placeholder for lists and containers"
          codeBadge="<Empty />"
        >
          <Empty className="py-2">
            <EmptyMedia variant="icon">
              <Folder className="size-4 text-ns-primary-lt" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-xs font-semibold text-ns-text">
                No Files Found
              </EmptyTitle>
              <EmptyDescription className="text-[11px] text-ns-muted">
                Create your first node to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ShowcaseCard>
      </div>
    </section>
  )
}
