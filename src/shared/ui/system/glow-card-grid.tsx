/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useEffect, useRef } from 'react'

import { cn } from '@/shared/lib/utils'

export type GlowCardGridProps = React.ComponentPropsWithoutRef<'div'> & {
  // Card parameters
  cardRadius?: number

  // Icon parameters
  iconBlur?: number
  iconSaturate?: number
  iconBrightness?: number
  iconScale?: number
  iconOpacity?: number

  // Border parameters
  borderWidth?: number
  borderBlur?: number
  borderSaturate?: number
  borderBrightness?: number
  borderContrast?: number

  children: React.ReactNode
}

export function GlowCardGrid({
  cardRadius = 16,

  iconBlur = 25,
  iconSaturate = 5.0,
  iconBrightness = 1.3,
  iconScale = 4,
  iconOpacity = 0.3,

  borderWidth = 3,
  borderBlur = 10,
  borderSaturate = 4.2,
  borderBrightness = 2.5,
  borderContrast = 2.5,

  className,
  style,
  ...props
}: GlowCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!gridRef.current) return

      const cards = gridRef.current.querySelectorAll<HTMLElement>(
        "[data-slot='glow-card']"
      )

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const x = (event.clientX - centerX) / (rect.width / 2)
        const y = (event.clientY - centerY) / (rect.height / 2)

        card.style.setProperty('--pointer-x', x.toFixed(3))
        card.style.setProperty('--pointer-y', y.toFixed(3))
      })
    }

    document.addEventListener('pointermove', handlePointerMove)

    return () => document.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <div
      ref={gridRef}
      className={cn('w-full', className)}
      style={
        {
          '--card-radius': `${cardRadius}px`,
          '--card-icon-blur': `${iconBlur}px`,
          '--card-icon-saturate': iconSaturate,
          '--card-icon-brightness': iconBrightness,
          '--card-icon-scale': iconScale,
          '--card-icon-opacity': iconOpacity,
          '--card-border-width': `${borderWidth}px`,
          '--card-border-blur': `${borderBlur}px`,
          '--card-border-saturate': borderSaturate,
          '--card-border-brightness': borderBrightness,
          '--card-border-contrast': borderContrast,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export type GlowCardProps = {
  name?: string
  handle?: string
  avatar?: string
  className?: string
  children?: React.ReactNode
}

export function GlowCard({
  name,
  handle,
  avatar,
  className,
  children,
}: GlowCardProps) {
  return (
    <div
      data-slot="glow-card"
      className={cn(
        '@container relative w-full overflow-hidden rounded-(--card-radius) border border-ns-border bg-ns-primary/10 transition-[translate,scale] dark:bg-ns-panel',
        className
      )}
    >
      {/* Background glow effect */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex aspect-square items-center justify-center',
          'translate-x-[calc(var(--pointer-x,-10)*50cqi)] translate-y-[calc(var(--pointer-y,-10)*50cqh)] translate-z-0 scale-(--card-icon-scale)',
          'blur-(--card-icon-blur) brightness-(--card-icon-brightness) saturate-(--card-icon-saturate)',
          'opacity-(--card-icon-opacity) will-change-[transform,filter]'
        )}
      >
        <img className="size-20" src={avatar || '/hero-banner.png'} alt="" />
      </div>

      {/* Content wrapper (relative flow determines height of parent) */}
      <div className="relative z-ns-raised w-full">
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            {avatar && (
              <img className="size-20 rounded-full" src={avatar} alt={name} />
            )}
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-base leading-none font-semibold text-foreground">
                {name}
              </h2>
              <p className="text-sm leading-none text-foreground/50">
                {handle}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Glowing border overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-ns-base translate-z-0 rounded-(--card-radius)',
          'border-(length:--card-border-width) border-solid border-transparent',
          'backdrop-blur-(--card-border-blur) backdrop-brightness-(--card-border-brightness) backdrop-contrast-(--card-border-contrast) backdrop-saturate-(--card-border-saturate)',
          '[clip-path:inset(0_round_var(--card-radius))]'
        )}
        style={
          {
            maskImage:
              'linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)',
            maskOrigin: 'border-box, padding-box',
            maskClip: 'border-box, padding-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          } as React.CSSProperties
        }
      />
    </div>
  )
}
