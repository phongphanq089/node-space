import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import type { LexicalEditor } from 'lexical'
import {
  FileImage,
  Minus,
  Plus,
  Table as TableIcon,
  ChevronDown,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import useModal from '../../../hooks/use-modal'
import { sanitizeUrl } from '../../../utils/url'

export function InsertDropdown({
  editor,
  onUploadImage,
  disabled = false,
}: {
  editor: LexicalEditor
  onUploadImage?: (file: File) => Promise<string>
  disabled?: boolean
}) {
  const [modal, showModal] = useModal()

  const openInsertTableDialog = () => {
    showModal('Insert Table', (onClose) => {
      let rows = 3
      let columns = 3

      return (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Rows
              </label>
              <input
                type="number"
                min="1"
                max="50"
                defaultValue={3}
                onChange={(e) => {
                  rows = parseInt(e.target.value, 10) || 3
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="50"
                defaultValue={3}
                onChange={(e) => {
                  columns = parseInt(e.target.value, 10) || 3
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                  columns: String(columns),
                  rows: String(rows),
                  includeHeaders: true,
                })
                onClose()
              }}
            >
              Insert Table
            </Button>
          </div>
        </div>
      )
    })
  }

  const openInsertImageDialog = () => {
    showModal('Insert Image', (onClose) => {
      let imageUrl = ''
      let imageAlt = ''

      return (
        <div className="space-y-3 pt-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Image URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.png"
              onChange={(e) => {
                imageUrl = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Alt Text
            </label>
            <input
              type="text"
              placeholder="Describe image..."
              onChange={(e) => {
                imageAlt = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {onUploadImage && (
            <div className="pt-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Or upload from computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    try {
                      const uploadedUrl = await onUploadImage(file)
                      if (uploadedUrl) {
                        imageUrl = uploadedUrl
                      }
                    } catch (err) {
                      console.error('Error uploading image:', err)
                    }
                  }
                }}
                className="text-xs file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const sanitized = sanitizeUrl(imageUrl)
                if (sanitized && sanitized !== 'about:blank') {
                  console.log('Inserting image:', {
                    src: sanitized,
                    altText: imageAlt,
                  })
                }
                onClose()
              }}
            >
              Insert Image
            </Button>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-8 gap-1.5 px-2 text-xs font-normal hover:bg-muted"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span>Insert</span>
            <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={openInsertTableDialog}>
            <TableIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Table</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
          >
            <Minus className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Horizontal Rule</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openInsertImageDialog}>
            <FileImage className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Image</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {modal}
    </>
  )
}
