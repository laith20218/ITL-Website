import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from './db'

const SECRET = process.env.AUTH_SECRET || 'itl-luxury-secret-key-change-in-prod'
const COOKIE_NAME = 'itl_auth'
const MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

// ---- Password hashing using scrypt + salt ----
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = scryptSync(password, salt, 64)
  if (hashBuf.length !== testBuf.length) return false
  return timingSafeEqual(hashBuf, testBuf)
}

// ---- JWT (HMAC-SHA256) ----
function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlDecode(input: string): Buffer {
  const padded = input + '='.repeat((4 - (input.length % 4)) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function sign(data: string): string {
  return createHmac('sha256', SECRET).update(data).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export interface TokenPayload {
  userId: string
  email: string
  name: string
  role: string
  exp: number
}

export function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  }
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(fullPayload))
  const signature = sign(`${header}.${body}`)
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, body, signature] = parts
    const expectedSig = sign(`${header}.${body}`)
    if (signature !== expectedSig) return null
    const payload: TokenPayload = JSON.parse(base64urlDecode(body).toString())
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// ---- Cookies ----
export async function setAuthCookie(userId: string, email: string, name: string, role: string) {
  const token = createToken({ userId, email, name, role })
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function clearAuthCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getCurrentUser() {
  try {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value
    if (!token) return null
    const payload = verifyToken(token)
    if (!payload) return null
    // Verify user still exists
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, phone: true },
    })
    return user
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: Request): string | undefined {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  // Try cookie header
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match?.[1]
}

export { COOKIE_NAME, MAX_AGE }

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}
