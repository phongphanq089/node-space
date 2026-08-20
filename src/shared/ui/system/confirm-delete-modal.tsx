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
  description = 'This action is permanent and cannot be undone.',
  itemName,
  isPending = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <DialogContent className="rounded-lg border border-destructive/10 text-ns-text shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-md">
        <DialogHeader className="relative gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-destructive bg-destructive text-white">
              <AlertTriangle size={21} strokeWidth={2} />
            </div>

            <div className="min-w-0 pt-0.5 text-left">
              <DialogTitle className="text-base font-bold">{title}</DialogTitle>

              <DialogDescription className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-200">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {itemName && (
            <div className="rounded-sm border border-destructive/60 bg-destructive/[0.1] p-4">
              <div className="flex items-start gap-3">
                <Trash2
                  size={14}
                  className="mt-0.5 shrink-0 text-destructive"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-wider text-destructive uppercase">
                    You are about to delete
                  </p>

                  <p className="mt-1.5 truncate text-sm font-semibold dark:text-white">
                    &quot;{itemName}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-sm border border-ns-border-soft bg-ns-bg px-3.5 py-3">
            <p className="text-[11px] leading-relaxed text-gray-800 dark:text-ns-muted">
              <span className="font-semibold">
                This action cannot be undone.
              </span>{' '}
              The folder and its associated data may no longer be available
              after deletion.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t border-ns-border-soft/50 bg-ns-bg/20">
          <div className="flex w-full items-center justify-end gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={isPending}
                className="px-6"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant={'destructive'}
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 size={13} className="mr-1.5 animate-spin" />
              ) : (
                <Trash2 size={13} className="mr-1.5" />
              )}

              {isPending ? 'Deleting...' : 'Delete permanently'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
