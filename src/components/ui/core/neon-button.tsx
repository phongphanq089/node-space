import type { ButtonHTMLAttributes, ReactNode } from 'react'
import React from 'react'
// ---- Types -------------------------------------------------

/** Named color presets or any valid CSS color string (e.g. "#ff4400", "hsl(180,100%,50%)") */
export type CCBColor = 'cyan' | 'pink' | 'green' | (string & {})

/** Button size */
export type CCBSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Visual style variant */
export type CCBVariant = 'solid' | 'outline' | 'ghost'

/** Which corner is cut */
export type CCBCorner =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'all'

/**
 * Hover animation preset:
 * - `glow`    — neon glow + white background flash (default for solid)
 * - `shift`   — bg color shift on hover (solid→white, outline→filled)
 * - `shine`   — diagonal shine sweep across the button
 * - `pulse`   — continuously pulsing glow while hovered
 * - `scan`    — a scan line travels top→bottom while hovered
 * - `flicker` — neon flicker effect while hovered
 * - `none`    — no hover animation
 */
export type CCBHoverEffect =
  | 'glow'
  | 'shift'
  | 'shine'
  | 'pulse'
  | 'scan'
  | 'flicker'
  | 'default'
  | 'none'

/** Controls the spread radius of the neon glow */
export type CCBGlowIntensity = 'low' | 'medium' | 'high'

// ---- Maps --------------------------------------------------

// ---- Maps --------------------------------------------------

export const COLOR_PRESETS: Record<string, string> = {
  cyan: '#00f3ff',
  pink: '#7c3aed',
  green: '#39ff14',
}

export const SIZE_CLASSES: Record<CCBSize, string> = {
  xs: 'px-4 py-2 text-xs',
  sm: 'px-6 py-3 text-xs',
  md: 'px-8 py-4 text-sm',
  lg: 'px-10 py-5 text-base',
  xl: 'px-12 py-6 text-lg',
}

export const CORNER_CLASSES: Record<CCBCorner, string> = {
  'bottom-right': 'ccb-clip-br',
  'bottom-left': 'ccb-clip-bl',
  'top-right': 'ccb-clip-tr',
  'top-left': 'ccb-clip-tl',
  all: 'ccb-clip-all',
}

export const HOVER_CLASSES: Record<CCBHoverEffect, string> = {
  glow: 'ccb-hover-glow',
  shift: 'ccb-hover-shift',
  shine: 'ccb-hover-shine',
  pulse: 'ccb-hover-pulse',
  scan: 'ccb-hover-scan',
  flicker: 'ccb-hover-flicker',
  default: 'ccb-hover-default',
  none: '',
}

export const GLOW_SIZES: Record<CCBGlowIntensity, number> = {
  low: 8,
  medium: 15,
  high: 28,
}

// ---- Component props ---------------------------------------

export interface BaseCornerCutButtonProps {
  children: ReactNode

  /**
   * Button accent color.
   * Use a preset name ("cyan" | "pink" | "green") or any CSS color value.
   * @default "cyan"
   */
  color?: CCBColor

  /**
   * Button size controlling padding and font size.
   * @default "md"
   */
  size?: CCBSize

  /**
   * Visual variant.
   * - `solid`   — filled with the accent color (matches the Hero "Explore Components" button)
   * - `outline` — transparent background with a 1.5 px accent border
   * - `ghost`   — subtle tinted background with accent text
   * @default "solid"
   */
  variant?: CCBVariant

  /**
   * Which corner receives the diagonal cut.
   * @default "bottom-right"
   */
  corner?: CCBCorner

  /**
   * Size of the corner cut in pixels.
   * @default 20
   */
  cornerSize?: number

  /**
   * Hover animation/effect.
   * @default "default"
   */
  hoverEffect?: CCBHoverEffect

  /**
   * Glow spread intensity for effects that use a neon glow.
   * @default "medium"
   */
  glowIntensity?: CCBGlowIntensity

  /**
   * When true an → arrow is appended that slides right on hover.
   * @default false
   */
  showArrow?: boolean

  /**
   * Hover effect color. Overrides the element color on hover (for glow and shift effects).
   */
  hoverColor?: CCBColor

  /**
   * When true, a solid button with 'shift' effect becomes outlined on hover.
   * @default false
   */
  hoverOutlined?: boolean

  /**
   * Overrides the button text color.
   * Use a preset name ("cyan" | "pink" | "green") or any CSS color value.
   * Defaults to `black` for solid variant and the accent color for outline/ghost.
   */
  textColor?: CCBColor
}

export type CornerCutButtonProps<T extends React.ElementType = 'button'> =
  BaseCornerCutButtonProps & {
    as?: T
  } & Omit<
      React.ComponentPropsWithoutRef<T>,
      keyof BaseCornerCutButtonProps | 'as'
    >

// ---- Styles Helper -----------------------------------------

/**
 * Helper function to compute styling classes and custom properties for a CornerCutButton.
 * Useful if you want to apply the styles manually to custom components.
 */
