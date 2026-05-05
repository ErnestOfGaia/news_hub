import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // SQLite requires server-only — mark it external to avoid webpack bundling issues
  serverExternalPackages: ['better-sqlite3'],
}

export default nextConfig
