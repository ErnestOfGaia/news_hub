import { NextResponse } from 'next/server'
import { redirectTarget } from '@/lib/auth'

export async function POST(request: Request) {
  const response = NextResponse.redirect(redirectTarget(request, '/login'), {
    status: 303,
  })
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
