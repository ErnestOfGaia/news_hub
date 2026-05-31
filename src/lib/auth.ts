import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto, { timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7

function getToken(): string {
  return crypto.createHash('sha256')
    .update((process.env.ADMIN_PASSWORD ?? '') + 'news-hub-salt').digest('hex')
}

export async function checkAdminSession(): Promise<boolean> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === getToken()
}

export async function requireAdmin(): Promise<void> {
  if (!(await checkAdminSession())) redirect('/login')
}

export function verifyPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD ?? '')
}

export function sessionCookieOptions() {
  return { name: COOKIE_NAME, value: getToken(), httpOnly: true, sameSite: 'strict' as const, maxAge: MAX_AGE, path: '/' }
}

// Build an absolute redirect URL from the incoming request's Host header rather
// than request.url. In the standalone Next server (Docker: HOSTNAME=0.0.0.0,
// PORT=3000) request.url reflects the container's internal bind address, which
// would send the browser to an unreachable 0.0.0.0:3000. Behind a reverse proxy
// (nginx-proxy-manager in prod) the Host header carries the public hostname, and
// x-forwarded-proto carries the original scheme.
export function redirectTarget(request: Request, path: string): string {
  const host = request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}${path}`
}

export function requireHermesKey(req: NextRequest): boolean {
  const expected = process.env.HERMES_API_KEY
  if (!expected) return false

  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return false

  const presented = header.slice('Bearer '.length)
  try {
    const a = Buffer.from(presented)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
