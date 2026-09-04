import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getFirebaseApp } from './firebaseConfig'

let storage: FirebaseStorage | null = null

/** Lazily get the Storage instance (only called in non-mock mode). */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp())
  }
  return storage
}