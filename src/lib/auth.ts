import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? ''
  return hashPassword(password + 'news-hub-session-salt')
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  return session?.value === getSessionToken()
}

export async function requireAdmin(): Promise<void> {
  const isAdmin = await checkAdminSession()
  if (!isAdmin) {
    redirect('/admin/login')
  }
}

export function createSessionCookie(): { name: string; value: string; maxAge: number; httpOnly: boolean; sameSite: 'strict' } {
  return {
    name: COOKIE_NAME,
    value: getSessionToken(),
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'strict',
  }
}

export function verifyPassword(input: string): boolean {
  const correct = process.env.ADMIN_PASSWORD ?? ''
  return input === correct
}
