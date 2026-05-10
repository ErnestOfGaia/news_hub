'use client'

import { useState } from 'react'
import ComicStripViewer from './ComicStripViewer'

// TODO: add panel paths to NEWSY_PANELS when assets are in public/comics/newsy/
const NEWSY_PANELS: string[] = []

export default function WorldModuleComic() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(true)}
        className="bg-nhw-surface/50 aspect-video w-full hover:bg-nhw-surface/70 transition-colors cursor-pointer"
        aria-label="Open comic viewer"
      />
      <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest border border-nhw-cyan/30 px-2 py-1 mt-2 inline-block hover:border-nhw-cyan/60 transition-colors">
        MODULE: CLICK TO OPEN COMIC BOOK
      </span>

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
