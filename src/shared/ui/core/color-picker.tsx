import * as React from 'react'
import {
  Check,
  SlidersHorizontal,
  Pipette,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from './button'

export const DEFAULT_PRESET_COLORS = [
  '#a78bfa',
  '#34d399',
  '#60a5fa',
  '#f87171',
  '#f97316',
  '#fbbf24',
  '#ec4899',
  '#38bdf8',
  '#a1a1aa',
  '#6366f1',
]

export const EXTENDED_PALETTE = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#f43f5e',
  '#64748b',
]

export interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  presetColors?: string[]
  allowCustom?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  defaultOpenCustomCard?: boolean
  isDefaultOpen?: boolean
  variant?: 'inline' | 'collapse'
}

const SIZE_MAP = {
  sm: {
    swatch: 'h-5 w-5',
    icon: 10,
    gap: 'gap-1.5',
  },
  md: {
    swatch: 'h-6 w-6',
    icon: 12,
    gap: 'gap-2',
  },
  lg: {
    swatch: 'h-8 w-8',
    icon: 16,
    gap: 'gap-2.5',
  },
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = (hex || '#3b82f6').replace('#', '').trim()
  if (c.length === 3) {
    c = c
      .split('')
      .map((x) => x + x)
      .join('')
  }
  const num = parseInt(c, 16)
  if (isNaN(num)) return { h: 260, s: 80, l: 65 }
  const r = ((num >> 16) & 255) / 255
  const g = ((num >> 8) & 255) / 255
  const b = (num & 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function ColorPicker({
  value = DEFAULT_PRESET_COLORS[0],
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  allowCustom = true,
  disabled = false,
  size = 'md',
  className,
  defaultOpenCustomCard = false,
  isDefaultOpen = false,
  variant = 'collapse',
}: ColorPickerProps) {
  const sizeConfig = SIZE_MAP[size]
  const isPresetSelected = presetColors.some(
    (c) => c.toLowerCase() === value?.toLowerCase()
  )
  const isCustomSelected = Boolean(value && !isPresetSelected)

  const isInline = variant === 'inline' || isDefaultOpen

  const [isOpenCustomCard, setIsOpenCustomCard] = React.useState(
    isInline || defaultOpenCustomCard || isCustomSelected
  )

  React.useEffect(() => {
    if (isInline) {
      setIsOpenCustomCard(true)
    }
  }, [isInline])

  const showCustomButton = allowCustom && !isInline
  const showCustomCard = allowCustom && (isInline || isOpenCustomCard)

  // Local state for HSL slider control
  const initialHsl = React.useMemo(() => hexToHsl(value), [value])
  const [hue, setHue] = React.useState(initialHsl.h)
  const [lightness, setLightness] = React.useState(initialHsl.l)
  const [hexInput, setHexInput] = React.useState(value || '#a78bfa')

  // Sync hexInput when external value changes
  React.useEffect(() => {
    setHexInput(value || '')
    const hsl = hexToHsl(value)
    setHue(hsl.h)
    setLightness(hsl.l)
  }, [value])

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number(e.target.value)
    setHue(newHue)
    const newHex = hslToHex(newHue, initialHsl.s || 85, lightness)
    setHexInput(newHex)
    onChange?.(newHex)
  }

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLightness = Number(e.target.value)
    setLightness(newLightness)
    const newHex = hslToHex(hue, initialHsl.s || 85, newLightness)
    setHexInput(newHex)
    onChange?.(newHex)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#?([0-9A-F]{3}){1,2}$/i.test(val)) {
      const formattedHex = val.startsWith('#') ? val : `#${val}`
      onChange?.(formattedHex)
    }
  }

  const handleEyeDropper = async () => {
    if (disabled) return
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        if (result?.srgbHex) {
          onChange?.(result.srgbHex)
        }
      } catch {
        // User cancelled eye dropper
      }
    }
  }

  const supportsEyeDropper =
    typeof window !== 'undefined' && 'EyeDropper' in window

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className={cn('flex flex-wrap items-center pl-3', sizeConfig.gap)}>
        {presetColors.map((color) => {
          const isSelected = value?.toLowerCase() === color.toLowerCase()
          return (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(color)}
              title={color}
              aria-label={`Select color ${color}`}
              style={{ backgroundColor: color }}
              className={cn(
                'relative flex items-center justify-center rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ns-primary focus-visible:outline-none',
                sizeConfig.swatch,
                disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:scale-110',
                isSelected
                  ? 'scale-110 opacity-100 shadow-md ring-2 ring-white ring-offset-2 ring-offset-ns-panel'
                  : 'opacity-70 hover:opacity-100'
              )}
            >
              {isSelected && (
                <Check
                  size={sizeConfig.icon}
                  className="text-white drop-shadow-md"
                />
              )}
            </button>
          )
        })}

        {showCustomButton && (
          <Button
            disabled={disabled}
            onClick={() => setIsOpenCustomCard(!isOpenCustomCard)}
            title="Toggle Custom Color Card"
            className="mt-2"
            type="button"
          >
            <SlidersHorizontal size={12} />
            <span>Custom</span>
            {isOpenCustomCard ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </Button>
        )}
      </div>

      {/* Inline Custom Color Card */}
      {showCustomCard && (
        <div className="my-3 flex animate-in flex-col gap-3 rounded-xl border border-ns-border-soft bg-ns-active/40 p-3 shadow-lg backdrop-blur-md transition-all fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] font-bold tracking-wider text-ns-ghost uppercase">
              Custom Color Card
            </span>
            <div className="flex items-center gap-1.5">
              {supportsEyeDropper && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleEyeDropper}
                  title="Pick color from screen"
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-ns-border-soft bg-ns-panel text-ns-ghost transition-colors hover:border-ns-ghost hover:text-white"
                >
                  <Pipette size={12} />
                </button>
              )}
              {/* Color Preview Badge */}
              <div
                className="h-5 w-5 rounded-full border border-white/20 shadow-inner"
                style={{ backgroundColor: value }}
                title={`Current: ${value}`}
              />
            </div>
          </div>

          {/* Extended Swatch Palette Grid */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {EXTENDED_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                disabled={disabled}
                onClick={() => onChange?.(c)}
                style={{ backgroundColor: c }}
                title={c}
                className={cn(
                  'h-4 w-4 cursor-pointer rounded-full transition-transform hover:scale-125',
                  value?.toLowerCase() === c.toLowerCase()
                    ? 'scale-125 ring-2 ring-white'
                    : 'opacity-80 hover:opacity-100'
                )}
              />
            ))}
          </div>

          {/* Hue Spectrum Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[0.65rem] font-medium text-ns-faint">
              <span>Hue Spectrum</span>
              <span>{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              disabled={disabled}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg focus:outline-none"
              style={{
                background:
                  'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              }}
            />
          </div>

          {/* Lightness Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[0.65rem] font-medium text-ns-faint">
              <span>Shade / Brightness</span>
              <span>{lightness}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              value={lightness}
              onChange={handleLightnessChange}
              disabled={disabled}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg focus:outline-none"
              style={{
                background: `linear-gradient(to right, #000000 0%, ${hslToHex(hue, 85, 50)} 50%, #ffffff 100%)`,
              }}
            />
          </div>

          {/* Hex Input Row */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[0.7rem] font-semibold text-ns-ghost">
              Hex:
            </span>
            <div className="relative flex-1">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                disabled={disabled}
                placeholder="#HEX..."
                maxLength={7}
                className="w-full rounded-lg border border-ns-border bg-ns-panel/80 px-2.5 py-1 font-mono text-xs text-white placeholder-ns-faint focus:border-ns-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
