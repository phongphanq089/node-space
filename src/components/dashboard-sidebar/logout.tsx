import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/core/avatar'
import { LogOut } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'

const Logout = () => {
  const { data: session } = useSession()
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

  const user = session?.user
  const name = user?.name || 'User'
  const avatarUrl = user?.image || undefined
  const fallbackText = name.substring(0, 2).toUpperCase()

  return (
    <button
      onClick={handleLogout}
      className="relative flex w-full cursor-pointer items-center gap-4 py-1 text-left text-ns-primary"
    >
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>

      <div className="flex min-w-0 flex-col items-start">
        <span className="w-full truncate font-medium">{name}</span>
        <span className="text-xs text-ns-primary/80">Log out</span>
      </div>
      <LogOut size={16} className="absolute top-1/2 right-0 -translate-y-1/2" />
    </button>
  )
}

export default Logout
