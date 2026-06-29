'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function VisitTracker() {
  const pathname = usePathname()
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    let sid = sessionStorage.getItem('itl_sid')
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('itl_sid', sid)
    }
    return sid
  })

  useEffect(() => {
    if (!pathname) return
    // Skip api/admin/_next
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/_next')
    ) {
      return
    }
    // Fire and forget
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        sessionId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
    }).catch(() => {})
  }, [pathname, sessionId])

  return null
}
