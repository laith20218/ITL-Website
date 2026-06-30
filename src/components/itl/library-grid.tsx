'use client'
import { FileText, Image as ImageIcon, Video, File, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface LibraryFile {
  id: string
  title: string
  description: string | null
  fileUrl: string
  category: string | null
  mimeType: string | null
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

export function LibraryGrid({ files }: { files: LibraryFile[] }) {
  if (files.length === 0) {
    return <p className="text-center text-muted-foreground py-20">لا توجد ملفات بعد</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {files.map((file, i) => {
        const isPdf = file.mimeType?.includes('pdf') || file.fileUrl.endsWith('.pdf')
        const isImage = file.mimeType?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/.test(file.fileUrl)
        const isVideo = file.mimeType?.includes('video') || /\.(mp4|webm|mov)$/.test(file.fileUrl)
        const Icon = isPdf ? FileText : isImage ? ImageIcon : isVideo ? Video : File

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="luxury-card rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1 truncate">{file.title}</h3>
                {file.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {CATEGORY_LABELS[file.category] || file.category}
                  </span>
                )}
              </div>
            </div>
            {file.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{file.description}</p>}
            <a
              href={file.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              تحميل
            </a>
          </motion.div>
        )
      })}
    </div>
  )
}