export function getCornerCutButtonStyles(
  props: BaseCornerCutButtonProps & {
    className?: string
    style?: React.CSSProperties
  }
) {
  const {
    color = 'cyan',
    size = 'md',
    variant = 'solid',
    corner = 'bottom-right',
    cornerSize = 20,
    hoverEffect = 'default',
    glowIntensity = 'medium',
    hoverColor,
    hoverOutlined = false,
    textColor,
    className = '',
    style,
  } = props

  const resolvedColor = COLOR_PRESETS[color] ?? color
  const resolvedHoverColor = hoverColor
    ? (COLOR_PRESETS[hoverColor] ?? hoverColor)
    : undefined
  const resolvedTextColor = textColor
    ? (COLOR_PRESETS[textColor] ?? textColor)
    : undefined
  const glowSize = GLOW_SIZES[glowIntensity]

  const ghostStyle =
    variant === 'ghost'
      ? {
          backgroundColor: 'color-mix(in srgb, var(--ccb-color) 12%, #000)',
          color: 'var(--ccb-color)',
        }
      : undefined

  const wrapperClasses = [
    'group/ccb relative inline-flex p-px',
    `ccb-wrapper-${hoverEffect}`,
    hoverEffect === 'flicker' ? 'ccb-wrapper' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperStyles = {
    '--ccb-color': resolvedColor,
    '--ccb-hover-color': resolvedHoverColor ?? resolvedColor,
    '--ccb-hover-bg': resolvedHoverColor ?? '#ffffff',
    '--ccb-corner-size': `${cornerSize}px`,
    '--ccb-glow-size': `${glowSize}px`,
    ...(resolvedTextColor ? { '--ccb-text-color': resolvedTextColor } : {}),
    ...style,
  } as React.CSSProperties

  const borderFrameClasses = [
    'pointer-events-none absolute inset-0 z-0 transition-[background,opacity] duration-300',
    CORNER_CLASSES[corner],
    variant === 'outline' ? 'bg-[var(--ccb-color)]' : 'bg-white/[0.08]',
    variant === 'solid' && hoverOutlined && hoverEffect === 'shift'
      ? 'group-hover/ccb:bg-[var(--ccb-hover-color)]'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const innerClasses = [
    'group font-orbitron relative flex-1 cursor-pointer overflow-hidden font-bold tracking-wider uppercase transition-all',
    SIZE_CLASSES[size],
    CORNER_CLASSES[corner],
    HOVER_CLASSES[hoverEffect],
    `ccb-${variant}`,
    hoverOutlined ? 'ccb-hover-outlined' : '',
    variant === 'solid'
      ? `bg-[var(--ccb-color)] ${resolvedTextColor ? 'text-[var(--ccb-text-color)]' : 'text-white'}`
      : '',
    variant === 'outline'
      ? `bg-black ${resolvedTextColor ? 'text-[var(--ccb-text-color)]' : 'text-[var(--ccb-color)]'}`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  const innerStyles = {
    ...ghostStyle,
    ...(resolvedTextColor && variant === 'ghost'
      ? { color: resolvedTextColor }
      : {}),
  } as React.CSSProperties

  return {
    wrapperClasses,
    wrapperStyles,
    borderFrameClasses,
    innerClasses,
    innerStyles,
  }
}

// ---- Component ---------------------------------------------

export function CornerCutButton<T extends React.ElementType = 'button'>({
  as,
  children,
  color = 'cyan',
  size = 'md',
  variant = 'solid',
  corner = 'bottom-right',
  cornerSize = 20,
  hoverEffect = 'default',
  glowIntensity = 'medium',
  showArrow = false,
  hoverColor,
  hoverOutlined = false,
  textColor,
  className = '',
  style,
  ...props
}: CornerCutButtonProps<T>) {
  const Component = as || 'button'

  const {
    wrapperClasses,
    wrapperStyles,
    borderFrameClasses,
    innerClasses,
    innerStyles,
  } = getCornerCutButtonStyles({
    color,
    size,
    variant,
    corner,
    cornerSize,
    hoverEffect,
    glowIntensity,
    hoverColor,
    hoverOutlined,
    textColor,
    className,
    style,
  })

  return (
    <div className={wrapperClasses} style={wrapperStyles}>
      {/* Border frame: 1px ring on all edges including the diagonal */}
      <div className={borderFrameClasses} aria-hidden="true" />

      <Component className={innerClasses} style={innerStyles} {...props}>
        {/* Shine sweep layer — only rendered when needed */}
        {hoverEffect === 'shine' && (
          <span className="ccb-shine-layer" aria-hidden="true" />
        )}

        {/* Scan line layer — only rendered when needed */}
        {hoverEffect === 'scan' && (
          <span className="ccb-scan-layer" aria-hidden="true" />
        )}

        {/* Content sits above decorative layers */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <span
              className="inline-block transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          )}
        </span>
      </Component>
    </div>
  )
}

export default CornerCutButton
