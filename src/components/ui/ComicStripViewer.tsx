'use client'

import { useState } from 'react'

export type ComicStripViewerProps = {
  panels: string[]
}

export default function ComicStripViewer({ panels }: ComicStripViewerProps) {
  const [currentPanel, setCurrentPanel] = useState(0)

  if (!panels || panels.length === 0) {
    return null
  }

  const handleNext = () => {
    setCurrentPanel((prev) => (prev + 1) % panels.length)
  }

  const handlePrev = () => {
    setCurrentPanel((prev) => (prev - 1 + panels.length) % panels.length)
  }

  return (
    <div className="my-8 flex flex-col items-center border border-nhw-cyan/20 bg-nhw-surface p-4 rounded-lg">
      <div className="relative w-full max-w-2xl aspect-square overflow-hidden mb-4 bg-black">
        <img
          src={panels[currentPanel]}
          alt={`Comic panel ${currentPanel + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-nhw-bg border border-nhw-cyan text-nhw-cyan hover:bg-nhw-cyan hover:text-nhw-bg transition-colors"
        >
          Previous
        </button>
        <span className="flex items-center text-nhw-cyan">
          {currentPanel + 1} / {panels.length}
        </span>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-nhw-bg border border-nhw-cyan text-nhw-cyan hover:bg-nhw-cyan hover:text-nhw-bg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
