'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, Calendar, User, Eye, Tag, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl?: string | null
  tags?: string | null
  viewCount: number
  createdAt: string
}

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<Article | null>(null)

  useEffect(() => {
    fetch('/api/articles?limit=50')
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => set.add(a.category))
    return ['all', ...Array.from(set)]
  }, [articles])

  const filtered = useMemo(() => {
    if (category !== 'all') {
      return articles.filter((a) => a.category === category)
    }
    return articles
  }, [articles, category])

  async function openArticle(article: Article) {
    setSelected(article)
    // Increment view count
    fetch(`/api/articles?q=${encodeURIComponent(article.slug)}`, { method: 'GET' }).catch(() => {})
    try {
      await fetch('/api/articles/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: article.slug }),
      })
    } catch {
      // ignore
    }
  }

  return (
    <section id="articles" className="py-20 md:py-28 relative" aria-label="المدونة">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <span className="glow-dot" />
            <span className="text-xs font-medium text-[#D4AF37]">المدونة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-gradient-gold mb-4">
            مقالات ونصائح
          </h2>
          <p className="text-foreground/60">
            محتوى ملهم ومفيد يساعدك على تطوير مهاراتك ومعرفتك
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في المقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 bg-background/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-gold pb-1">
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
                {cat === 'all' ? 'الكل' : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            لا توجد مقالات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={i}
                onClick={() => openArticle(article)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Article modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] luxury-card" dir="rtl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                {selected?.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {selected ? new Date(selected.createdAt).toLocaleDateString('ar-EG') : ''}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {selected?.author}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {selected?.viewCount || 0}
              </span>
            </div>
            <DialogTitle className="text-2xl font-display text-gradient-gold">
              {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-foreground/70 text-base">
              {selected?.excerpt}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] pr-4 scrollbar-gold">
            <article className="prose prose-invert max-w-none text-foreground/80 leading-relaxed space-y-4">
              {selected?.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-bold text-[#D4AF37] font-display mt-4">{line.slice(2)}</h1>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold text-[#D4AF37] font-display mt-4">{line.slice(3)}</h2>
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-bold text-[#D4AF37]/80 mt-3">{line.slice(4)}</h3>
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="mr-4 text-foreground/70">{line.slice(2)}</li>
                }
                if (line.trim() === '') return <div key={i} className="h-2" />
                return <p key={i}>{line}</p>
              })}
            </article>
            {selected?.tags && (
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/10 flex flex-wrap gap-2">
                {(() => {
                  try {
                    return JSON.parse(selected.tags).map((t: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">
                        <Tag className="ml-1 h-3 w-3" />
                        {t}
                      </Badge>
                    ))
                  } catch {
                    return null
                  }
                })()}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ArticleCard({
  article,
  index,
  onClick,
}: {
  article: Article
  index: number
  onClick: () => void
}) {
  return (
    <article
      className="luxury-card overflow-hidden cursor-pointer stagger-item group"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className="aspect-video bg-gradient-to-br from-[#D4AF37]/10 to-[#A8842B]/5 relative overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">📝</div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/70 backdrop-blur text-[#D4AF37] border border-[#D4AF37]/30">
            {article.category}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-foreground/60 mb-3 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.createdAt).toLocaleDateString('ar-EG')}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.viewCount}
          </span>
        </div>
      </div>
    </article>
  )
}
