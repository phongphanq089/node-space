import type { EditorThemeClasses } from 'lexical'
import baseTheme from './editor-theme'

const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'relative mb-1 leading-normal text-foreground text-sm',
}

export default theme
