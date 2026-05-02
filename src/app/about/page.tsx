import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>About Ernest of Gaia</h1>

        <p>
          Ernest is a tradesperson on the Oregon coast who also teaches people how to use AI tools — Claude, Google AI, and ChatGPT — in their actual workflows. This publication is where he shares build logs from his software projects and observations on working with AI. Written for people who want to see how things get built, not just hear that they were.
        </p>

        <h2>The three series</h2>
        <ul>
          <li>
            <strong>The Build Log</strong> — project updates from active software builds, including what went wrong and what&apos;s next
          </li>
          <li>
            <strong>New News</strong> — observations on AI tools and how they&apos;re changing daily work
          </li>
          <li>
            <strong>The Jules Experience</strong> — Ernest&apos;s documentation of using Jules (Google&apos;s AI coding agent) to build this site
          </li>
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>Email: <a href="mailto:eog@ernestofgaia.xyz">eog@ernestofgaia.xyz</a></li>
          <li>Text: <a href="tel:5036640546">503-664-0546</a></li>
          <li>Main site: <a href="https://ernestofgaia.xyz" target="_blank" rel="noopener noreferrer">https://ernestofgaia.xyz</a></li>
        </ul>
      </div>
    </main>
  )
}
