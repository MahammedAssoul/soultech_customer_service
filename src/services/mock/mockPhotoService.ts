const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export type PhotoResult =
  | { ok: true; url: string }
  | { ok: false; error: 'too_large' | 'unsupported' | 'compress_failed' | 'upload_failed' }

/**
 * Mock photo upload — never touches Supabase Storage.
 * Creates a local object URL for preview and returns it as the "uploaded" URL.
 * The URL is only valid for the current session; the submission still succeeds.
 */
export async function uploadCustomerPhoto(file: File): Promise<PhotoResult> {
  // Simulate a short processing delay so the UI state is visible.
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (file.size > MAX_FILE_SIZE) return { ok: false, error: 'too_large' }
  if (!SUPPORTED_TYPES.has(file.type)) return { ok: false, error: 'unsupported' }

  try {
    const url = URL.createObjectURL(file)
    return { ok: true, url }
  } catch {
    return { ok: false, error: 'compress_failed' }
  }
}

/** Mock admin photo upload — mirrors uploadCustomerPhoto locally. */
export async function uploadAdminPhoto(file: File): Promise<PhotoResult> {
  return uploadCustomerPhoto(file)
}