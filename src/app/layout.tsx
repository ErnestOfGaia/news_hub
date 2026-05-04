import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', style: ['normal', 'italic'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://news.ernestofgaia.xyz'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ernest of Gaia — Build Logs & Trade Notes',
    template: '%s | Ernest of Gaia',
  },
  description: 'Build logs, trade insights, and process notes from an Oregon coast tradesperson who teaches AI tools.',
  openGraph: {
    siteName: 'Ernest of Gaia News Hub',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} font-sans leading-relaxed`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}