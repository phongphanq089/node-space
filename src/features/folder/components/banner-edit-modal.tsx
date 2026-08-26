import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/core/dialog'
import { Button } from '@/shared/ui/core/button'
import { FilePond } from 'react-filepond'
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Loader2,
  Film,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useUploadMediaMutation } from '@/features/media'
import { useUpdateHeroBannerMutation } from '../hooks/use-folders'
import {
  useHeroBannerStore,
  BANNER_PRESETS,
  DEFAULT_BANNER_URL,
} from '../store/use-hero-banner-store'
import { toast } from 'sonner'

export interface BannerEditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BannerEditModal({ isOpen, onClose }: BannerEditModalProps) {
  const { bannerUrl, selectedPresetId, setBannerUrl, resetBannerUrl } =
    useHeroBannerStore()
  const uploadMediaMutation = useUploadMediaMutation()
  const updateHeroBannerMutation = useUpdateHeroBannerMutation()

  const [activeTab, setActiveTab] = useState<'upload' | 'presets'>('upload')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    selectedPresetId
  )
  const [previewUrl, setPreviewUrl] = useState<string>(bannerUrl)
  const [files, setFiles] = useState<any[]>([])

  // Synchronize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(bannerUrl)
      setSelectedPreset(selectedPresetId)
      setFiles([])
    }
  }, [isOpen, bannerUrl, selectedPresetId])

  const handleUpdateFiles = useCallback((fileItems: any[]) => {
    setFiles((prev) => {
      if (prev.length === 0 && fileItems.length === 0) return prev
      if (
        prev.length === fileItems.length &&
        prev[0]?.file === fileItems[0]?.file &&
        prev[0]?.source === fileItems[0]?.source
      ) {
        return prev
      }
      return fileItems
    })

    if (fileItems.length > 0 && fileItems[0]?.file instanceof File) {
      const objectUrl = URL.createObjectURL(fileItems[0].file)
      setPreviewUrl(objectUrl)
      setSelectedPreset(null)
    }
  }, [])

  const handleSelectPreset = (presetId: string, url: string) => {
    setSelectedPreset(presetId)
    setPreviewUrl(url)
    setFiles([])
  }

  const handleResetToDefault = async () => {
    resetBannerUrl()
    setPreviewUrl(DEFAULT_BANNER_URL)
    setSelectedPreset('default')
    setFiles([])
    try {
      await updateHeroBannerMutation.mutateAsync({
        bannerUrl: DEFAULT_BANNER_URL,
        presetId: 'default',
      })
    } catch {
      // Ignored
    }
    toast.success('Reset banner to default')
    onClose()
  }

  const handleSave = async () => {
    try {
      let finalBannerUrl = previewUrl

      // If user uploaded a new local file via FilePond, upload it to Cloudflare R2
      const fileItem = files[0]
      if (fileItem?.file instanceof File) {
        const uploadRes = await uploadMediaMutation.mutateAsync({
          file: fileItem.file,
          options: {
            folder: 'banners',
            maxSizeInMB: 20,
            allowedTypes: [
              'image/jpeg',
              'image/png',
              'image/webp',
              'image/gif',
              'image/svg+xml',
            ],
          },
        })
        finalBannerUrl = uploadRes.url
      }

      setBannerUrl(finalBannerUrl, selectedPreset)

      // Persist to Database
      await updateHeroBannerMutation.mutateAsync({
        bannerUrl: finalBannerUrl,
        presetId: selectedPreset,
      })

      toast.success('Banner updated and saved to account!')
      onClose()
    } catch {
      // Toast error handled in mutation
    }
  }

  const isUploading =
    uploadMediaMutation.isPending || updateHeroBannerMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-full flex-col overflow-hidden border-ns-border-em bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-h-[92vh] sm:max-w-2xl">
        <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-36 w-60 -translate-x-1/2 rounded-full bg-ns-primary/20 blur-3xl" />

        {/* Modal Header */}
        <DialogHeader className="shrink-0 gap-1 border-b border-ns-border-soft pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ns-border bg-ns-active/80 text-ns-primary-lt shadow-inner">
                <ImageIcon size={20} />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-base font-extrabold text-white">
                  Customize Hero Banner
                </DialogTitle>
                <DialogDescription className="text-xs text-ns-faint">
                  Upload an image or animated GIF, or choose from preset themes
                </DialogDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs text-ns-muted hover:text-white"
            >
              <RotateCcw size={13} />
              <span>Reset Default</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="no-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto py-4">
          {/* Live Preview Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-ns-muted">
              <span>Preview</span>
              {previewUrl.toLowerCase().endsWith('.gif') && (
                <span className="flex items-center gap-1 rounded bg-purple-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-purple-300">
                  <Film size={11} /> GIF ANIMATED
                </span>
              )}
            </div>
            <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-inner sm:h-40">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url('${previewUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09070f] via-black/40 to-transparent" />
              <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between">
                <div>
                  <div className="text-[0.65rem] font-semibold text-emerald-400 uppercase">
                    Live Preview
                  </div>
                  <div className="text-sm font-bold text-white drop-shadow-md">
                    Personal Knowledge Hub
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-xl border border-ns-border/80 bg-ns-panel/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all',
                activeTab === 'upload'
                  ? 'bg-ns-primary text-white shadow-md'
                  : 'text-ns-muted hover:text-white'
              )}
            >
              <Upload size={14} />
              <span>Upload Custom (Image / GIF)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all',
                activeTab === 'presets'
                  ? 'bg-ns-primary text-white shadow-md'
                  : 'text-ns-muted hover:text-white'
              )}
            >
              <Sparkles size={14} />
              <span>Preset Themes</span>
            </button>
          </div>

          {/* Tab 1: Upload with FilePond */}
          {activeTab === 'upload' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-dashed border-ns-border-md bg-ns-surface/30 p-2">
                <FilePond
                  files={files}
                  onupdatefiles={handleUpdateFiles}
                  allowMultiple={false}
                  allowImagePreview={true}
                  acceptedFileTypes={[
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                    'image/gif',
                    'image/svg+xml',
                  ]}
                  name="banner-file"
                  labelIdle='Drag & Drop your banner image or <span class="filepond--label-action">Browse</span><br/><span style="font-size: 0.7rem; opacity: 0.7;">Supports PNG, JPG, WebP, GIF (Max 20MB)</span>'
                  labelFileTypeNotAllowed="Only image and GIF files are allowed"
                  credits={false}
                />
              </div>
              <p className="text-[0.7rem] text-ns-faint">
                💡 Tip: Animated GIFs are supported! High-resolution landscape
                aspect ratios (e.g. 16:9 or 21:9) work best.
              </p>
            </div>
          )}

          {/* Tab 2: Presets Gallery */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BANNER_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id, preset.url)}
                    className={cn(
                      'group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border text-left transition-all outline-none',
                      isSelected
                        ? 'border-ns-primary shadow-lg ring-2 ring-ns-primary/60'
                        : 'border-ns-border/70 hover:scale-[1.02] hover:border-ns-border-em'
                    )}
                  >
                    <div className="relative h-20 w-full overflow-hidden bg-black/60">
                      <img
                        src={preset.thumbnailUrl}
                        alt={preset.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ns-primary text-white shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="bg-ns-panel/90 p-2">
                      <span className="line-clamp-1 text-xs font-semibold text-white">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="mt-4 border-t border-ns-border-soft pt-4 sm:space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isUploading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Uploading Banner...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Save Banner</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
