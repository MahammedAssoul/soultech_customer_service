import { isMockService } from '../config/appConfig'

export type PhotoResult =
  | { ok: true; url: string }
  | { ok: false; error: 'too_large' | 'unsupported' | 'compress_failed' | 'upload_failed' }

/**
 * Photo upload abstraction. In mock mode a local object URL is returned and
 * nothing is uploaded anywhere; in production mode the photo is compressed
 * and uploaded to Firebase Storage.
 */
export const photoService = {
  uploadCustomerPhoto: (file: File): Promise<PhotoResult> =>
    isMockService
      ? import('./mock/mockPhotoService').then((m) => m.uploadCustomerPhoto(file))
      : import('./firebase/photoService').then((m) => m.uploadCustomerPhoto(file)),
  uploadAdminPhoto: (file: File): Promise<PhotoResult> =>
    isMockService
      ? import('./mock/mockPhotoService').then((m) => m.uploadAdminPhoto(file))
      : import('./firebase/photoService').then((m) => m.uploadAdminPhoto(file)),
}
