/** Google Drive library storage: server-only credentials, upload sessions, and scoped sharing helpers. */
import { JWT } from 'google-auth-library'

export const DRIVE_STORAGE_PROVIDER = 'GOOGLE_DRIVE'
export const MAX_LIBRARY_UPLOAD_BYTES = 100 * 1024 * 1024

type DriveLibraryKind = 'FILE' | 'IMAGE'

interface DriveCredentials {
  client_email: string
  private_key: string
}

interface DriveFileMetadata {
  id: string
  name: string
  mimeType: string
  size?: string
  parents?: string[]
  webViewLink?: string
}

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']
const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
}
const FILE_MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
  csv: 'text/csv',
  txt: 'text/plain',
}

function configurationError() {
  return new Error('إعداد رفع Google Drive غير مكتمل')
}

function getDriveCredentials(): DriveCredentials {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw configurationError()

  try {
    const credentials = JSON.parse(raw) as Partial<DriveCredentials>
    if (typeof credentials.client_email !== 'string' || typeof credentials.private_key !== 'string') throw new Error()
    return { client_email: credentials.client_email, private_key: credentials.private_key }
  } catch {
    throw configurationError()
  }
}

async function getAccessToken() {
  const credentials = getDriveCredentials()
  const client = new JWT({ email: credentials.client_email, key: credentials.private_key, scopes: DRIVE_SCOPES })
  const token = await client.getAccessToken()
  if (!token) throw new Error('تعذر مصادقة خادم المكتبة مع Google Drive')
  return token
}

async function driveRequest(url: string, init: RequestInit = {}) {
  const token = await getAccessToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(url, { ...init, headers })
}

function responseError(message: string) {
  return new Error(message)
}

export function getDriveFolderId(kind: DriveLibraryKind) {
  const folderId = kind === 'IMAGE' ? process.env.GOOGLE_DRIVE_IMAGES_FOLDER_ID : process.env.GOOGLE_DRIVE_FILES_FOLDER_ID
  if (!folderId) throw configurationError()
  return folderId
}

function extensionOf(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return extension.replace(/[^a-z0-9]/g, '')
}

export function validateLibraryUpload(kind: DriveLibraryKind, fileName: string, declaredMimeType?: string | null) {
  const extension = extensionOf(fileName)
  const allowedMimes = kind === 'IMAGE' ? IMAGE_MIME_BY_EXTENSION : FILE_MIME_BY_EXTENSION
  const expectedMimeType = allowedMimes[extension]
  if (!expectedMimeType) throw responseError(kind === 'IMAGE' ? 'صيغة الصورة غير مدعومة' : 'صيغة الملف غير مدعومة')

  const mimeType = (declaredMimeType || expectedMimeType).toLowerCase()
  const allowedAliases = extension === 'csv' ? ['text/csv', 'application/vnd.ms-excel', 'application/octet-stream']
    : extension === 'zip' ? ['application/zip', 'application/x-zip-compressed', 'application/octet-stream']
      : [expectedMimeType, 'application/octet-stream']
  if (!allowedAliases.includes(mimeType)) throw responseError('نوع الملف لا يطابق صيغ المكتبة المعتمدة')

  return { extension, mimeType: expectedMimeType }
}

export function driveViewUrl(fileId: string) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`
}

export function driveImageUrl(fileId: string) {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`
}

export function drivePreviewUrl(fileId: string) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`
}

export async function createDriveUploadSession(input: { fileName: string; mimeType: string; size: number; kind: DriveLibraryKind }) {
  const folderId = getDriveFolderId(input.kind)
  const response = await driveRequest('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size,parents,webViewLink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': input.mimeType,
      'X-Upload-Content-Length': String(input.size),
    },
    body: JSON.stringify({ name: input.fileName, mimeType: input.mimeType, parents: [folderId] }),
  })
  if (!response.ok) throw responseError('تعذر بدء جلسة رفع Google Drive')

  const uploadUrl = response.headers.get('location')
  if (!uploadUrl) throw responseError('تعذر تجهيز رابط رفع الملف')
  return uploadUrl
}

export async function getDriveFile(fileId: string): Promise<DriveFileMetadata> {
  const fields = 'id,name,mimeType,size,parents,webViewLink'
  const response = await driveRequest(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=${encodeURIComponent(fields)}`)
  if (!response.ok) throw responseError('تعذر التحقق من الملف المرفوع')
  return response.json() as Promise<DriveFileMetadata>
}

export async function grantPublicRead(fileId: string) {
  const response = await driveRequest(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/permissions?sendNotificationEmail=false&fields=id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'anyone', role: 'reader', allowFileDiscovery: false }),
  })
  if (!response.ok) throw responseError('تعذر منح رابط العرض العام للملف')
  const permission = await response.json() as { id?: string }
  if (!permission.id) throw responseError('تعذر حفظ إذن العرض العام')
  return permission.id
}

export async function revokePublicRead(fileId: string, permissionId: string) {
  const response = await driveRequest(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/permissions/${encodeURIComponent(permissionId)}`, { method: 'DELETE' })
  if (!response.ok && response.status !== 404) throw responseError('تعذر سحب رابط العرض العام للملف')
}

export function canonicalYouTubeUrl(value: string) {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '').toLowerCase()
    let videoId = ''
    if (host === 'youtu.be') videoId = url.pathname.slice(1).split('/')[0]
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      videoId = url.searchParams.get('v') || ''
      if (!videoId && /^\/(shorts|embed)\//.test(url.pathname)) videoId = url.pathname.split('/')[2] || ''
    }
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error()
    return `https://www.youtube.com/watch?v=${videoId}`
  } catch {
    throw responseError('أدخل رابط فيديو YouTube صالحًا')
  }
}
