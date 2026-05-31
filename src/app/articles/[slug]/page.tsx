// Ticket 7 — 2026-05-28: article page now renders:
//   - Byline: "Filed by Static to Beacon. Subject: Ernest." from new metadata columns.
//   - comic_panels inline at [PANEL n] markers in the body (both shapes supported).
//   - Existing public rendering unchanged for articles without new fields.

import { getDb } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Content } from '@/types'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const article = db
    .prepare("SELECT title, excerpt FROM content WHERE slug = ? AND status = 'published'")
    .get(slug) as { title: string; excerpt: string | null } | undefined

  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

interface PanelObject {
  image: string
  caption?: string
  alt?: string
}

function parsePanels(raw: string | null): PanelObject[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => {
      if (typeof item === 'string') return { image: item }
      if (typeof item === 'object' && item !== null && typeof (item as Record<string, unknown>).image === 'string') {
        return item as PanelObject
      }
      return null
    }).filter((p): p is PanelObject => p !== null)
  } catch {
    return []
  }
}

// Replaces [PANEL 1], [PANEL 2], etc. markers with inline img + caption HTML.
// Returns an array of body segment strings (between markers) and panel JSX elements.
function renderBodyWithPanels(body: string, panels: PanelObject[]): React.ReactNode[] {
  // Split on [PANEL n] markers (case-insensitive, flexible whitespace)
  const parts = body.split(/\[PANEL\s+(\d+)\]/gi)
  const result: React.ReactNode[] = []

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Text segment
      if (parts[i]) {
        result.push(<MarkdownRenderer key={`text-${i}`} content={parts[i]} />)
      }
    } else {
      // Panel number (1-indexed)
      const panelIndex = parseInt(parts[i]) - 1
      const panel = panels[panelIndex]
      if (panel) {
        result.push(
          <figure key={`panel-${i}`} className="my-8 mx-auto max-w-2xl">
            <img
              src={panel.image}
              alt={panel.alt ?? `Panel ${panelIndex + 1}`}
              className="w-full rounded-sm"
            />
            {panel.caption && (
              <figcaption className="mt-2 text-sm text-stone-500 text-center italic">
                {panel.caption}
              </figcaption>
            )}
          </figure>
        )
      } else {
        // Panel referenced but not present — render a placeholder so the marker isn't silently swallowed
        result.push(
          <p key={`panel-missing-${i}`} className="text-stone-400 text-sm italic my-4">
            [Panel {panelIndex + 1} not found]
          </p>
        )
      }
    }
  }

  return result
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const article = db
    .prepare("SELECT * FROM content WHERE slug = ? AND status = 'published'")
    .get(slug) as Content | undefined

  if (!article) {
    notFound()
  }

  const panels = parsePanels(article.comic_panels)
  const hasPanels = panels.length > 0
  const hasMarkers = /\[PANEL\s+\d+\]/i.test(article.body)

  // Build byline from new metadata fields
  const bylineParts: string[] = []
  if (article.character) {
    const narratorLabel = article.character.charAt(0).toUpperCase() + article.character.slice(1)
    bylineParts.push(`Filed by ${narratorLabel}`)
    if (article.audience_in_fiction) {
      const audienceLabel = article.audience_in_fiction.charAt(0).toUpperCase() + article.audience_in_fiction.slice(1)
      bylineParts[bylineParts.length - 1] += ` to ${audienceLabel}`
    }
  }
  if (article.subject) bylineParts.push(`Subject: ${article.subject}`)
  const byline = bylineParts.join('. ')

  return (
    <main className="max-w-prose mx-auto py-12 px-4 space-y-8">
      <Link
        href="/"
        className="text-sm text-stone-400 hover:text-stone-100 flex items-center gap-1 transition-colors"
      >
        ← Back to feed
      </Link>

      <article className="space-y-6">
        <header className="space-y-2">
          {article.series && (
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              {article.series.replace('-', ' ')}
            </span>
          )}
          <h1 className="text-4xl font-serif font-bold text-stone-100 leading-tight">
            {article.title}
          </h1>
          <div className="text-sm text-stone-500">{formatDate(article.created_at)}</div>
          {/* Byline from Static's Report metadata */}
          {byline && (
            <p className="text-sm text-stone-400 italic">{byline}.</p>
          )}
        </header>

        {/* Body: with or without inline panels */}
        {hasPanels && hasMarkers
          ? <div className="space-y-0">{renderBodyWithPanels(article.body, panels)}</div>
          : <MarkdownRenderer content={article.body} />
        }
      </article>

      <hr className="border-stone-700" />

      <footer className="py-8 space-y-4">
        <h3 className="font-serif text-xl font-bold text-stone-100">Questions or thoughts?</h3>
        <p className="text-stone-300">
          Connect with Ernest on LinkedIn to discuss this article.
        </p>
        <a
          href="https://www.linkedin.com/in/ernestofgaia/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-stone-100 text-stone-900 px-6 py-3 rounded-none font-medium hover:bg-white transition-colors"
        >
          Discuss on LinkedIn
        </a>
      </footer>
    </main>
  )
}
