'use client'
import { createContext, useContext, ReactNode, useCallback } from 'react'

type SoundType = 'click' | 'modalOpen' | 'success' | 'notification' | 'pageTransition'

interface SoundContextType {
  play: (type: SoundType) => void
}

const SoundContext = createContext<SoundContextType | null>(null)

// Web Audio API based sound generator (no external files needed)
let audioCtx: AudioContext | null = null

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch { return null }
  }
  return audioCtx
}

function playTone(freq: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(3000, ctx.currentTime)

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

const sounds: Record<SoundType, () => void> = {
  click: () => playTone(1200, 0.04, 0.03, 'sine'),
  modalOpen: () => {
    playTone(523, 0.08, 0.04, 'sine')
    setTimeout(() => playTone(784, 0.1, 0.03, 'sine'), 30)
  },
  success: () => {
    playTone(523, 0.08, 0.04, 'sine')
    setTimeout(() => playTone(659, 0.08, 0.04, 'sine'), 60)
    setTimeout(() => playTone(784, 0.12, 0.04, 'sine'), 120)
  },
  notification: () => {
    playTone(880, 0.06, 0.03, 'triangle')
    setTimeout(() => playTone(1100, 0.08, 0.03, 'triangle'), 40)
  },
  pageTransition: () => playTone(600, 0.06, 0.02, 'sine'),
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const play = useCallback((type: SoundType) => {
    sounds[type]?.()
  }, [])

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSounds() {
  const ctx = useContext(SoundContext)
  if (!ctx) return { play: () => {} }
  return ctx
}
