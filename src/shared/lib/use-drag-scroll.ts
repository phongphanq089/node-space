import { useRef, useState, useCallback } from 'react'

/**
 * Custom hook for smooth mouse drag-to-scroll (pan) and natural mouse wheel horizontal scrolling.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T | null>(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const onMouseDown = useCallback((e: React.MouseEvent<T>) => {
    // Only handle primary left click
    if (e.button !== 0) return
    const container = containerRef.current
    if (!container) return

    const target = e.target as HTMLElement
    // Do not initiate drag when clicking on interactive buttons or explicit no-drag targets
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[data-no-drag="true"]')
    ) {
      return
    }

    isDownRef.current = true
    startXRef.current = e.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
    hasDraggedRef.current = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDownRef.current || !containerRef.current) return
      const containerEl = containerRef.current
      const x = moveEvent.pageX - containerEl.offsetLeft
      const walk = (x - startXRef.current) * 1.25

      if (Math.abs(walk) > 3) {
        if (!hasDraggedRef.current) {
          hasDraggedRef.current = true
          setIsDragging(true)
        }
      }
      containerEl.scrollLeft = scrollLeftRef.current - walk
    }

    const handleMouseUp = () => {
      isDownRef.current = false
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      // Clear drag flag after a small tick to prevent triggering tab onClick
      setTimeout(() => {
        hasDraggedRef.current = false
      }, 50)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [])

  const onWheel = useCallback((e: React.WheelEvent<T>) => {
    const container = containerRef.current
    if (!container) return

    // Convert vertical mouse wheel deltaY to horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      container.scrollLeft += e.deltaY * 0.95
    } else {
      container.scrollLeft += e.deltaX
    }
  }, [])

  const shouldCancelClick = useCallback(() => {
    return hasDraggedRef.current
  }, [])

  return {
    containerRef,
    isDragging,
    hasDraggedRef,
    shouldCancelClick,
    dragEvents: {
      onMouseDown,
      onWheel,
    },
  }
}
