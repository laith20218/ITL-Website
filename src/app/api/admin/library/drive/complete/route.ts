import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { DRIVE_STORAGE_PROVIDER, driveImageUrl, driveViewUrl, getDriveFile, getDriveFolderId, grantPublicRead, MAX_LIBRARY_UPLOAD_BYTES, revokePublicRead, validateLibraryUpload } from '@/lib/google-drive'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  let grantedPermissionId: string | null = null
  let driveFileId = ''
  try {
    const body = await req.json() as Record<string, unknown>
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const kind = typeof body.kind === 'string' ? body.kind.toUpperCase() : ''
    driveFileId = typeof body.driveFileId === 'string' ? body.driveFileId : ''
    if (!title || (kind !== 'FILE' && kind !== 'IMAGE') || !driveFileId) return NextResponse.json({ error: 'بيانات الملف المرفوع غير صالحة' }, { status: 400 })

    const existing = await db.libraryFile.findUnique({ where: { driveFileId } })
    if (existing) return NextResponse.json({ error: 'تمت إضافة هذا الملف إلى المكتبة مسبقًا' }, { status: 409 })

    const uploadedFile = await getDriveFile(driveFileId)
    const folderId = getDriveFolderId(kind)
    if (!uploadedFile.parents?.includes(folderId)) return NextResponse.json({ error: 'الملف ليس ضمن مجلد مكتبة ITL المعتمد' }, { status: 400 })
    const size = Number(uploadedFile.size || 0)
    if (!Number.isFinite(size) || size <= 0 || size > MAX_LIBRARY_UPLOAD_BYTES) return NextResponse.json({ error: 'حجم الملف المرفوع غير صالح' }, { status: 400 })
    const file = validateLibraryUpload(kind, uploadedFile.name, uploadedFile.mimeType)

    const isVisible = body.isVisible !== false
    if (isVisible) grantedPermissionId = await grantPublicRead(driveFileId)

    const sortOrder = Number(body.sortOrder)
    const coverUrl = typeof body.coverUrl === 'string' && body.coverUrl.trim() ? body.coverUrl.trim() : (kind === 'IMAGE' ? driveImageUrl(driveFileId) : null)
    const item = await db.libraryFile.create({
      data: {
        title,
        description: typeof body.description === 'string' ? body.description.trim() || null : null,
        category: typeof body.category === 'string' ? body.category.trim() || 'عام' : 'عام',
        fileUrl: driveViewUrl(driveFileId),
        mimeType: file.mimeType,
        kind,
        coverUrl,
        platform: null,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        isVisible,
        storageProvider: DRIVE_STORAGE_PROVIDER,
        driveFileId,
        publicPermissionId: grantedPermissionId,
      },
    })
    return NextResponse.json({ item })
  } catch (error) {
    if (grantedPermissionId && driveFileId) {
      try { await revokePublicRead(driveFileId, grantedPermissionId) } catch { /* The Drive file remains private if cleanup fails later. */ }
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'تعذر إضافة الملف إلى المكتبة' }, { status: 400 })
  }
}
