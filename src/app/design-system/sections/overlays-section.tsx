import { useState } from 'react'
import {
  Bell,
  Info,
  LogOut,
  MoreHorizontal,
  PanelRight,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/core'
import { ShowcaseCard } from '../components/showcase-card'

export function OverlaysSection() {
  const [bookmarksEnabled, setBookmarksEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  return (
    <section id="overlays" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            04
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Overlays & Dialogs (`src/shared/ui/core/`)
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          Overlay layers including modal dialogs, slide-out sheets, contextual
          dropdown menus, tooltips, and popovers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Modal Dialog */}
        <ShowcaseCard
          title="Modal Dialog"
          description="Centered modal window with backdrop blur and action triggers"
          codeBadge="<Dialog />"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <Sparkles className="mr-1.5 size-4" />
                Open Sample Dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="border-ns-border bg-ns-panel sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-ns-text">
                  Create New Workspace
                </DialogTitle>
                <DialogDescription className="text-ns-muted">
                  Organize your ideas, notes, and tasks in a distraction-free
                  environment.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-xs text-ns-muted">
                Dialog content container with backdrop blur, custom styling, and
                keyboard ESC / click-outside close handlers.
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="default">Create Workspace</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ShowcaseCard>

        {/* Slide-out Sheet */}
        <ShowcaseCard
          title="Side Sheet Panel"
          description="Slide-out panel from the edge of the viewport"
          codeBadge="<Sheet side='right' />"
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <PanelRight className="mr-1.5 size-4" />
                Open Right Sheet
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-ns-border/30 bg-ns-panel text-ns-text sm:max-w-md"
            >
              <SheetHeader>
                <SheetTitle className="text-ns-text">
                  Workspace Settings
                </SheetTitle>
                <SheetDescription className="text-ns-muted">
                  Configure real-time sync, theme preferences, and shortcuts.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-4 p-6 text-sm text-ns-muted">
                <p>
                  Sheet panel is ideal for detailed sidebar properties, node
                  meta information, or mobile navigation menus.
                </p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Close Panel
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </ShowcaseCard>

        {/* Dropdown Menu */}
        <ShowcaseCard
          title="Dropdown Menu"
          description="Context menu with keyboard shortcuts, checkboxes, and separators"
          codeBadge="<DropdownMenu />"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-1.5 size-4" />
                Actions Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-ns-border bg-ns-panel text-ns-text"
              align="start"
            >
              <DropdownMenuLabel className="text-xs font-normal text-ns-muted">
                Account Actions
              </DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 size-4" />
                Profile Details
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 size-4" />
                Preferences
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-ns-border-soft" />
              <DropdownMenuLabel className="text-xs font-normal text-ns-muted">
                Quick Filters
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={bookmarksEnabled}
                onCheckedChange={setBookmarksEnabled}
                className="cursor-pointer"
              >
                Show Bookmarks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="cursor-pointer"
              >
                Mute Notifications
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator className="bg-ns-border-soft" />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ShowcaseCard>

        {/* Tooltip & Popover */}
        <ShowcaseCard
          title="Tooltips & Popovers"
          description="Hover-triggered tooltips and click-triggered popovers"
          codeBadge="<Tooltip /> / <Popover />"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="mr-1.5 size-4 text-ns-primary-lt" />
                    Hover for Tooltip
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border border-ns-border">
                  <p>Smart auto-save is active on this document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Bell className="mr-1.5 size-4" />
                  Click Popover
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 border-ns-border p-4"
                align="center"
              >
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Notifications</h4>
                  <p className="text-xs text-ns-muted">
                    No new activity. All your notes are in sync.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </ShowcaseCard>
      </div>
    </section>
  )
}
