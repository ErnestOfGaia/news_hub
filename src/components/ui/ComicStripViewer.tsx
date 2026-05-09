'use client'

import { useState, useEffect, useRef } from 'react'

export type ComicStripViewerProps = {
  panels: string[]
  initialPage?: number
  // tier is accepted for future Phase 2 use; only free panel view is rendered in Phase 1
  tier: 'free' | 'premium'
  onClose: () => void
}

export default function ComicStripViewer({
  panels,
  initialPage = 0,
  onClose,
}: ComicStripViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        setCurrentPage((p) => Math.min(p + 1, panels.length - 1))
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage((p) => Math.max(p - 1, 0))
      } else if (e.key === 'Tab') {
        const overlay = overlayRef.current
        if (!overlay) return
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, panels.length])

  const isFirst = currentPage === 0
  const isLast = currentPage === panels.length - 1

  if (!panels || panels.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nhw-bg"
        role="dialog"
        aria-modal="true"
      >
        <p className="text-nhw-cyan text-label-lg tracking-widest uppercase mb-4">
          NO_PANELS_CONFIGURED
        </p>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-nhw-cyan text-xl p-2 hover:opacity-70 transition-opacity"
          aria-label="Close viewer"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col bg-nhw-bg"
      role="dialog"
      aria-modal="true"
      aria-label="Comic Strip Viewer"
    >
      {/* Close */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 text-nhw-cyan text-xl p-2 hover:opacity-70 transition-opacity"
        aria-label="Close viewer"
      >
        ✕
      </button>

      {/* Panel */}
      <div className="flex flex-1 items-center justify-center px-16 py-8 overflow-hidden">
        <img
          src={panels[currentPage]}
          alt={`Comic page ${currentPage + 1} of ${panels.length}`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-8 pb-8 shrink-0">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={isFirst}
          className="text-nhw-cyan text-label-lg tracking-widest uppercase disabled:opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Previous page"
        >
          ← PREV PAGE
        </button>

        <span className="text-nhw-cyan text-label-lg tracking-widest uppercase">
          PAGE {currentPage + 1} OF {panels.length}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={isLast}
          className="text-nhw-cyan text-label-lg tracking-widest uppercase disabled:opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Next page"
        >
          NEXT PAGE →
        </button>
      </div>
    </div>
  )
}
