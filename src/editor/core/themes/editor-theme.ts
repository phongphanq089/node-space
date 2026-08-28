import type { EditorThemeClasses } from 'lexical'
import '../../styles/editor.css'

export const editorTheme: EditorThemeClasses = {
  autocomplete: 'text-muted-foreground/60 italic',
  blockCursor: 'editor-block-cursor',
  characterLimit: 'bg-destructive/20 text-destructive',
  code: 'editor-code-block bg-muted/80 block p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto border border-border text-foreground leading-relaxed',
  codeHighlight: {
    atrule: 'text-blue-600 dark:text-blue-400',
    attr: 'text-cyan-600 dark:text-cyan-400',
    boolean: 'text-purple-600 dark:text-purple-400 font-semibold',
    builtin: 'text-emerald-600 dark:text-emerald-400',
    cdata: 'text-muted-foreground italic',
    char: 'text-emerald-600 dark:text-emerald-400',
    class: 'text-indigo-600 dark:text-indigo-400 font-semibold',
    'class-name': 'text-indigo-600 dark:text-indigo-400 font-semibold',
    comment: 'text-muted-foreground italic',
    constant: 'text-amber-600 dark:text-amber-400',
    deleted: 'bg-red-500/20 text-red-700 dark:text-red-300',
    doctype: 'text-muted-foreground italic',
    entity: 'text-amber-600 dark:text-amber-400',
    function: 'text-indigo-600 dark:text-indigo-400 font-semibold',
    important: 'text-orange-600 dark:text-orange-400 font-bold',
    inserted: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    keyword: 'text-pink-600 dark:text-pink-400 font-semibold',
    namespace: 'text-orange-600 dark:text-orange-400',
    number: 'text-emerald-600 dark:text-emerald-400',
    operator: 'text-foreground',
    prolog: 'text-muted-foreground italic',
    property: 'text-purple-600 dark:text-purple-400',
    punctuation: 'text-muted-foreground',
    regex: 'text-orange-600 dark:text-orange-400',
    selector: 'text-emerald-600 dark:text-emerald-400',
    string: 'text-emerald-600 dark:text-emerald-400',
    symbol: 'text-amber-600 dark:text-amber-400',
    tag: 'text-pink-600 dark:text-pink-400',
    url: 'text-blue-600 dark:text-blue-400 underline',
    variable: 'text-orange-600 dark:text-orange-400',
  },
  embedBlock: {
    base: 'select-none my-4',
    focus: 'ring-2 ring-primary rounded-lg',
  },
  hashtag:
    'text-blue-500 bg-blue-500/10 px-1 py-0.5 rounded text-sm font-medium',
  heading: {
    h1: 'text-3xl font-bold tracking-tight mt-6 mb-3 text-foreground',
    h2: 'text-2xl font-semibold tracking-tight mt-5 mb-2 text-foreground',
    h3: 'text-xl font-semibold mt-4 mb-2 text-foreground',
    h4: 'text-lg font-medium mt-3 mb-1 text-foreground',
    h5: 'text-base font-medium mt-2 mb-1 text-foreground',
    h6: 'text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-2 mb-1',
  },
  hr: 'my-6 border-t border-border',
  hrSelected: 'my-6 border-t-2 border-primary ring-2 ring-primary/20',
  image: 'editor-image rounded-lg max-w-full my-4 cursor-pointer',
  indent: 'pl-8',
  layoutContainer: 'grid gap-3 my-4',
  layoutItem:
    'border border-dashed border-border p-3 rounded-md min-w-0 max-w-full',
  link: 'text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer',
  list: {
    checklist: 'space-y-1.5 my-2',
    listitem: 'leading-normal pl-1',
    listitemChecked: 'editor-checklist-item-checked',
    listitemUnchecked: 'editor-checklist-item',
    nested: {
      listitem: 'list-none pl-4',
    },
    ol: 'list-decimal list-outside ml-6 my-2 space-y-1.5 text-foreground',
    olDepth: [
      'list-decimal',
      'list-[upper-alpha]',
      'list-[lower-alpha]',
      'list-[upper-roman]',
      'list-[lower-roman]',
    ],
    ul: 'list-disc list-outside ml-6 my-2 space-y-1.5 text-foreground',
  },
  mark: 'bg-amber-200/70 dark:bg-amber-900/60 dark:text-amber-100 rounded px-1',
  markOverlap:
    'bg-amber-300 dark:bg-amber-800/80 dark:text-amber-50 rounded px-1',
  paragraph: 'relative mb-3 leading-relaxed text-foreground text-base',
  quote:
    'border-l-4 border-primary/60 pl-4 italic my-4 text-muted-foreground bg-muted/20 py-2 rounded-r-md',
  table:
    'border-collapse border border-border my-4 w-full text-sm rounded-lg overflow-hidden',
  tableAddColumns:
    'bg-muted hover:bg-muted/80 text-muted-foreground transition-colors',
  tableAddRows:
    'bg-muted hover:bg-muted/80 text-muted-foreground transition-colors',
  tableAlignment: {
    center: 'mx-auto',
    right: 'ml-auto',
  },
  tableCell:
    'border border-border p-2.5 align-top relative min-w-[75px] text-foreground',
  tableCellActionButton:
    'size-5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors',
  tableCellActionButtonContainer: 'absolute right-1 top-1 z-10',
  tableCellHeader:
    'border border-border p-2.5 font-semibold bg-muted/60 text-left text-foreground',
  tableCellResizer: 'editor-table-resizer',
  tableCellSelected: 'bg-primary/10',
  tableRowStriping: 'even:bg-muted/30',
  tableScrollableWrapper: 'overflow-x-auto my-4',
  tableSelected: 'ring-2 ring-primary',
  text: {
    bold: 'font-bold',
    capitalize: 'capitalize',
    code: 'bg-muted px-1.5 py-0.5 rounded font-mono text-sm text-primary font-medium border border-border/50',
    highlight:
      'bg-amber-200/70 dark:bg-amber-900/60 dark:text-amber-100 rounded px-1',
    italic: 'italic',
    lowercase: 'lowercase',
    strikethrough: 'line-through',
    subscript: 'align-sub text-xs',
    superscript: 'align-super text-xs',
    underline: 'underline underline-offset-3',
    underlineStrikethrough: 'underline underline-offset-3 line-through',
    uppercase: 'uppercase',
  },
}

export default editorTheme
