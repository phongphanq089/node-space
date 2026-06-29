import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/core/avatar'
import { LogOut } from 'lucide-react'

const Logout = () => {
  return (
    <button className="relative flex items-center gap-4 py-1 text-ns-accent">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>

      <div className="flex flex-col items-start">
        David Phill
        <span className="text-xs text-ns-accent/80">Log out</span>
      </div>
      <LogOut size={16} className="absolute top-1/2 right-0 -translate-y-1/2" />
    </button>
  )
}

export default Logout
