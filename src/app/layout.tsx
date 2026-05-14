import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://news.ernestofgaia.xyz'

const DEFAULT_DESCRIPTION =
  'News Hub World — a fictional Coastal Command Center at the edge of the internet, where a small crew of bird characters report on the digital landscape for human readers and agents alike.'

const DEFAULT_OG_IMAGE = '/home-banner.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'News Hub World',
    template: '%s | News Hub World',
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: 'News Hub World',
    title: 'News Hub World',
    description: DEFAULT_DESCRIPTION,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Coastal Command Center — News Hub World',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News Hub World',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans leading-relaxed`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}