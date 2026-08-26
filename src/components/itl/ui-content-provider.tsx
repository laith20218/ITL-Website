'use client'

/** Style: مسار الإنجاز الذهبي — سياق واحد يربط النصوص العامة بلوحة الإدارة مع بدائل مقروءة دائمًا. */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { UI_DEFAULT_CARDS, UI_DEFAULT_SECTIONS, type UiContent, type UiSectionKey, asUiContent } from '@/lib/ui-content'

export type PublicUiCard = { id: string; sectionKey: string; cardType: string; content: Record<string, unknown>; sortOrder: number; isVisible: boolean }

type UiContentContextValue = {
  sections: Record<UiSectionKey, UiContent>
  cards: PublicUiCard[]
  getSection: (key: UiSectionKey) => UiContent
  getCards: (key: UiSectionKey) => PublicUiCard[]
  isSectionVisible: (key: UiSectionKey) => boolean
}

const UiContentContext = createContext<UiContentContextValue | null>(null)

export function UiContentProvider({ children }: { children: React.ReactNode }) {
  const [remoteSections, setRemoteSections] = useState<Record<string, unknown>>({})
  const [hiddenSections, setHiddenSections] = useState<string[]>([])
  const [cards, setCards] = useState<PublicUiCard[]>(() => UI_DEFAULT_CARDS.map((card, index) => ({
    id: `default-${index}`, sectionKey: card.sectionKey, cardType: card.cardType, content: card.content, sortOrder: card.sortOrder, isVisible: true,
  })))

  useEffect(() => {
    fetch('/api/ui')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return
        setRemoteSections(Object.fromEntries((data.sections || []).map((section: { sectionKey: string; content: unknown }) => [section.sectionKey, section.content])))
        setHiddenSections((data.sections || []).filter((section: { isVisible?: boolean }) => section.isVisible === false).map((section: { sectionKey: string }) => section.sectionKey))
        if (Array.isArray(data.cards) && data.cards.length > 0) setCards(data.cards.filter((card: PublicUiCard) => card.isVisible))
      })
      .catch(() => {})
  }, [])

  const sections = useMemo(() => Object.fromEntries(
    Object.entries(UI_DEFAULT_SECTIONS).map(([key, fallback]) => [key, asUiContent(remoteSections[key], fallback)])
  ) as Record<UiSectionKey, UiContent>, [remoteSections])

  const value = useMemo<UiContentContextValue>(() => ({
    sections,
    cards,
    getSection: (key) => sections[key],
    getCards: (key) => cards.filter((card) => card.sectionKey === key).sort((a, b) => a.sortOrder - b.sortOrder),
    isSectionVisible: (key) => !hiddenSections.includes(key),
  }), [sections, cards, hiddenSections])

  return <UiContentContext.Provider value={value}>{children}</UiContentContext.Provider>
}

export function useUiContent() {
  const context = useContext(UiContentContext)
  if (!context) throw new Error('useUiContent must be used within UiContentProvider')
  return context
}
