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
import PowerOffSlide from '@/shared/ui/system/power-off-slide'

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
      <PowerOffSlide
        duration={0}
        label="Slide to logout"
        onPowerOff={() => setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-red-500/30 bg-ns-surface/95 shadow-2xl backdrop-blur-2xl sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg border border-destructive bg-destructive text-white">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-ns-text">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-700 dark:text-ns-muted">
              Are you sure you want to log out of NodeSpace? You will need to
              log back in to access your notes and workspaces.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
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
