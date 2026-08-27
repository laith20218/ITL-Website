'use client'

/** Style: لوحة إدارة ITL — مكتبة داكنة ذات إبراز ذهبي؛ الرفع يذهب مباشرة إلى Drive وتبقى عمليات النشر مرئية ومقصودة للمشرف. */
import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Download, ExternalLink, Eye, EyeOff, File, FileText, Image as ImageIcon, Loader2, Pencil, Plus, Smartphone, Trash2, UploadCloud, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

type LibraryKind = 'FILE' | 'APP' | 'IMAGE' | 'VIDEO'
interface LibraryFile {
  id: string; title: string; description: string | null; fileUrl: string; category: string | null; mimeType: string | null
  kind: LibraryKind; coverUrl: string | null; platform: string | null; sortOrder: number; isVisible: boolean; downloadCount: number; createdAt: string
  storageProvider?: string | null; driveFileId?: string | null; publicPermissionId?: string | null
}

const KINDS: Array<{ key: LibraryKind; label: string; icon: typeof File }> = [
  { key: 'FILE', label: 'ملفات', icon: FileText }, { key: 'APP', label: 'تطبيقات', icon: Smartphone },
  { key: 'IMAGE', label: 'صور', icon: ImageIcon }, { key: 'VIDEO', label: 'فيديوهات', icon: Video },
]
const EMPTY_FORM = { title: '', description: '', category: 'عام', fileUrl: '', coverUrl: '', platform: '', isVisible: false }
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024
const FILE_ACCEPT = '.pdf,.docx,.xlsx,.pptx,.zip,.csv,.txt'
const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,.gif'
const UPLOAD_CHUNK_BYTES = 8 * 1024 * 1024

function kindText(kind: LibraryKind) { return KINDS.find((item) => item.key === kind)?.label || 'ملفات' }
function needsDriveUpload(kind: LibraryKind) { return kind === 'FILE' || kind === 'IMAGE' }
function driveItem(item: LibraryFile) { return item.storageProvider === 'GOOGLE_DRIVE' }

async function uploadResumable(uploadUrl: string, file: globalThis.File, mimeType: string, updateProgress: (progress: number) => void) {
  let offset = 0
  while (offset < file.size) {
    const end = Math.min(offset + UPLOAD_CHUNK_BYTES, file.size)
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'Content-Range': `bytes ${offset}-${end - 1}/${file.size}`,
      },
      body: file.slice(offset, end),
    })
    if (response.status === 308) {
      offset = end
      updateProgress(Math.round((offset / file.size) * 100))
      continue
    }
    if (!response.ok) throw new Error('تعذر رفع الملف إلى Google Drive')
    const result = await response.json() as { id?: string }
    if (!result.id) throw new Error('لم يكتمل استلام الملف في Google Drive')
    updateProgress(100)
    return result.id
  }
  throw new Error('لم يكتمل رفع الملف إلى Google Drive')
}

