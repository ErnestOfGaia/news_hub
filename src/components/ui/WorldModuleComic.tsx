'use client'

import { useState } from 'react'
import ComicStripViewer from './ComicStripViewer'

// TODO: add panel paths to NEWSY_PANELS when assets are in public/comics/newsy/
const NEWSY_PANELS: string[] = []

export default function WorldModuleComic() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col h-full justify-end items-end">
      <button
        onClick={() => setOpen(true)}
        className="text-label-sm text-nhw-cyan/80 uppercase tracking-widest border border-nhw-cyan/40 bg-nhw-surface/60 backdrop-blur-sm px-4 py-2 hover:border-nhw-cyan hover:bg-nhw-surface/80 hover:text-nhw-cyan transition-all cursor-pointer"
        aria-label="Open comic viewer"
      >
        MODULE: CLICK TO OPEN COMIC BOOK
      </button>

      {open && (
        <ComicStripViewer
          panels={NEWSY_PANELS}
          tier="free"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
