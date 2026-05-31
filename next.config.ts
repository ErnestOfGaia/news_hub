import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // SQLite requires server-only — mark it external to avoid webpack bundling issues
  serverExternalPackages: ['better-sqlite3'],

  // Ticket 9 — 2026-05-28: 308 permanent redirects for renamed dispatch routes.
  // pelican → beacon, gremlin → static (character rename, Trewkat-approved through 2027).
  // Old inbound links (bookmarks, social shares) continue to work.
  async redirects() {
    return [
      {
        source: '/dispatch/pelican',
        destination: '/dispatch/beacon',
        permanent: true, // 308
      },
      {
        source: '/dispatch/pelican/:slug',
        destination: '/dispatch/beacon/:slug',
        permanent: true, // 308
      },
      {
        source: '/dispatch/gremlin',
        destination: '/dispatch/static',
        permanent: true, // 308
      },
      {
        source: '/dispatch/gremlin/:slug',
        destination: '/dispatch/static/:slug',
        permanent: true, // 308
      },
    ]
  },
}

export default nextConfig