export function LibraryManager({ files: initial }: { files: LibraryFile[] }) {
  const [files, setFiles] = useState<LibraryFile[]>(initial)
  const [kind, setKind] = useState<LibraryKind>('FILE')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<LibraryFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [file, setFile] = useState<globalThis.File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const visibleFiles = useMemo(() => files.filter((item) => item.kind === kind).sort((a, b) => a.sortOrder - b.sortOrder), [files, kind])
  const usesDriveForm = needsDriveUpload(kind)

  function resetForm() { setForm(EMPTY_FORM); setFile(null); setEditing(null); setShowForm(false); setUploadProgress(null) }
  function openNew() { setForm(EMPTY_FORM); setFile(null); setEditing(null); setUploadProgress(null); setShowForm(true) }
  function openEdit(item: LibraryFile) {
    setEditing(item); setFile(null); setUploadProgress(null); setShowForm(true)
    setForm({ title: item.title, description: item.description || '', category: item.category || 'عام', fileUrl: item.fileUrl, coverUrl: item.coverUrl || '', platform: item.platform || '', isVisible: item.isVisible })
  }

  async function completeDriveUpload() {
    if (!file) throw new Error('اختر ملفًا أولًا')
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('حجم الملف يتجاوز الحد المسموح (100 MB)')
    setUploadProgress(0)
    const sessionResponse = await fetch('/api/admin/library/drive/upload-session', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, fileName: file.name, mimeType: file.type, size: file.size }),
    })
    const session = await sessionResponse.json()
    if (!sessionResponse.ok) throw new Error(session.error || 'تعذر بدء رفع Google Drive')
    const driveFileId = await uploadResumable(session.uploadUrl, file, session.mimeType, setUploadProgress)
    const response = await fetch('/api/admin/library/drive/complete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, kind, sortOrder: visibleFiles.length, driveFileId }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'تعذر إضافة الملف إلى المكتبة')
    return data.item as LibraryFile
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.title.trim()) { toast.error('العنوان مطلوب'); return }
    if (!editing && !file && !form.fileUrl.trim()) { toast.error(usesDriveForm ? 'اختر ملفًا للرفع أو أدخل رابطًا خارجيًا' : 'الرابط مطلوب'); return }
    setLoading(true)
    try {
      if (editing) {
        const response = await fetch(`/api/admin/library/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, kind }) })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setFiles((current) => current.map((item) => item.id === editing.id ? data.item : item))
        toast.success('تم تحديث العنصر')
      } else if (file && usesDriveForm) {
        const item = await completeDriveUpload()
        setFiles((current) => [item, ...current])
        toast.success(form.isVisible ? 'تم رفع الملف ونشره في المكتبة' : 'تم رفع الملف إلى Drive وبقي خاصًا')
      } else {
        const payload = new FormData()
        Object.entries({ ...form, kind, sortOrder: visibleFiles.length }).forEach(([key, value]) => payload.append(key, String(value)))
        const response = await fetch('/api/admin/library', { method: 'POST', body: payload })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setFiles((current) => [data.item, ...current])
        toast.success('تمت إضافة العنصر')
      }
      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل الحفظ')
    } finally {
      setLoading(false)
    }
  }

  async function patchItem(item: LibraryFile, changes: Partial<LibraryFile>) {
    const response = await fetch(`/api/admin/library/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'فشل الحفظ')
    setFiles((current) => current.map((currentItem) => currentItem.id === item.id ? data.item : currentItem))
  }

  async function remove(item: LibraryFile) {
    if (!window.confirm(`حذف «${item.title}»؟`)) return
    try { const response = await fetch(`/api/admin/library/${item.id}`, { method: 'DELETE' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setFiles((current) => current.filter((currentItem) => currentItem.id !== item.id)); toast.success('تم حذف العنصر') } catch (error) { toast.error(error instanceof Error ? error.message : 'فشل حذف العنصر') }
  }

  async function move(item: LibraryFile, direction: -1 | 1) {
    const index = visibleFiles.findIndex((currentItem) => currentItem.id === item.id)
    const target = visibleFiles[index + direction]
    if (!target) return
    try { await Promise.all([patchItem(item, { sortOrder: target.sortOrder }), patchItem(target, { sortOrder: item.sortOrder })]) } catch { toast.error('فشل تغيير الترتيب') }
  }

  const urlLabel = kind === 'APP' ? 'رابط المتجر أو الويب *' : kind === 'VIDEO' ? 'رابط YouTube *' : kind === 'IMAGE' ? 'رابط صورة خارجي (اختياري)' : 'رابط ملف خارجي (اختياري)'

  return <div className="space-y-5" dir="rtl">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gradient-gold font-display">المكتبة</h1><p className="mt-1 text-sm text-muted-foreground">ارفع الملفات والصور إلى Google Drive أو أضف روابط التطبيقات وفيديوهات YouTube.</p></div><Button onClick={openNew} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]"><Plus className="ml-1 h-4 w-4" /> عنصر جديد</Button></div>

    <Tabs value={kind} onValueChange={(value) => setKind(value as LibraryKind)}><TabsList className="grid h-auto w-full grid-cols-4 bg-muted/50 p-1">{KINDS.map((item) => { const Icon = item.icon; return <TabsTrigger key={item.key} value={item.key} className="gap-1 py-2 text-xs sm:text-sm"><Icon className="h-3.5 w-3.5" />{item.label}<span className="hidden sm:inline">({files.filter((entry) => entry.kind === item.key).length})</span></TabsTrigger> })}</TabsList></Tabs>

    {showForm && <form onSubmit={submit} className="luxury-card space-y-4 rounded-xl p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">{editing ? `تعديل ${kindText(kind)}` : `إضافة ${kindText(kind)}`}</h2>{usesDriveForm && !editing && <p className="mt-1 text-xs text-muted-foreground">يرفع الملف مباشرة إلى Google Drive؛ يبقى خاصًا حتى تفعّل ظهوره للزائر.</p>}</div><Button type="button" variant="ghost" size="sm" onClick={resetForm}>إلغاء</Button></div><div className="grid gap-4 md:grid-cols-2"><div className="space-y-1.5"><Label>العنوان *</Label><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></div><div className="space-y-1.5"><Label>الفئة</Label><Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="دليل، قالب، تعليمي..." /></div><div className="space-y-1.5 md:col-span-2"><Label>{urlLabel}</Label><Input dir="ltr" value={form.fileUrl} onChange={(event) => setForm({ ...form, fileUrl: event.target.value })} placeholder={kind === 'VIDEO' ? 'https://www.youtube.com/watch?v=...' : 'https://...'} required={kind === 'APP' || kind === 'VIDEO'} disabled={Boolean(editing && driveItem(editing))} /><p className="text-[11px] text-muted-foreground">{editing && driveItem(editing) ? 'رابط Drive محمي ويُدار تلقائيًا من الموقع.' : kind === 'VIDEO' ? 'تُقبل روابط YouTube وyoutu.be وShorts فقط.' : usesDriveForm ? 'الرابط الخارجي اختياري عند اختيار ملف للرفع إلى Drive.' : ''}</p></div>{(kind === 'APP' || kind === 'VIDEO' || kind === 'IMAGE') && <div className="space-y-1.5"><Label>رابط الغلاف (اختياري)</Label><Input dir="ltr" value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} placeholder="https://..." /></div>}{kind === 'APP' && <div className="space-y-1.5"><Label>المنصة</Label><Input value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })} placeholder="Android / iOS / Web" /></div>}<div className="space-y-1.5 md:col-span-2"><Label>الوصف</Label><Textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>{!editing && usesDriveForm && <div className="space-y-1.5 md:col-span-2"><Label>رفع إلى Google Drive {kind === 'IMAGE' ? '(JPG، PNG، WebP، GIF)' : '(PDF، DOCX، XLSX، PPTX، ZIP، CSV، TXT)'}</Label><Input type="file" accept={kind === 'IMAGE' ? IMAGE_ACCEPT : FILE_ACCEPT} onChange={(event) => setFile(event.target.files?.[0] || null)} /><p className="text-[11px] text-muted-foreground">الحد الأقصى 100 MB. سيُتحقق من الصيغة قبل بدء الرفع.</p>{file && <p className="text-xs text-[#D4AF37]">تم اختيار: {file.name} — {Math.ceil(file.size / 1024)} KB</p>}</div>}<div className="flex items-center gap-2"><Switch checked={form.isVisible} onCheckedChange={(checked) => setForm({ ...form, isVisible: checked })} /><Label>ظاهر للزائر بعد الحفظ</Label></div></div>{uploadProgress !== null && <div className="rounded-lg border border-[#D4AF37]/25 bg-[#D4AF37]/10 p-3 text-sm text-[#D4AF37]">جارٍ رفع الملف مباشرة إلى Google Drive: {uploadProgress}%</div>}<Button type="submit" disabled={loading} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : usesDriveForm && !editing ? <UploadCloud className="ml-1 h-4 w-4" /> : <Download className="ml-1 h-4 w-4" />}{loading && uploadProgress !== null ? 'جارٍ الرفع...' : editing ? 'حفظ التعديل' : usesDriveForm ? 'رفع وإضافة للمكتبة' : 'إضافة للمكتبة'}</Button></form>}

    {visibleFiles.length === 0 ? <div className="luxury-card rounded-xl py-16 text-center text-sm text-muted-foreground">لا توجد عناصر ضمن {kindText(kind)} بعد.</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleFiles.map((item, index) => <LibraryItemCard key={item.id} item={item} index={index} total={visibleFiles.length} onEdit={openEdit} onRemove={remove} onMove={move} onToggle={(entry) => patchItem(entry, { isVisible: !entry.isVisible })} />)}</div>}
  </div>
}

