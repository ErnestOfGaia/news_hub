import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
      
      {/* Banner */}
      <section className="w-full h-64 sm:h-80 lg:h-[450px] relative overflow-hidden border border-nhw-cyan/30">
        <img
          src="/about-header.png"
          alt="The Cast of News Hub World"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nhw-bg via-transparent to-transparent pointer-events-none" />
      </section>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-nhw-cyan uppercase tracking-widest drop-shadow-md mb-8">About Ernest of Gaia</h1>

        <p className="text-white/80">
          Ernest is a tradesperson on the Oregon coast who also teaches people how to use AI tools — Claude, Google AI, and ChatGPT — in their actual workflows. This publication is where he shares build logs from his software projects and observations on working with AI. Written for people who want to see how things get built, not just hear that they were.
        </p>

        <h2 className="text-nhw-cyan uppercase tracking-widest drop-shadow-md mt-10 mb-6">The three series</h2>
        <ul className="text-white/80 space-y-3">
          <li>
            <strong className="text-nhw-amber">The Build Log</strong> — project updates from active software builds, including what went wrong and what&apos;s next
          </li>
          <li>
            <strong className="text-nhw-amber">New News</strong> — observations on AI tools and how they&apos;re changing daily work
          </li>
          <li>
            <strong className="text-nhw-amber">The Jules Experience</strong> — Ernest&apos;s documentation of using Jules (Google&apos;s AI coding agent) to build this site
          </li>
        </ul>

        <h2 className="text-nhw-cyan uppercase tracking-widest drop-shadow-md mt-10 mb-6">Contact</h2>
        <ul className="text-white/80 space-y-2">
          <li>Email: <a href="mailto:eog@ernestofgaia.xyz" className="text-nhw-cyan hover:opacity-70 transition-opacity">eog@ernestofgaia.xyz</a></li>
          <li>Text: <a href="tel:5036640546" className="text-nhw-cyan hover:opacity-70 transition-opacity">503-664-0546</a></li>
          <li>Main site: <a href="https://ernestofgaia.xyz" target="_blank" rel="noopener noreferrer" className="text-nhw-cyan hover:opacity-70 transition-opacity">https://ernestofgaia.xyz</a></li>
        </ul>
      </div>
    </main>
  )
}
