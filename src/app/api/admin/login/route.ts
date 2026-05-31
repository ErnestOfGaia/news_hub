import { NextResponse } from 'next/server'
import { verifyPassword, sessionCookieOptions, redirectTarget } from '@/lib/auth'

export async function POST(request: Request) {
  const formData = await request.formData()
  const password = formData.get('password')

  if (typeof password !== 'string' || !verifyPassword(password)) {
    return NextResponse.redirect(redirectTarget(request, '/login?error=1'), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(redirectTarget(request, '/admin'), {
    status: 303,
  })

  response.cookies.set(sessionCookieOptions())

  return response
}
