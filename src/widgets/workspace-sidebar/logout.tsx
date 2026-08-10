import { LogOut } from 'lucide-react'
import { signOut } from '@/shared/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui'

export function Logout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/login' })
          },
        },
      })
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center justify-between gap-3"
    >
      Logout
      <LogOut size={16} />
    </Button>
  )
}
