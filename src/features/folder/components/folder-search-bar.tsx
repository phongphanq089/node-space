import { Search, Plus } from 'lucide-react'
import { Button, Input } from '@/shared/ui'

interface FolderSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  onCreateFolder: () => void
}

export function FolderSearchBar({
  search,
  onSearchChange,
  onCreateFolder,
}: FolderSearchBarProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 pb-5">
      <div className="flex w-full flex-1 items-center">
        <Input
          placeholder="Search folders..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          suffix={<Search size={13} className="flex-shrink-0 text-ns-ghost" />}
        />
      </div>
      <Button onClick={onCreateFolder} className="flex px-6">
        <Plus size={13} />
        <span className="hidden sm:inline">New Folder</span>
      </Button>
    </div>
  )
}
