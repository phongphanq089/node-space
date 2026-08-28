import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: {
  children: ReactNode
  closeOnClickOutside?: boolean
  onClose: () => void
  title: string
}) {
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          if (!closeOnClickOutside) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={() => onClose()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="pt-2">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
