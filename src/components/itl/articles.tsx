'use client';

import * as React from 'react';
import { Search, Calendar, Eye, ArrowLeft, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SectionHeading } from './services';
import { useToast } from '@/hooks/use-toast';

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  tags?: string | null;
  createdAt: string;
  viewCount: number;
}

const CATEGORIES = ['الكل', 'البحث العلمي', 'الترجمة', 'التصميم', 'التدريب', 'الإنتاج المرئي', 'التسويق الرقمي'];

export function Articles() {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [filtered, setFiltered] = React.useState<ArticleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('الكل');
  const [selected, setSelected] = React.useState<ArticleItem | null>(null);
  const [content, setContent] = React.useState<string>('');
  const [loadingContent, setLoadingContent] = React.useState(false);
  const { toast } = useToast();

  const loadArticles = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (category !== 'الكل') params.set('category', category);
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setFiltered(data.articles || []);
    } catch {
      toast({ variant: 'destructive', title: 'تعذر تحميل المقالات' });
    } finally {
      setLoading(false);
    }
  }, [search, category, toast]);

  React.useEffect(() => {
    const t = setTimeout(loadArticles, 300);
    return () => clearTimeout(t);
  }, [loadArticles]);

  const openArticle = async (a: ArticleItem) => {
    setSelected(a);
    setContent('');
    setLoadingContent(true);
    try {
      // For now, fetch via same endpoint with search by slug
      const res = await fetch(`/api/articles?q=${encodeURIComponent(a.slug)}`);
      const data = await res.json();
      const found = data.articles?.find((x: ArticleItem) => x.slug === a.slug);
      if (found) setContent(found.excerpt || '');
      // Fallback: full content from individual slug — we use the same list, so show excerpt
      setContent(a.excerpt + '\n\n' + (a.tags ? `الوسوم: ${a.tags}` : ''));
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <section id="articles" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          eyebrow="المقالات"
          title="مدونة ITL المعرفية"
          subtitle="مقالات وأدلة متخصصة من خبرائنا في البحث العلمي والترجمة والتصميم والتسويق والإنتاج."
        />

        {/* Search + filter */}
        <div className="max-w-4xl mx-auto mt-12 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في المقالات... (عنوان، وسم، محتوى)"
              className="pr-12 h-13 bg-secondary/30 border-gold/20 focus:border-gold focus-visible:border-gold text-base"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                  category === c
                    ? 'bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground font-medium shadow-sm'
                    : 'border border-gold/20 text-foreground/70 hover:border-gold/50 hover:text-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Articles grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl bg-secondary/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 mt-8">
            <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد مقالات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {filtered.map((a) => (
              <article
                key={a.id}
                onClick={() => openArticle(a)}
                className="luxury-card luxury-card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Thumbnail-like banner */}
                <div className="h-32 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-display text-5xl font-bold text-gold/20">
                      {a.category.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur border-gold/40 text-gold">
                      {a.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2 hover:text-gold transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                    {a.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-gold/10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(a.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {a.viewCount}
                      </span>
                    </div>
                    <span className="text-gold flex items-center gap-1 font-medium">
                      اقرأ
                      <ArrowLeft className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article modal */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto luxury-card !bg-card !border-gold/30">
          {selected && (
            <>
              <DialogHeader>
                <div className="mb-2">
                  <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5">
                    {selected.category}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-2xl lg:text-3xl text-gradient-gold leading-tight">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(selected.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    {selected.viewCount} مشاهدة
                  </span>
                  <span className="text-xs">بقلم: {selected.author}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="prose prose-invert max-w-none pt-4">
                {loadingContent ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="text-foreground/90 leading-loose whitespace-pre-line text-base">
                    {content}
                  </div>
                )}

                {selected.tags && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gold/15">
                    {selected.tags.split(',').map((t) => (
                      <Badge key={t} variant="secondary" className="bg-secondary/50">
                        #{t.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gold/15 flex justify-end">
                <Button asChild className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground">
                  <a href="#contact">اطلب خدمة مشابهة</a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
