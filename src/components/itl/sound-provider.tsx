'use client'

import { useEffect } from 'react'
import { playClickSound } from '@/lib/sounds'

export function SoundProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let enabled = false

    // Enable on first interaction (browser autoplay policy)
    const enable = () => {
      enabled = true
      document.removeEventListener('click', enable)
      document.removeEventListener('touchstart', enable)
      document.removeEventListener('keydown', enable)
    }
    document.addEventListener('click', enable)
    document.addEventListener('touchstart', enable)
    document.addEventListener('keydown', enable)

    // Play click sound on button/link clicks
    const handler = (e: MouseEvent) => {
      if (!enabled) return
      const target = e.target as HTMLElement
      if (target.closest('button, a, [role="button"]')) {
        playClickSound()
      }
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
      document.removeEventListener('click', enable)
      document.removeEventListener('touchstart', enable)
      document.removeEventListener('keydown', enable)
    }
  }, [])

  return <>{children}</>
}
