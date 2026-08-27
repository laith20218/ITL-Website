'use client'

/** Style: مسار الإنجاز الذهبي — مكتبة مصنفة بهدوء، ونافذة معاينة عملية تحافظ على الزائر داخل التجربة. */
import { useMemo, useState } from 'react'
import { FileText, Image as ImageIcon, Video, File, Download, Smartphone, ExternalLink, Play, ImageOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface LibraryFile {
  id: string
  title: string
  description: string | null
  fileUrl: string
  category: string | null
  mimeType: string | null
  kind: 'FILE' | 'APP' | 'IMAGE' | 'VIDEO'
  coverUrl: string | null
  platform: string | null
  sortOrder: number
  isVisible: boolean
  downloadCount: number
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'دليل': 'دليل', 'قالب': 'قالب', 'بحث': 'بحث', 'صورة': 'صورة', 'فيديو': 'فيديو', 'عام': 'عام',
}

const KINDS = [
  { key: 'FILE', label: 'ملفات', empty: 'لا توجد ملفات متاحة بعد' },
  { key: 'APP', label: 'تطبيقات', empty: 'لا توجد تطبيقات متاحة بعد' },
  { key: 'IMAGE', label: 'صور', empty: 'لا توجد صور متاحة بعد' },
  { key: 'VIDEO', label: 'فيديوهات', empty: 'لا توجد فيديوهات متاحة بعد' },
] as const

function isPdf(file: LibraryFile) { return file.mimeType === 'application/pdf' || /\.pdf(?:$|\?)/i.test(file.fileUrl) }
function isImage(file: LibraryFile) { return file.kind === 'IMAGE' || file.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)(?:$|\?)/i.test(file.fileUrl) }
function videoIdFromUrl(value: string) {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    const candidate = host === 'youtu.be' ? url.pathname.slice(1).split('/')[0] : url.searchParams.get('v') || (/^\/(shorts|embed)\//.test(url.pathname) ? url.pathname.split('/')[2] : '')
    return /^[A-Za-z0-9_-]{11}$/.test(candidate || '') ? candidate : null
  } catch { return null }
}
function pdfPreviewUrl(value: string) {
  const driveId = value.match(/drive\.google\.com\/file\/d\/([^/?]+)/)?.[1]
  return driveId ? `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview` : value
}

export function LibraryGrid({ files }: { files: LibraryFile[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]['key']>('FILE')
  const [preview, setPreview] = useState<LibraryFile | null>(null)
  const visibleFiles = useMemo(() => files.filter((file) => file.isVisible !== false && (file.kind || 'FILE') === kind).sort((a, b) => a.sortOrder - b.sortOrder), [files, kind])
  const kindMeta = KINDS.find((item) => item.key === kind) || KINDS[0]
  const previewPdf = preview ? isPdf(preview) : false
  const previewVideoId = preview?.kind === 'VIDEO' ? videoIdFromUrl(preview.fileUrl) : null

  return (
    <div className="space-y-7">
      <Tabs value={kind} onValueChange={(value) => setKind(value as typeof kind)}>
        <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-4 bg-muted/50 p-1">
          {KINDS.map((item) => <TabsTrigger key={item.key} value={item.key} className="py-2 text-xs sm:text-sm">{item.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {visibleFiles.length === 0 ? <div className="py-20 text-center text-muted-foreground">{kindMeta.empty}</div> : <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleFiles.map((file, i) => {
          const pdf = isPdf(file)
          const image = isImage(file)
          const youtubeId = file.kind === 'VIDEO' ? videoIdFromUrl(file.fileUrl) : null
          const Icon = file.kind === 'APP' ? Smartphone : pdf ? FileText : image ? ImageIcon : file.kind === 'VIDEO' ? Video : File
          const cta = pdf ? 'عرض PDF' : file.kind === 'APP' ? 'فتح التطبيق' : file.kind === 'VIDEO' ? 'مشاهدة الفيديو' : file.kind === 'IMAGE' ? 'عرض الصورة' : 'تحميل'
          const ActionIcon = file.kind === 'FILE' ? Download : file.kind === 'VIDEO' ? Play : ExternalLink
          const canPreview = pdf || Boolean(youtubeId)

          return <motion.div key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="luxury-card rounded-xl p-5 transition-all hover:border-[#D4AF37]/40">
            {(file.coverUrl || (file.kind === 'IMAGE' && file.fileUrl)) && <div className="mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-[#D4AF37]/15 bg-black/20">{file.coverUrl || file.fileUrl ? <img src={file.coverUrl || file.fileUrl} alt={file.title} className="h-full w-full object-cover" loading="lazy" /> : <ImageOff className="m-auto h-full text-muted-foreground" />}</div>}
            <div className="mb-3 flex items-start gap-3"><div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10"><Icon className="h-6 w-6 text-[#D4AF37]" /></div><div className="min-w-0 flex-1"><h3 className="mb-1 truncate text-sm font-bold">{file.title}</h3><div className="flex flex-wrap gap-1.5">{file.category && <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] text-[#D4AF37]">{CATEGORY_LABELS[file.category] || file.category}</span>}{file.platform && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">{file.platform}</span>}</div></div></div>
            {file.description && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{file.description}</p>}
            {canPreview ? <Button type="button" onClick={() => setPreview(file)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37]/10 py-2 text-sm font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20"><ActionIcon className="h-4 w-4" />{cta}</Button> : <a href={file.fileUrl} download={file.kind === 'FILE'} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37]/10 py-2 text-sm font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20"><ActionIcon className="h-4 w-4" />{cta}</a>}
          </motion.div>
        })}
      </div>}

      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null) }}>
        <DialogContent dir="rtl" className="max-h-[94vh] max-w-[calc(100%-1rem)] border-[#D4AF37]/30 bg-[#0b0b0b] p-4 sm:max-w-5xl sm:p-6">
          {preview && <><DialogHeader className="pr-7 text-right sm:text-right"><DialogTitle className="text-[#E8C964]">{preview.title}</DialogTitle><DialogDescription>{previewPdf ? 'استعراض المستند داخل الموقع' : 'مشاهدة الفيديو داخل الموقع'}</DialogDescription></DialogHeader><div className="overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-black">{previewPdf ? <iframe src={pdfPreviewUrl(preview.fileUrl)} title={`معاينة ${preview.title}`} className="h-[68vh] min-h-[360px] w-full" allow="fullscreen" /> : previewVideoId ? <div className="aspect-video"><iframe src={`https://www.youtube-nocookie.com/embed/${previewVideoId}?rel=0&playsinline=1`} title={`فيديو ${preview.title}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div> : <div className="p-8 text-center text-sm text-muted-foreground">تعذر تحضير معاينة هذا الرابط.</div>}</div><DialogFooter className="mt-1 gap-2 sm:justify-start"><a href={preview.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center justify-center rounded-md border border-[#D4AF37]/30 px-3 text-sm text-[#E8C964] transition-colors hover:bg-[#D4AF37]/10"><ExternalLink className="ml-1 h-4 w-4" />فتح في نافذة جديدة</a><DialogClose asChild><Button type="button" variant="ghost">إغلاق</Button></DialogClose></DialogFooter></>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
