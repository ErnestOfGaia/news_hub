import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

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
