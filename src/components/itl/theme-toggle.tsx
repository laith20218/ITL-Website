'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'

function subscribe() {
  return () => {}
}

function getSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="تبديل المظهر" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="تبديل المظهر"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-[#D4AF37]" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
