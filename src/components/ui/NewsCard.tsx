import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type NewsCardProps = {
  seriesLabel: string | null
  date: string
  headline: string
  excerpt: string | null
  href: string
  openInNewTab?: boolean
}

export default function NewsCard({ seriesLabel, date, headline, excerpt, href, openInNewTab }: NewsCardProps) {
  return (
    <article className="bg-nhw-surface border border-nhw-cyan/20 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        {seriesLabel ? (
          <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
            {seriesLabel}
          </span>
        ) : (
          <span />
        )}
        <time className="text-label-sm text-nhw-cyan/60 shrink-0">{formatDate(date)}</time>
      </div>

      <h3 className="text-label-lg text-nhw-cyan uppercase tracking-widest">{headline}</h3>

      {excerpt && <p className="text-body-md text-white/70">{excerpt}</p>}

      <Link
        href={href}
        className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity mt-auto"
        {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        READ_SIGNAL &gt;
      </Link>
    </article>
  )
}
