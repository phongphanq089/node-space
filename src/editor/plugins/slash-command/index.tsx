/* eslint-disable @typescript-eslint/consistent-type-imports */
import { $createCodeNode } from '@lexical/code'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical'
import type { LexicalEditor } from 'lexical'
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Quote,
  Table as TableIcon,
} from 'lucide-react'
import * as React from 'react'
import type { JSX } from 'react'
import { createPortal } from 'react-dom'

export class SlashCommandOption extends MenuOption {
  title: string
  description: string
  keywords: string[]
  onSelect: (editor: LexicalEditor) => void

  constructor(
    title: string,
    options: {
      description: string
      icon?: JSX.Element
      keywords?: string[]
      onSelect: (editor: LexicalEditor) => void
    }
  ) {
    super(title)
    this.title = title
    this.description = options.description
    this.icon = options.icon
    this.keywords = options.keywords || []
    this.onSelect = options.onSelect
  }
}

export function SlashCommandPlugin({
  anchorElem = typeof document !== 'undefined' ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}) {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = React.useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const getBaseOptions = React.useCallback(
    (editorInstance: LexicalEditor): SlashCommandOption[] => [
      new SlashCommandOption('Text', {
        description: 'Just start typing with plain text',
        icon: <Pilcrow className="size-4" />,
        keywords: ['normal', 'paragraph', 'p', 'text'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode())
            }
          })
        },
      }),
      new SlashCommandOption('Heading 1', {
        description: 'Large section heading',
        icon: <Heading1 className="size-4" />,
        keywords: ['h1', 'title', 'big', 'heading'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h1'))
            }
          })
        },
      }),
      new SlashCommandOption('Heading 2', {
        description: 'Medium section heading',
        icon: <Heading2 className="size-4" />,
        keywords: ['h2', 'subtitle', 'heading'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h2'))
            }
          })
        },
      }),
      new SlashCommandOption('Heading 3', {
        description: 'Small section heading',
        icon: <Heading3 className="size-4" />,
        keywords: ['h3', 'sub', 'heading'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h3'))
            }
          })
        },
      }),
      new SlashCommandOption('Bullet List', {
        description: 'Create a simple bulleted list',
        icon: <List className="size-4" />,
        keywords: ['bullet', 'list', 'unordered', 'ul'],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_UNORDERED_LIST_COMMAND,
            undefined
          )
        },
      }),
      new SlashCommandOption('Numbered List', {
        description: 'Create a list with numbering',
        icon: <ListOrdered className="size-4" />,
        keywords: ['number', 'ordered', 'ol', 'list'],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        },
      }),
      new SlashCommandOption('Checklist', {
        description: 'Track tasks with a to-do list',
        icon: <ListTodo className="size-4" />,
        keywords: ['check', 'todo', 'task', 'checklist'],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        },
      }),
      new SlashCommandOption('Quote', {
        description: 'Capture a quotation or callout',
        icon: <Quote className="size-4" />,
        keywords: ['quote', 'blockquote', 'callout'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode())
            }
          })
        },
      }),
      new SlashCommandOption('Code Block', {
        description: 'Capture a code snippet with highlighting',
        icon: <Code2 className="size-4" />,
        keywords: ['code', 'snippet', 'codeblock', 'pre'],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createCodeNode())
            }
          })
        },
      }),
      new SlashCommandOption('Table', {
        description: 'Insert a 3x3 editable data table',
        icon: <TableIcon className="size-4" />,
        keywords: ['table', 'grid', 'rows', 'columns'],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: '3',
            rows: '3',
            includeHeaders: true,
          })
        },
      }),
      new SlashCommandOption('Divider', {
        description: 'Visually divide sections with a line',
        icon: <Minus className="size-4" />,
        keywords: ['divider', 'hr', 'line', 'horizontal'],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined
          )
        },
      }),
    ],
    []
  )

  const options = React.useMemo(() => {
    const base = getBaseOptions(editor)
    if (!queryString) return base

    const regex = new RegExp(queryString, 'i')
    return base.filter(
      (opt) =>
        regex.test(opt.title) ||
        regex.test(opt.description) ||
        opt.keywords.some((k) => regex.test(k))
    )
  }, [editor, getBaseOptions, queryString])

  const onSelectOption = React.useCallback(
    (
      selectedOption: SlashCommandOption,
      nodeToRemove: import('lexical').TextNode | null,
      closeMenu: () => void,
      _matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove()
        }
        selectedOption.onSelect(editor)
        closeMenu()
      })
    },
    [editor]
  )

  if (!anchorElem) return null

  return (
    <LexicalTypeaheadMenuPlugin<SlashCommandOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null
        }

        return createPortal(
          <div
            className="fixed z-50 max-h-72 w-64 animate-in overflow-y-auto rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md fade-in-0 outline-none select-none zoom-in-95"
            style={{
              top: anchorElementRef.current.getBoundingClientRect().bottom + 6,
              left: anchorElementRef.current.getBoundingClientRect().left,
            }}
          >
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Basic Blocks
            </div>

            <div className="space-y-0.5">
              {options.map((option, index) => {
                const isSelected = selectedIndex === index

                return (
                  <button
                    key={option.key}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors outline-none ${
                      isSelected
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${
                        isSelected
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border/60 bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {option.icon}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs leading-tight font-semibold">
                        {option.title}
                      </span>
                      <span className="truncate text-[11px] leading-normal text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>,
          anchorElem
        )
      }}
    />
  )
}

export default SlashCommandPlugin
