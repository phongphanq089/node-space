import { Search, Plus } from 'lucide-react'
import { Button, Input } from '@/shared/ui'

interface NodeSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  onCreateFolder: () => void
}

export function NodeSearchBar({
  search,
  onSearchChange,
  onCreateFolder,
}: NodeSearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center">
        <Input
          placeholder="Search nodes..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          suffix={<Search size={13} className="flex-shrink-0 text-ns-ghost" />}
        />
      </div>
      <Button onClick={onCreateFolder}>
        <Plus size={13} />
        <span className="hidden sm:inline">New Folder</span>
      </Button>
    </div>
  )
}
