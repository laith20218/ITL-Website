'use client'

import { useCallback, useEffect, useRef } from 'react'

let audioCtx: AudioContext | null = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(freq: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, ctx.currentTime)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not supported or blocked
  }
}

export function playClickSound() {
  playTone(800, 0.08, 0.04, 'sine')
}

export function playOpenSound() {
  playTone(523, 0.12, 0.05, 'sine')
  setTimeout(() => playTone(784, 0.12, 0.04, 'sine'), 40)
}

export function playSuccessSound() {
  playTone(523, 0.1, 0.05, 'sine')
  setTimeout(() => playTone(659, 0.1, 0.05, 'sine'), 80)
  setTimeout(() => playTone(784, 0.15, 0.05, 'sine'), 160)
}

export function useClickSound() {
  return useCallback(() => playClickSound(), [])
}