function LibraryItemCard({ item, index, total, onEdit, onRemove, onMove, onToggle }: { item: LibraryFile; index: number; total: number; onEdit: (item: LibraryFile) => void; onRemove: (item: LibraryFile) => void; onMove: (item: LibraryFile, direction: -1 | 1) => void; onToggle: (item: LibraryFile) => void }) {
  const Icon = item.kind === 'APP' ? Smartphone : item.kind === 'IMAGE' ? ImageIcon : item.kind === 'VIDEO' ? Video : item.mimeType?.includes('pdf') ? FileText : File
  return <div className={`luxury-card rounded-xl p-4 ${item.isVisible ? '' : 'opacity-55'}`}><div className="mb-3 flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4AF37]/25 bg-[#D4AF37]/10"><Icon className="h-5 w-5 text-[#D4AF37]" /></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{item.title}</h3><div className="mt-1 flex flex-wrap gap-1"><span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] text-[#D4AF37]">{kindText(item.kind)}</span>{driveItem(item) && <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-[10px] text-sky-300">Drive</span>}{item.platform && <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">{item.platform}</span>}</div></div></div>{item.description && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>}<div className="flex items-center justify-between border-t border-white/5 pt-3"><a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"><ExternalLink className="h-3.5 w-3.5" />فتح الرابط</a><div className="flex items-center gap-0.5"><Button size="icon" variant="ghost" className="h-7 w-7" disabled={index === 0} onClick={() => onMove(item, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-7 w-7" disabled={index === total - 1} onClick={() => onMove(item, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onToggle(item)}>{item.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</Button><Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => onRemove(item)}><Trash2 className="h-3.5 w-3.5" /></Button></div></div></div>
}
