import { useState } from 'react'
import {
  ArrowRight,
  Bookmark,
  Check,
  Download,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Button } from '@/shared/ui/core/button'
import { ShowcaseCard } from '../components/showcase-card'

export function ButtonsSection() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <section id="buttons" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            02
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Buttons & Actions (`src/shared/ui/core/button.tsx`)
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          Fundamental button interactive primitives supporting multiple
          variants, sizes, and built-in states.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Variants */}
        <ShowcaseCard
          title="Button Variants"
          description="All standard button styling variants"
          codeBadge="variant: default | secondary | outline | ghost | destructive | link"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Style</Button>
          </div>
        </ShowcaseCard>

        {/* Sizes */}
        <ShowcaseCard
          title="Button Sizes"
          description="Scale from extra-small to large"
          codeBadge="size: xs | sm | default | lg"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button size="xs" variant="outline">
              Size XS
            </Button>
            <Button size="sm" variant="outline">
              Size SM
            </Button>
            <Button size="default" variant="outline">
              Size Default
            </Button>
            <Button size="lg" variant="outline">
              Size LG
            </Button>
          </div>
        </ShowcaseCard>

        {/* Icon Only Buttons */}
        <ShowcaseCard
          title="Icon Buttons"
          description="Square icon button variants"
          codeBadge="size: icon-xs | icon-sm | icon | icon-lg"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="icon-xs" variant="outline" title="icon-xs">
              <Plus />
            </Button>
            <Button size="icon-sm" variant="outline" title="icon-sm">
              <Sparkles />
            </Button>
            <Button size="icon" variant="outline" title="icon">
              <Bookmark />
            </Button>
            <Button size="icon-lg" variant="outline" title="icon-lg">
              <Download />
            </Button>
            <Button size="icon" variant="destructive" title="Delete">
              <Trash2 />
            </Button>
          </div>
        </ShowcaseCard>

        {/* Buttons with Icons */}
        <ShowcaseCard
          title="Buttons with Leading & Trailing Icons"
          description="Combinations with leading and trailing icons"
          codeBadge="icon + text"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button variant="default" size="sm">
              <Plus className="mr-1.5 size-4" />
              New Node
            </Button>
            <Button variant="secondary" size="sm">
              Explore
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-1.5 size-4 text-ns-primary-lt" />
              AI Assistant
            </Button>
          </div>
        </ShowcaseCard>

        {/* Interactive & Loading States */}
        <ShowcaseCard
          title="States: Disabled & Loading"
          description="Disabled and interactive loading states"
          codeBadge="disabled | loading"
          className="md:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button disabled variant="default">
              Disabled Default
            </Button>
            <Button disabled variant="outline">
              Disabled Outline
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 2000)
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Click to Test Loading State'
              )}
            </Button>
            <Button variant="secondary">
              <Check className="mr-1.5 size-4 text-emerald-400" />
              Completed State
            </Button>
          </div>
        </ShowcaseCard>
      </div>
    </section>
  )
}
