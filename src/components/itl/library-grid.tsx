'use client'
/** Style: مسار الإنجاز الذهبي — مكتبة مصنفة بأربعة تبويبات واضحة وبطاقات ملائمة لطبيعة كل مورد. */
import { useMemo, useState } from 'react'
import { FileText, Image as ImageIcon, Video, File, Download, Smartphone, ExternalLink, Play, ImageOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  'دليل': 'دليل',
  'قالب': 'قالب',
  'بحث': 'بحث',
  'صورة': 'صورة',
  'فيديو': 'فيديو',
  'عام': 'عام',
}

const KINDS = [
  { key: 'FILE', label: 'ملفات', empty: 'لا توجد ملفات متاحة بعد' },
  { key: 'APP', label: 'تطبيقات', empty: 'لا توجد تطبيقات متاحة بعد' },
  { key: 'IMAGE', label: 'صور', empty: 'لا توجد صور متاحة بعد' },
  { key: 'VIDEO', label: 'فيديوهات', empty: 'لا توجد فيديوهات متاحة بعد' },
] as const

export function LibraryGrid({ files }: { files: LibraryFile[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]['key']>('FILE')
  const visibleFiles = useMemo(() => files.filter((file) => file.isVisible !== false && (file.kind || 'FILE') === kind).sort((a, b) => a.sortOrder - b.sortOrder), [files, kind])
  const kindMeta = KINDS.find((item) => item.key === kind) || KINDS[0]

  return (
    <div className="space-y-7">
      <Tabs value={kind} onValueChange={(value) => setKind(value as typeof kind)}>
        <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-4 bg-muted/50 p-1">
          {KINDS.map((item) => <TabsTrigger key={item.key} value={item.key} className="py-2 text-xs sm:text-sm">{item.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {visibleFiles.length === 0 ? <div className="py-20 text-center text-muted-foreground">{kindMeta.empty}</div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
      {visibleFiles.map((file, i) => {
        const isPdf = file.mimeType?.includes('pdf') || file.fileUrl.endsWith('.pdf')
        const isImage = file.kind === 'IMAGE' || file.mimeType?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileUrl)
        const isVideo = file.kind === 'VIDEO' || file.mimeType?.includes('video') || /\.(mp4|webm|mov)$/i.test(file.fileUrl)
        const Icon = file.kind === 'APP' ? Smartphone : isPdf ? FileText : isImage ? ImageIcon : isVideo ? Video : File
        const cta = file.kind === 'APP' ? 'فتح التطبيق' : file.kind === 'VIDEO' ? 'مشاهدة الفيديو' : file.kind === 'IMAGE' ? 'عرض الصورة' : 'تحميل'
        const ActionIcon = file.kind === 'FILE' ? Download : file.kind === 'VIDEO' ? Play : ExternalLink

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="luxury-card rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all"
          >
            {(file.coverUrl || (file.kind === 'IMAGE' && file.fileUrl)) && <div className="mb-4 overflow-hidden rounded-lg border border-[#D4AF37]/15 bg-black/20 aspect-[16/9]">{file.coverUrl || file.fileUrl ? <img src={file.coverUrl || file.fileUrl} alt={file.title} className="h-full w-full object-cover" loading="lazy" /> : <ImageOff className="m-auto h-full text-muted-foreground" />}</div>}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1 truncate">{file.title}</h3>
                <div className="flex flex-wrap gap-1.5">{file.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {CATEGORY_LABELS[file.category] || file.category}
                  </span>
                )}{file.platform && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">{file.platform}</span>}</div>
              </div>
            </div>
            {file.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{file.description}</p>}
            <a
              href={file.fileUrl}
              download={file.kind === 'FILE'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium transition-colors"
            >
              <ActionIcon className="h-4 w-4" />
              {cta}
            </a>
          </motion.div>
        )
      })}</div>}
    </div>
  )
}
