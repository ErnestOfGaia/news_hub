import { NextResponse } from 'next/server'
import { verifyPassword, sessionCookieOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const formData = await request.formData()
  const password = formData.get('password')

  if (typeof password !== 'string' || !verifyPassword(password)) {
    return NextResponse.redirect(new URL('/login?error=1', request.url), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), {
    status: 303,
  })

  response.cookies.set(sessionCookieOptions())

  return response
}
