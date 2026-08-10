import { useState } from 'react'
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react'
import { signOut } from '@/shared/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

export function Logout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setOpen(false)
            setLoading(false)
            navigate({ to: '/login' })
          },
          onError: () => {
            setLoading(false)
          },
        },
      })
    } catch (error) {
      console.error('Failed to log out:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 border border-red-500/20 bg-red-500/5 text-xs font-semibold text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300"
      >
        <span>Logout</span>
        <LogOut size={15} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-red-500/30 bg-ns-surface/95 shadow-2xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-ns-text">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-xs text-ns-muted">
              Are you sure you want to log out of NodeSpace? You will need to
              log back in to access your notes and workspaces.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-ns-border-soft text-ns-muted hover:bg-ns-hover hover:text-ns-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="size-4" />
                  <span>Yes, Log Out</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
