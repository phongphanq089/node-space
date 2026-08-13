import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
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

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isPending?: boolean
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  isPending = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden border-red-500/30 bg-ns-panel/95 p-6 text-ns-text shadow-2xl backdrop-blur-2xl sm:max-w-md">
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-32 w-48 -translate-x-1/2 rounded-full bg-red-500/15 blur-3xl" />

        <DialogHeader className="shrink-0 gap-3 border-b border-ns-border-soft pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-inner">
              <AlertTriangle size={20} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-base font-extrabold text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-ns-faint">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {itemName && (
          <div className="my-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs font-medium text-white/90">
            Item to delete:{' '}
            <span className="font-bold text-red-400">
              &quot;{itemName}&quot;
            </span>
          </div>
        )}

        <DialogFooter className="mt-3 flex shrink-0 items-center justify-end gap-2 border-t border-ns-border-soft/40 pt-3">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex cursor-pointer items-center gap-1.5 rounded-sm bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            <span>{isPending ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
