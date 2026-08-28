import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import { HorizontalRuleExtension } from '@lexical/extension'
import * as React from 'react'

import { EditorFooter } from './components/editor-footer'
import { FloatingActionDock } from './components/floating-action-dock'
import { InspectorDialog } from './components/inspector-dialog'
import { ToolbarContext } from './core/context/toolbar-context'
import { editorTheme } from './core/themes/editor-theme'
import { DEFAULT_NODES } from './nodes'
import { BasicToolbarPlugin } from './plugins/basic-toolbar'
import { FloatingToolbarPlugin } from './plugins/floating-toolbar'
import { MobileToolbarPlugin } from './plugins/mobile-toolbar'
import { OnChangeHandlerPlugin } from './plugins/on-change'
import { DragDropPlugin, SidebarInsertPanel } from './plugins/sidebar-insert'
import { SlashCommandPlugin } from './plugins/slash-command'
import { ToolbarPlugin } from './plugins/toolbar'
import type { EditorChangeData, EditorProps } from './types'
import { cn } from './utils/cn'
import { validateUrl } from './utils/url'

import './styles/editor.css'

export function Editor({
  variant = 'default',
  value,
  onChange,
  placeholder,
  readOnly = false,
  autoFocus = false,
  features = {},
  onUploadImage,
  documentId = '15714558',
  onSave,
  onShare,
  className,
  contentClassName,
  minHeight,
  namespace = 'UniversalLexicalEditor',
}: EditorProps) {
  const isBasic = variant === 'basic'
  const isFrameless = variant === 'frameless'
  const isMobile = variant === 'mobile'

  const {
    toolbar = !isFrameless && !isMobile && !isBasic,
    floatingToolbar = isFrameless || variant === 'default',
    slashCommand = isFrameless || variant === 'default',
    statusBar = !isBasic && !isFrameless,
    floatingDock = false,
    sidebarInsert = true,
    markdown = true,
    tables = !isBasic,
    history = true,
    autoFocus: enableAutoFocus = autoFocus,
  } = features

  const defaultPlaceholder = isBasic
    ? 'Write a comment or quick note...'
    : isFrameless
      ? 'Press "/" for commands or start writing...'
      : isMobile
        ? 'Tap to start writing...'
        : 'Start writing content or drag & drop blocks from the sidebar...'

  const finalPlaceholder = placeholder ?? defaultPlaceholder

  const defaultMinHeight = isBasic ? 120 : isFrameless ? 200 : 250
  const finalMinHeight = minHeight ?? defaultMinHeight
  const minHeightStyle =
    typeof finalMinHeight === 'number' ? `${finalMinHeight}px` : finalMinHeight

  // Internal state tracking
  const [internalReadOnly, setInternalReadOnly] = React.useState(readOnly)
  const [inspectorOpen, setInspectorOpen] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [latestData, setLatestData] = React.useState<EditorChangeData | null>(
    null
  )

  // Sync external readOnly prop changes
  React.useEffect(() => {
    setInternalReadOnly(readOnly)
  }, [readOnly])

  // Validate initial editor state from value prop (supports serialized JSON)
  const initialEditorState = React.useMemo(() => {
    if (!value) return undefined
    try {
      JSON.parse(value)
      return value
    } catch {
      return undefined
    }
  }, [value])

  const initialConfig = React.useMemo(
    () => ({
      namespace,
      theme: editorTheme,
      nodes: DEFAULT_NODES,
      editable: !internalReadOnly,
      editorState: initialEditorState,
      onError: (error: Error) => {
        console.error('[UniversalEditor Error]:', error)
      },
      extensions: [HorizontalRuleExtension],
    }),
    [namespace, internalReadOnly, initialEditorState]
  )

  const handleInternalChange = React.useCallback(
    (data: EditorChangeData) => {
      setLatestData(data)
      onChange?.(data)
    },
    [onChange]
  )

  const handleExportMarkdown = React.useCallback(() => {
    if (!latestData) return
    const blob = new Blob([latestData.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${documentId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [latestData, documentId])

  return (
    <div
      className={cn(
        'relative flex w-full flex-col transition-colors',
        isFrameless && 'border-none bg-transparent p-0 shadow-none',
        isBasic &&
          'overflow-hidden rounded-lg border border-border bg-card shadow-2xs',
        isMobile &&
          'overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        variant === 'default' &&
          'overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs',
        internalReadOnly && 'border-border/60',
        className
      )}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarContext>
          {/* 1. Top Toolbar (Full, Basic, or None for Frameless/Mobile) */}
          {!internalReadOnly && toolbar && (
            <ToolbarPlugin onUploadImage={onUploadImage} />
          )}

          {!internalReadOnly && isBasic && <BasicToolbarPlugin />}

          {/* 2. Main Editor Row (Content Area + Slide-out Sidebar Panel) */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Content Area */}
            <div
              className={cn(
                'relative flex-1 transition-all',
                isFrameless ? 'p-1' : isBasic ? 'p-3' : 'p-4'
              )}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={cn(
                      'universal-editor-input outline-none focus:outline-none',
                      isFrameless && 'p-0',
                      contentClassName
                    )}
                    style={{ minHeight: minHeightStyle }}
                  />
                }
                placeholder={
                  <div
                    className={cn(
                      'universal-editor-placeholder select-none',
                      isFrameless && 'top-0 left-0'
                    )}
                  >
                    {finalPlaceholder}
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              {/* 3. Right Vertical Floating Action Dock (Optional) */}
              {floatingDock && (
                <FloatingActionDock
                  onOpenSidebar={
                    sidebarInsert ? () => setSidebarOpen((p) => !p) : undefined
                  }
                  onSave={() => onSave?.(latestData)}
                  onShare={() => onShare?.(latestData)}
                  onExport={() => setInspectorOpen(true)}
                  onClear={() => {}}
                />
              )}

              {/* 4. Core Plugins */}
              {history && <HistoryPlugin />}
              {enableAutoFocus && <AutoFocusPlugin />}
              <ListPlugin />
              <CheckListPlugin />
              <LinkPlugin validateUrl={validateUrl} />
              {tables && <TablePlugin />}

              {markdown && (
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              )}
              {!internalReadOnly && floatingToolbar && (
                <FloatingToolbarPlugin />
              )}
              {!internalReadOnly && slashCommand && <SlashCommandPlugin />}

              {/* 5. Drag & Drop Insertion Plugin */}
              <DragDropPlugin />

              {/* 6. Output Bridge */}
              <OnChangeHandlerPlugin onChange={handleInternalChange} />
            </div>

            {/* 7. Slide-out Insert Tools Sidebar Panel */}
            {!internalReadOnly && sidebarInsert && (
              <SidebarInsertPanel
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}
          </div>

          {/* 8. Mobile Bottom Keyboard Toolbar */}
          {!internalReadOnly && isMobile && (
            <MobileToolbarPlugin onUploadImage={onUploadImage} />
          )}

          {/* 9. Footer Status Bar */}
          {statusBar && (
            <EditorFooter
              documentId={documentId}
              data={latestData}
              readOnly={internalReadOnly}
              onToggleReadOnly={() => setInternalReadOnly((prev) => !prev)}
              onOpenInspector={() => setInspectorOpen(true)}
              onExportMarkdown={handleExportMarkdown}
            />
          )}

          {/* 10. Inspector Modal Dialog */}
          <InspectorDialog
            open={inspectorOpen}
            onOpenChange={setInspectorOpen}
            data={latestData}
          />
        </ToolbarContext>
      </LexicalComposer>
    </div>
  )
}

export default Editor
