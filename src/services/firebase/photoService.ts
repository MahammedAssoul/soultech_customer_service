import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '../../firebase/firebaseStorage'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'

export type PhotoResult =
  | { ok: true; url: string }
  | { ok: false; error: 'too_large' | 'unsupported' | 'compress_failed' | 'upload_failed' }

const MAX_DIMENSION = 1280
const JPEG_QUALITY = 0.8
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

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

/** Compress/resize an image on the client before upload. */
async function compressImage(file: File): Promise<Blob> {
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
 * Upload a photo to Firebase Storage for an issue.
 * The file is compressed/resized first, then uploaded, and the public
 * download URL is returned. On failure a structured error is returned so
 * the form can continue without the photo.
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

  // Sign in anonymously so Storage rules can validate the uploader.
  let uid: string
  try {
    uid = await ensureAnonymousAuth()
  } catch {
    return { ok: false, error: 'upload_failed' }
  }

  try {
    const fileName = `${Date.now()}-${crypto.randomUUID()}.jpg`
    const path = `issues/${uid}/${fileName}`
    const storage = getFirebaseStorage()
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
    const url = await getDownloadURL(storageRef)
    return { ok: true, url }
  } catch {
    return { ok: false, error: 'upload_failed' }
  }
}

/**
 * Upload a photo for an admin-managed asset (e.g. a requested product).
 * Uploads to the `requestedProducts/` storage folder, which only admins
 * can write to per storage rules.
 */
export async function uploadAdminPhoto(file: File): Promise<PhotoResult> {
  if (file.size > MAX_FILE_SIZE) return { ok: false, error: 'too_large' }
  if (!SUPPORTED_TYPES.has(file.type)) return { ok: false, error: 'unsupported' }

  let blob: Blob
  try {
    blob = await compressImage(file)
  } catch {
    return { ok: false, error: 'compress_failed' }
  }

  let uid: string
  try {
    uid = await ensureAnonymousAuth()
  } catch {
    return { ok: false, error: 'upload_failed' }
  }

  try {
    const fileName = `${Date.now()}-${crypto.randomUUID()}.jpg`
    const path = `requestedProducts/${uid}/${fileName}`
    const storage = getFirebaseStorage()
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' })
    const url = await getDownloadURL(storageRef)
    return { ok: true, url }
  } catch {
    return { ok: false, error: 'upload_failed' }
  }
}