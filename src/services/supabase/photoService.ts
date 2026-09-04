import { getSupabase } from './supabaseClient'

const MAX_DIMENSION = 1280
const JPEG_QUALITY = 0.8
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

export type PhotoResult =
  | { ok: true; url: string }
  | { ok: false; error: 'too_large' | 'unsupported' | 'compress_failed' | 'upload_failed' }

const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image'))
    }
    img.src = url
  })
}

/**
 * Compress/resize an image on the client before upload.
 * Returns a JPEG blob no larger than MAX_DIMENSION on its longest side.
 */
export async function compressImage(file: File): Promise<Blob> {
  const img = await loadImage(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.drawImage(img, 0, 0, width, height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Could not encode image'))
      },
      'image/jpeg',
      JPEG_QUALITY,
    )
  })
}

/**
 * Upload a customer photo to Supabase Storage.
 * Compresses large images first; on any failure returns a structured error
 * so the form can continue without the photo.
 */
export async function uploadCustomerPhoto(file: File): Promise<PhotoResult> {
  if (file.size > MAX_FILE_SIZE) return { ok: false, error: 'too_large' }
  if (!SUPPORTED_TYPES.has(file.type)) return { ok: false, error: 'unsupported' }

  let blob: Blob
  try {
    blob = await compressImage(file)
  } catch {
    return { ok: false, error: 'compress_failed' }
  }

  const fileName = `${crypto.randomUUID()}.jpg`
  const path = `issues/${fileName}`

  const { error } = await getSupabase().storage
    .from('customer-photos')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

  if (error) return { ok: false, error: 'upload_failed' }

  const { data } = getSupabase().storage.from('customer-photos').getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}