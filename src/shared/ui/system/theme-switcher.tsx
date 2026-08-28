import { useState } from 'react'
import { Check, Laptop, Moon, Paintbrush, Pipette, Sun } from 'lucide-react'
import { ACCENT_PRESETS, useThemeStore } from '@/shared/stores/use-theme-store'
import type { ThemeMode } from '@/shared/stores/use-theme-store'
import { Button } from '@/shared/ui/core/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/core/popover'
import { cn } from '@/shared/lib/utils'

interface ThemeSwitcherProps {
  className?: string
  showLabels?: boolean
  variant?: 'inline' | 'compact' | 'popover'
}

export function ThemeSwitcher({
  className,
  showLabels = false,
  variant = 'compact',
}: ThemeSwitcherProps) {
  const { mode, accent, customColor, setMode, setAccent, setCustomColor } =
    useThemeStore()

  const [customInput, setCustomInput] = useState(customColor || '#7c3aed')

  const modeButtons: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop },
  ]

  if (variant === 'popover') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2 border-ns-border bg-ns-surface/80', className)}
          >
            <Paintbrush className="size-3.5 text-ns-primary-lt" />
            <span className="text-xs font-medium capitalize">
              Theme: {mode} ({accent})
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-72 space-y-4 rounded-xl border border-ns-border bg-ns-panel p-4 text-ns-text shadow-xl"
        >
          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-ns-border-soft bg-ns-surface p-1">
              {modeButtons.map((btn) => {
                const Icon = btn.icon
                const isActive = mode === btn.value
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => setMode(btn.value)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all',
                      isActive
                        ? 'bg-ns-primary font-semibold text-white shadow-xs'
                        : 'text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text'
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{btn.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
              Accent Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = accent === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    title={preset.name}
                    onClick={() => setAccent(preset.id)}
                    className={cn(
                      'relative flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-hidden',
                      isSelected
                        ? 'ring-2 ring-ns-text ring-offset-2 ring-offset-ns-bg'
                        : ''
                    )}
                    style={{ backgroundColor: preset.primaryColor }}
                  >
                    {isSelected && (
                      <Check className="size-3.5 stroke-[3] text-white" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="space-y-1.5 border-t border-ns-border-soft pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ns-muted">Custom Hex</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value)
                    setCustomColor(e.target.value)
                  }}
                  className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value)
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      setCustomColor(e.target.value)
                    }
                  }}
                  placeholder="#7c3aed"
                  className="h-7 w-20 rounded border border-ns-border-soft bg-ns-surface px-1.5 font-mono text-[11px] text-ns-text uppercase outline-hidden focus:border-ns-primary"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // Compact inline variant
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Mode Switcher Group */}
      <div className="flex items-center rounded-lg border border-ns-border-soft bg-ns-surface/80 p-0.5 shadow-xs">
        {modeButtons.map((btn) => {
          const Icon = btn.icon
          const isActive = mode === btn.value
          return (
            <button
              key={btn.value}
              type="button"
              title={`${btn.label} Mode`}
              onClick={() => setMode(btn.value)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all',
                isActive
                  ? 'bg-ns-primary font-semibold text-white shadow-xs'
                  : 'text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text'
              )}
            >
              <Icon className="size-3.5" />
              {showLabels && <span>{btn.label}</span>}
            </button>
          )
        })}
      </div>

      {/* Quick Accent Selector */}
      <div className="hidden items-center gap-1 rounded-lg border border-ns-border-soft bg-ns-surface/80 px-2 py-1 sm:flex">
        {ACCENT_PRESETS.map((preset) => {
          const isSelected = accent === preset.id
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.name}
              onClick={() => setAccent(preset.id)}
              className={cn(
                'size-4.5 rounded-full transition-transform hover:scale-125 focus:outline-hidden',
                isSelected
                  ? 'scale-110 ring-2 ring-ns-text ring-offset-1 ring-offset-ns-bg'
                  : 'opacity-80 hover:opacity-100'
              )}
              style={{ backgroundColor: preset.primaryColor }}
            />
          )
        })}

        {/* Custom Color Pipette */}
        <label
          title="Pick Custom Color"
          className={cn(
            'relative ml-1 flex size-5 cursor-pointer items-center justify-center rounded-full border border-ns-border-soft bg-ns-surface-alt transition-transform hover:scale-110',
            accent === 'custom'
              ? 'ring-2 ring-ns-text ring-offset-1 ring-offset-ns-bg'
              : ''
          )}
        >
          <Pipette className="size-2.5 text-ns-text" />
          <input
            type="color"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value)
              setCustomColor(e.target.value)
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  )
}
