import { useState } from 'react'
import {
  Check,
  Laptop,
  Moon,
  Paintbrush,
  RotateCcw,
  Save,
  Sun,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { ACCENT_PRESETS, useThemeStore } from '@/shared/stores/use-theme-store'
import type { ThemeMode } from '@/shared/stores/use-theme-store'
import {
  Button,
  ColorPicker,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Separator,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { saveThemeSettingsFn } from '@/features/settings'

const APPEARANCE_MODES: {
  id: ThemeMode
  title: string
  description: string
  icon: typeof Sun
}[] = [
  {
    id: 'dark',
    title: 'Dark Mode',
    description: 'Deep violet neon canvas',
    icon: Moon,
  },
  {
    id: 'light',
    title: 'Light Mode',
    description: 'Crisp bright canvas',
    icon: Sun,
  },
  {
    id: 'system',
    title: 'System',
    description: 'Auto OS sync',
    icon: Laptop,
  },
]

export function AppearanceDrawer() {
  const {
    mode,
    accent,
    customColor,
    isDrawerOpen,
    setDrawerOpen,
    setMode,
    setAccent,
    setCustomColor,
  } = useThemeStore()

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
    <Drawer direction="right" open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="fixed top-0 right-0 z-ns-modal flex h-full w-full flex-col border-l border-ns-border bg-ns-surface/98 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-w-md md:max-w-lg">
        {/* Drawer Header */}
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-ns-border-soft px-6 py-4">
          <div className="flex items-center gap-3 text-left">
            <div className="flex size-9 items-center justify-center rounded-xl border border-ns-primary/30 bg-ns-primary/15 text-ns-primary-lt">
              <Paintbrush className="size-4.5" />
            </div>
            <div>
              <DrawerTitle className="text-base font-bold text-ns-text">
                Appearance & Theme
              </DrawerTitle>
              <DrawerDescription className="text-xs text-ns-muted">
                Personalize your workspace colors and appearance
              </DrawerDescription>
            </div>
          </div>

          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text"
            >
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Drawer Body ScrollArea */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-7 pb-6">
            {/* 1. Mode Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold tracking-wider text-ns-muted uppercase">
                01. Appearance Mode
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {APPEARANCE_MODES.map((item) => {
                  const Icon = item.icon
                  const isSelected = mode === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={cn(
                        'group flex flex-col items-center justify-between rounded-xl border p-3 text-center transition-all focus:outline-hidden',
                        isSelected
                          ? 'border-ns-primary bg-ns-surface shadow-md ring-2 ring-ns-primary/30'
                          : 'border-ns-border-soft bg-ns-surface/50 hover:border-ns-border hover:bg-ns-surface'
                      )}
                    >
                      {/* Mini preview */}
                      <div
                        className={cn(
                          'mb-2 flex h-14 w-full flex-col justify-between rounded-md border p-1.5 transition-all',
                          item.id === 'light'
                            ? 'border-zinc-300 bg-white text-zinc-900 shadow-inner'
                            : item.id === 'dark'
                              ? 'border-violet-900/60 bg-[#09070f] text-white shadow-inner'
                              : 'border-ns-border-soft bg-gradient-to-r from-white to-[#09070f]'
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <div className="size-1.5 rounded-full bg-red-400" />
                          <div className="size-1.5 rounded-full bg-amber-400" />
                          <div className="size-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <div
                          className={cn(
                            'h-1.5 w-3/4 rounded',
                            item.id === 'light' ? 'bg-zinc-200' : 'bg-zinc-800'
                          )}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Icon className="size-3.5 text-ns-primary-lt" />
                        <span className="text-xs font-semibold text-ns-text">
                          {item.title}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator className="bg-ns-border-soft" />

            {/* 2. Accent Color Palette */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-wider text-ns-muted uppercase">
                  02. Accent Color Preset
                </label>
                <span className="text-[11px] font-semibold text-ns-primary-lt capitalize">
                  Current: {accent}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {ACCENT_PRESETS.map((preset) => {
                  const isSelected = accent === preset.id

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAccent(preset.id)}
                      className={cn(
                        'group flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all focus:outline-hidden',
                        isSelected
                          ? 'border-ns-primary bg-ns-surface shadow-xs ring-2 ring-ns-primary/30'
                          : 'border-ns-border-soft bg-ns-surface/50 hover:border-ns-border hover:bg-ns-surface'
                      )}
                    >
                      <div
                        className="relative flex size-6 shrink-0 items-center justify-center rounded-full shadow-sm"
                        style={{ backgroundColor: preset.primaryColor }}
                      >
                        {isSelected && (
                          <Check className="size-3 stroke-[3] text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-ns-text">
                          {preset.name}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator className="bg-ns-border-soft" />

            {/* 3. Custom ColorPicker */}
            <div className="space-y-3">
              <label className="text-xs font-bold tracking-wider text-ns-muted uppercase">
                03. Custom Hex Palette (ColorPicker)
              </label>

              <div className="rounded-xl border border-ns-border-soft bg-ns-surface/70 p-4">
                <ColorPicker
                  value={customColor || '#7c3aed'}
                  onChange={(newColor) => setCustomColor(newColor)}
                  variant="inline"
                  allowCustom
                  size="md"
                />

                <div className="mt-3 flex items-center justify-between border-t border-ns-border-soft pt-3">
                  <span className="text-xs text-ns-muted">Selected HEX:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-4 rounded-full border border-ns-border"
                      style={{ backgroundColor: customColor || '#7c3aed' }}
                    />
                    <code className="rounded border border-ns-border-soft bg-ns-surface px-2 py-0.5 font-mono text-xs font-bold text-ns-text">
                      {customColor || '#7c3aed'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-ns-border-soft bg-ns-surface px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetDefaults}
            className="gap-1.5 text-xs text-ns-muted hover:text-ns-text"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={handleSaveToDatabase}
            disabled={isSaving}
          >
            <Save className="size-3.5" />
            {isSaving ? 'Saving...' : 'Save to Cloud'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
