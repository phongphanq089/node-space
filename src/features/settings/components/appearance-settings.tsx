import { useState } from 'react'
import {
  Check,
  Cloud,
  Folder,
  Laptop,
  Moon,
  Paintbrush,
  RotateCcw,
  Save,
  Search,
  Sun,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { ACCENT_PRESETS, useThemeStore } from '@/shared/stores/use-theme-store'
import type { ThemeMode } from '@/shared/stores/use-theme-store'
import { Button, ColorPicker, Input, Separator } from '@/shared/ui/core'
import { cn } from '@/shared/lib/utils'
import { saveThemeSettingsFn } from '../settings.fns'

const APPEARANCE_MODES: {
  id: ThemeMode
  title: string
  description: string
  icon: typeof Sun
}[] = [
  {
    id: 'dark',
    title: 'Dark Mode',
    description: 'Deep violet neon canvas designed for night and focus.',
    icon: Moon,
  },
  {
    id: 'light',
    title: 'Light Mode',
    description: 'Clean high-contrast bright canvas for daytime reading.',
    icon: Sun,
  },
  {
    id: 'system',
    title: 'System Mode',
    description: 'Automatically synchronizes with your device appearance.',
    icon: Laptop,
  },
]

export function AppearanceSettings() {
  const { mode, accent, customColor, setMode, setAccent, setCustomColor } =
    useThemeStore()

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveToDatabase = async () => {
    setIsSaving(true)
    try {
      await saveThemeSettingsFn({
        data: {
          mode,
          accent,
          customColor: accent === 'custom' ? customColor : undefined,
        },
      })
      toast.success('Theme preferences saved to database!', {
        description:
          'Your appearance settings will now sync across all your devices.',
      })
    } catch {
      toast.error('Failed to sync theme with server. Saved locally.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetDefaults = () => {
    setMode('dark')
    setAccent('violet')
    setCustomColor('#7c3aed')
    toast.info('Theme reset to Node Space defaults.')
  }

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/20 text-ns-primary-lt">
            <Paintbrush className="size-4.5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ns-text">
              Appearance & Theme Settings
            </h2>
            <p className="text-xs text-ns-muted">
              Customize how Node Space looks on your device and save preferences
              to your cloud profile.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Appearance Mode Selection Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ns-text">
            Appearance Mode
          </h3>
          <p className="text-xs text-ns-muted">
            Select your preferred color scheme mode.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {APPEARANCE_MODES.map((item) => {
            const Icon = item.icon
            const isSelected = mode === item.id

            return (
              <div
                key={item.id}
                onClick={() => setMode(item.id)}
                className={cn(
                  'group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200',
                  isSelected
                    ? 'border-ns-primary bg-ns-surface shadow-md ring-2 ring-ns-primary/30'
                    : 'border-ns-border-soft bg-ns-surface/60 hover:border-ns-border hover:bg-ns-surface'
                )}
              >
                {/* Mode Visual Mockup */}
                <div
                  className={cn(
                    'mb-3 flex h-24 w-full flex-col justify-between overflow-hidden rounded-lg border p-2.5 transition-all',
                    item.id === 'light'
                      ? 'border-zinc-300 bg-white text-zinc-900 shadow-inner'
                      : item.id === 'dark'
                        ? 'border-violet-900/60 bg-[#09070f] text-white shadow-inner'
                        : 'border-ns-border-soft bg-gradient-to-r from-white via-zinc-200 to-[#09070f] text-zinc-800'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-red-400" />
                      <div className="size-2 rounded-full bg-amber-400" />
                      <div className="size-2 rounded-full bg-emerald-400" />
                    </div>
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        item.id === 'light' ? 'bg-zinc-400' : 'bg-violet-400'
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={cn(
                        'h-2 w-3/4 rounded',
                        item.id === 'light' ? 'bg-zinc-200' : 'bg-zinc-800'
                      )}
                    />
                    <div
                      className={cn(
                        'h-2 w-1/2 rounded',
                        item.id === 'light' ? 'bg-zinc-200' : 'bg-zinc-800'
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-ns-primary-lt" />
                    <span className="text-sm font-semibold text-ns-text">
                      {item.title}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ns-primary text-white">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-ns-muted">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="bg-ns-border-soft" />

      {/* 2. Accent Palette Preset Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ns-text">
            Accent Color Theme
          </h3>
          <p className="text-xs text-ns-muted">
            Choose a primary accent tone for buttons, focus rings, badges, and
            indicators.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {ACCENT_PRESETS.map((preset) => {
            const isSelected = accent === preset.id

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAccent(preset.id)}
                className={cn(
                  'group flex flex-col items-center gap-2.5 rounded-xl border p-3.5 text-center transition-all focus:outline-hidden',
                  isSelected
                    ? 'border-ns-primary bg-ns-surface shadow-sm ring-2 ring-ns-primary/30'
                    : 'border-ns-border-soft bg-ns-surface/50 hover:border-ns-border hover:bg-ns-surface'
                )}
              >
                <div
                  className="relative flex size-10 items-center justify-center rounded-full shadow-md transition-transform group-hover:scale-105"
                  style={{ backgroundColor: preset.primaryColor }}
                >
                  {isSelected && (
                    <Check className="size-4 stroke-[3] text-white" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ns-text">
                    {preset.name}
                  </p>
                  <p className="font-mono text-[10px] text-ns-muted">
                    {preset.primaryColor}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator className="bg-ns-border-soft" />

      {/* 3. Custom ColorPicker Integration */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ns-text">
            Custom Accent Color
          </h3>
          <p className="text-xs text-ns-muted">
            Pick any custom HEX color to create your personalized workspace
            signature.
          </p>
        </div>

        <div className="rounded-xl border border-ns-border-soft bg-ns-surface/70 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-4">
              <ColorPicker
                value={customColor || '#7c3aed'}
                onChange={(newColor) => setCustomColor(newColor)}
                variant="inline"
                allowCustom
                size="md"
              />
            </div>

            <div className="flex min-w-[240px] flex-col items-center justify-center gap-2.5 rounded-xl border border-ns-border-soft bg-ns-bg/50 p-5 text-center">
              <span className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
                Active Custom Shade
              </span>
              <div
                className="size-14 rounded-xl border border-ns-border shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: customColor || '#7c3aed' }}
              />
              <code className="rounded border border-ns-border-soft bg-ns-surface px-2 py-1 font-mono text-xs font-bold text-ns-text">
                {customColor || '#7c3aed'}
              </code>
              <span className="text-[10px] text-ns-muted">
                {accent === 'custom' ? (
                  <strong className="text-emerald-400">
                    ● Custom theme active
                  </strong>
                ) : (
                  'Click color above to apply custom tone'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-ns-border-soft" />

      {/* 4. Live Workspace Interactive Preview Card */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ns-text">
            Live Workspace Preview
          </h3>
          <p className="text-xs text-ns-muted">
            See how your theme configuration transforms actual components in
            real-time.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-ns-border bg-ns-surface p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ns-border-soft pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/20 text-ns-primary-lt">
                <Folder className="size-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-ns-text">
                  Node Space Dashboard
                </h4>
                <p className="text-xs text-ns-muted">
                  Theme preview: <span className="capitalize">{mode}</span> mode
                  · <span className="capitalize">{accent}</span> accent
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-ns-primary/30 bg-ns-primary/15 px-2.5 py-1 text-xs font-semibold text-ns-primary-lt">
                Active Theme
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Search Input Mock */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ns-muted">
                Search Node
              </label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 size-3.5 text-ns-muted" />
                <Input
                  className="pl-8 text-xs"
                  placeholder="Filter workspace documents..."
                  defaultValue="Design Architecture Specs"
                />
              </div>
            </div>

            {/* Action Buttons Mock */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ns-muted">
                Actions
              </label>
              <div className="flex gap-2">
                <Button size="sm" variant="default" className="flex-1">
                  <Zap className="mr-1.5 size-3.5" />
                  Primary
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Outline
                </Button>
              </div>
            </div>

            {/* Feedback Badge Mock */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ns-muted">
                Status
              </label>
              <div className="flex items-center justify-between rounded-lg border border-ns-border-soft bg-ns-bg/40 px-3 py-2">
                <span className="text-xs text-ns-text">Cloud Sync</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <Cloud className="size-3" />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-ns-border-soft" />

      {/* 5. Save & Reset Action Bar */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetDefaults}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Reset Defaults
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={handleSaveToDatabase}
          disabled={isSaving}
          className="gap-2 px-6"
        >
          <Save className="size-4" />
          {isSaving ? 'Saving to Cloud...' : 'Save & Sync Preferences'}
        </Button>
      </div>
    </div>
  )
}
