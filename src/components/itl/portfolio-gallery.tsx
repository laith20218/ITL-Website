'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, Video, FileText, X, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  type: string
  fileUrl: string
  thumbnailUrl?: string | null
  clientName?: string | null
  projectDate?: string | null
  featured: boolean
}

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))]
  const types = [
    { key: 'all', label: 'الكل' },
    { key: 'image', label: 'صور' },
    { key: 'video', label: 'فيديو' },
    { key: 'pdf', label: 'ملفات' },
  ]

  const filtered = items.filter((i) => {
    if (category !== 'all' && i.category !== category) return false
    if (type !== 'all' && i.type !== type) return false
    return true
  })

  return (
    <section className="py-12 md:py-16" aria-label="معرض الأعمال">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-gold pb-1">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? 'default' : 'outline'}
                className={
                  category === cat
                    ? 'bg-[#D4AF37] text-black hover:bg-[#E8C964] whitespace-nowrap'
                    : 'border-[#D4AF37]/30 text-foreground hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37] whitespace-nowrap'
                }
                onClick={() => setCategory(cat)}
              >
                {cat === 'all' ? 'كل التصنيفات' : cat}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {types.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={type === t.key ? 'default' : 'outline'}
                className={
                  type === t.key
                    ? 'bg-[#D4AF37] text-black hover:bg-[#E8C964] whitespace-nowrap'
                    : 'border-[#D4AF37]/30 text-foreground hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37] whitespace-nowrap'
                }
                onClick={() => setType(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            لا توجد أعمال في هذا التصنيف حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="luxury-card overflow-hidden text-right stagger-item group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[#D4AF37]/10 to-[#A8842B]/5">
                  {item.thumbnailUrl || item.type === 'image' ? (
                    <img
                      src={item.thumbnailUrl || item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.type === 'video' ? (
                        <Video className="w-16 h-16 text-[#D4AF37]/40" />
                      ) : (
                        <FileText className="w-16 h-16 text-[#D4AF37]/40" />
                      )}
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 backdrop-blur text-[#D4AF37] border border-[#D4AF37]/30">
                      {item.category}
                    </Badge>
                  </div>
                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-[#D4AF37] text-black">مميز</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-foreground/50 line-clamp-2">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl luxury-card" dir="rtl">
          <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
          <DialogDescription className="sr-only">عرض تفاصيل العمل</DialogDescription>
          {selected?.type === 'image' && (
            <img
              src={selected.fileUrl}
              alt={selected.title}
              className="w-full max-h-[60vh] object-contain rounded-xl bg-black/30"
            />
          )}
          {selected?.type === 'video' && (
            <video src={selected.fileUrl} controls className="w-full max-h-[60vh] rounded-xl bg-black" />
          )}
          {selected?.type === 'pdf' && (
            <iframe src={selected.fileUrl} className="w-full h-[60vh] rounded-xl" title={selected.title} />
          )}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                {selected?.category}
              </Badge>
              {selected?.clientName && (
                <span className="text-xs text-muted-foreground">العميل: {selected.clientName}</span>
              )}
              {selected?.projectDate && (
                <span className="text-xs text-muted-foreground">{selected.projectDate}</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{selected?.title}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{selected?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
