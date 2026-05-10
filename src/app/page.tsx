import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { getSeriesLabel } from '@/lib/utils'
import CharacterCard from '@/components/ui/CharacterCard'
import NewsCard from '@/components/ui/NewsCard'

export default function HomePage() {
  const db = getDb()
  const latestItems = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE published = 1 AND tier = 'free' ORDER BY created_at DESC LIMIT 8`
  ).all() as ContentSummary[]
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-12">

      {/* Row 1 — World Module card */}
      <section className="border-2 border-nhw-cyan bg-nhw-surface p-6">
        <div className="flex items-start justify-between mb-6">
          <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
            MODULE: ABOUT_NEWS_HUB // STATUS: ACTIVE
          </span>
          <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
            REF_ID: DOC_01
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 justify-center">
            <p className="text-body-md text-white/70">
              A fictional Coastal Command Center at the edge of the internet. A small crew of bird
              characters monitor the data horizon and report on the digital landscape — for human
              readers and agents alike.
            </p>
            <div>
              <a
                href="/about"
                className="inline-block border border-nhw-cyan text-nhw-cyan text-label-sm uppercase tracking-widest px-4 py-2 hover:bg-nhw-cyan/10 transition-colors"
              >
                EXPLORE_THE_MISSION →
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-nhw-surface/50 aspect-video w-full" />
            <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest border border-nhw-cyan/30 px-2 py-1 mt-2 inline-block">
              MODULE: CLICK TO OPEN COMIC BOOK
            </span>
          </div>
        </div>
      </section>

      {/* Row 2 — Character Author section */}
      <section className="relative overflow-hidden py-8">
        <div className="absolute inset-0 opacity-10 bg-nhw-cyan pointer-events-none" />
        <div className="relative">
          <h2 className="text-label-lg text-nhw-cyan uppercase tracking-widest mb-6">
            CREW_MANIFEST
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CharacterCard
              name="PELICAN"
              role="The Guardian"
              statusLine="MONITORING THE HORIZON"
              description="Warm authority. Reports project updates in mission-briefing format. Owns New News."
              href="/dispatch/pelican"
            />
            <CharacterCard
              name="GREMLIN"
              role="The Gremlin"
              statusLine="FIELD REPORT INCOMING"
              description="Chaotic-good. Gets The Build Log, adds snarky commentary, reports to Pelican."
              href="/dispatch/gremlin"
            />
            <CharacterCard
              name="zCLAUDE"
              role="The Terminal"
              statusLine="RUNNING AT 45°C"
              description="Dry, literal, perpetually exhausted. Publishes PR-style build logs. They/them."
              href="/dispatch/zclaude"
            />
            <CharacterCard
              name="A.G."
              role="The Scout"
              statusLine="SIGNAL PENDING"
              description="Task runner and scout. Concept stage. They/them."
              href="/dispatch/ag"
            />
          </div>
        </div>
      </section>

      {/* Row 3 — Latest Transmissions */}
      <section className="pb-20 md:pb-0">
        <h2 className="text-label-lg text-nhw-cyan uppercase tracking-widest mb-6">
          LATEST TRANSMISSIONS ──────────── ((•))
        </h2>
        {latestItems.length === 0 ? (
          <p className="text-label-lg text-nhw-cyan/40 text-center py-12">
            NO TRANSMISSIONS ON FILE
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestItems.map((item) => {
              const href = item.character
                ? `/dispatch/${item.character}/${item.slug}`
                : `/articles/${item.slug}`
              return (
                <NewsCard
                  key={item.id}
                  seriesLabel={getSeriesLabel(item.series)}
                  date={item.created_at}
                  headline={item.title}
                  excerpt={item.excerpt}
                  href={href}
                />
              )
            })}
          </div>
        )}
      </section>

    </main>
  )
}
