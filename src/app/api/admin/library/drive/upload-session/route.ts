import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { createDriveUploadSession, MAX_LIBRARY_UPLOAD_BYTES, validateLibraryUpload } from '@/lib/google-drive'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const body = await req.json() as { kind?: string; fileName?: string; mimeType?: string; size?: number }
    const kind = body.kind?.toUpperCase()
    const size = Number(body.size)
    if ((kind !== 'FILE' && kind !== 'IMAGE') || !body.fileName || !Number.isFinite(size) || size <= 0) return NextResponse.json({ error: 'بيانات الرفع غير صالحة' }, { status: 400 })
    if (size > MAX_LIBRARY_UPLOAD_BYTES) return NextResponse.json({ error: 'حجم الملف يتجاوز الحد المسموح (100 MB)' }, { status: 400 })

    const file = validateLibraryUpload(kind, body.fileName, body.mimeType)
    const uploadUrl = await createDriveUploadSession({ kind, fileName: body.fileName, mimeType: file.mimeType, size })
    return NextResponse.json({ uploadUrl, mimeType: file.mimeType, maxBytes: MAX_LIBRARY_UPLOAD_BYTES })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'تعذر بدء الرفع' }, { status: 400 })
  }
}
