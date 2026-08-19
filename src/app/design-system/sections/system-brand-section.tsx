import { useState } from 'react'
import { FolderOpen, Sparkles, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import {
  BrandLogo,
  ConfirmDeleteModal,
  DotmCircular,
  EmptyState,
  GlowCard,
  GlowCardGrid,
  PixelCard,
} from '@/shared/ui/system'
import { GoogleIcon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/core'
import { ShowcaseCard } from '../components/showcase-card'

export function SystemBrandSection() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      toast.success('Sample item deleted successfully!')
    }, 1500)
  }

  return (
    <section id="system-brand" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            06
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Brand & System Patterns (`src/shared/ui/system/`)
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          Signature brand patterns and interactive components unique to Node
          Space (Pixel Cards, Glow Grid, Dotmatrix, Brand Logos).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Brand Logo & OAuth Icons */}
        <ShowcaseCard
          title="Brand Logo & Icons"
          description="Node Space official branding logo and Google OAuth icon"
          codeBadge="<BrandLogo /> / <GoogleIcon />"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <BrandLogo />
              <span className="text-[11px] text-ns-muted">Main Brand Logo</span>
            </div>

            <div className="h-10 w-px bg-ns-border-soft" />

            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl border border-ns-border-soft bg-ns-surface">
                <GoogleIcon width={22} height={22} />
              </div>
              <span className="text-[11px] text-ns-muted">Google OAuth</span>
            </div>
          </div>
        </ShowcaseCard>

        {/* Dotmatrix Circular Loader */}
        <ShowcaseCard
          title="Dotmatrix Circular LED Loader"
          description="Signature circular dot-matrix LED loading animation"
          codeBadge="<DotmCircular size={48} />"
        >
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex flex-col items-center gap-2">
              <DotmCircular size={32} />
              <span className="text-[10px] text-ns-muted">Small (32px)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DotmCircular size={48} />
              <span className="text-[10px] text-ns-muted">Medium (48px)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DotmCircular size={64} />
              <span className="text-[10px] text-ns-muted">Large (64px)</span>
            </div>
          </div>
        </ShowcaseCard>

        {/* PixelCard Interactive */}
        <ShowcaseCard
          title="Pixel Card (Hover Particle Canvas)"
          description="Interactive card with animated canvas pixel particles on hover"
          codeBadge="<PixelCard />"
          className="md:col-span-2"
        >
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <PixelCard className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-ns-primary/20 text-ns-primary-lt">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-ns-text">
                    Interactive Note Canvas
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-ns-muted">
                    Hover over this card to watch the canvas pixel particle
                    reaction.
                  </p>
                </div>
                <div className="pt-2">
                  <Button size="xs" variant="outline">
                    Explore Nodes
                  </Button>
                </div>
              </div>
            </PixelCard>

            <PixelCard className="p-6">
              <div className="flex flex-col gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-ns-secondary/20 text-ns-secondary">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-ns-text">
                    Zero Latency Sync
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-ns-muted">
                    Real-time state synchronization with Cloudflare Workers and
                    D1 database.
                  </p>
                </div>
                <div className="pt-2">
                  <Button size="xs" variant="secondary">
                    View Benchmarks
                  </Button>
                </div>
              </div>
            </PixelCard>
          </div>
        </ShowcaseCard>

        {/* GlowCardGrid */}
        <ShowcaseCard
          title="Glow Card Grid"
          description="Radial pointer glow gradient tracking cursor movements"
          codeBadge="<GlowCardGrid><GlowCard /></GlowCardGrid>"
          className="md:col-span-2"
        >
          <GlowCardGrid className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <GlowCard
              name="Workspace Alpha"
              handle="@nodespace/core"
              className="p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                  <FolderOpen className="size-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-ns-text">
                    Architecture Specs
                  </h5>
                  <p className="text-xs text-ns-muted">
                    14 files · Updated 2 hours ago
                  </p>
                </div>
              </div>
            </GlowCard>

            <GlowCard
              name="Research Notes"
              handle="@nodespace/docs"
              className="p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-ns-text">
                    Design Tokens v2
                  </h5>
                  <p className="text-xs text-ns-muted">
                    8 files · Updated yesterday
                  </p>
                </div>
              </div>
            </GlowCard>
          </GlowCardGrid>
        </ShowcaseCard>

        {/* System Empty State Variants */}
        <ShowcaseCard
          title="System Empty States"
          description="Context-aware empty state illustrations and actions"
          codeBadge="<EmptyState variant='folder | search | notFound' />"
          className="md:col-span-2"
        >
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-ns-border-soft bg-ns-surface/40 p-4">
              <EmptyState
                variant="folder"
                compact
                action={
                  <Button size="xs" variant="outline">
                    Create New Folder
                  </Button>
                }
              />
            </div>
            <div className="rounded-xl border border-ns-border-soft bg-ns-surface/40 p-4">
              <EmptyState variant="search" compact />
            </div>
          </div>
        </ShowcaseCard>

        {/* Confirm Delete Modal Trigger */}
        <ShowcaseCard
          title="Confirm Delete Modal"
          description="Critical action confirmation modal with destructive warning styling"
          codeBadge="<ConfirmDeleteModal />"
          className="md:col-span-2"
        >
          <div className="flex flex-col items-center gap-3 py-2">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="mr-1.5 size-4" />
              Open Confirm Delete Modal
            </Button>

            <ConfirmDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteConfirm}
              itemName="Design System Showcase Node"
              isPending={isDeleting}
            />
            <span className="text-xs text-ns-muted">
              Includes backdrop blur, warning badge icon, and delete mutation
              pending state.
            </span>
          </div>
        </ShowcaseCard>
      </div>
    </section>
  )
}
