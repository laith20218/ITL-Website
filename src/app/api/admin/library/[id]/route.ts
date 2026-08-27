import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { canonicalYouTubeUrl, DRIVE_STORAGE_PROVIDER, grantPublicRead, revokePublicRead } from '@/lib/google-drive'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const body = await req.json() as Record<string, unknown>
    const current = await db.libraryFile.findUnique({ where: { id } })
    if (!current) return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
    const data: Record<string, unknown> = {}
    for (const key of ['title', 'description', 'category', 'fileUrl', 'coverUrl', 'platform', 'kind', 'sortOrder', 'isVisible']) {
      if (key in body) data[key] = body[key]
    }
    if (typeof data.kind === 'string') data.kind = data.kind.toUpperCase()
    if (data.kind && !['FILE', 'APP', 'IMAGE', 'VIDEO'].includes(String(data.kind))) return NextResponse.json({ error: 'نوع غير صالح' }, { status: 400 })
    if (current.storageProvider === DRIVE_STORAGE_PROVIDER) {
      if (data.kind && data.kind !== current.kind) return NextResponse.json({ error: 'لا يمكن تغيير نوع عنصر مرفوع إلى Google Drive' }, { status: 400 })
      delete data.fileUrl
      if (typeof data.isVisible === 'boolean' && data.isVisible !== current.isVisible) {
        if (data.isVisible && current.driveFileId) data.publicPermissionId = await grantPublicRead(current.driveFileId)
        if (!data.isVisible && current.driveFileId && current.publicPermissionId) {
          await revokePublicRead(current.driveFileId, current.publicPermissionId)
          data.publicPermissionId = null
        }
      }
    } else if (current.kind === 'VIDEO' && typeof data.fileUrl === 'string') {
      data.fileUrl = canonicalYouTubeUrl(data.fileUrl)
    }
    const item = await db.libraryFile.update({ where: { id }, data })
    return NextResponse.json({ item })
  } catch {
    return NextResponse.json({ error: 'فشل تحديث العنصر' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { id } = await params
  try {
    const item = await db.libraryFile.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
    if (item.storageProvider === DRIVE_STORAGE_PROVIDER && item.driveFileId && item.publicPermissionId) await revokePublicRead(item.driveFileId, item.publicPermissionId)
    await db.libraryFile.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'فشل حذف العنصر' }, { status: 400 })
  }
}
