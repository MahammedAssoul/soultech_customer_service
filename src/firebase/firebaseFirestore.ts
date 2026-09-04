import { getFirestore, type Firestore } from 'firebase/firestore'
import { getFirebaseApp } from './firebaseConfig'

let db: Firestore | null = null

/** Database id — the created Firestore database name. */
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || 'soultech-support'

/** Lazily get the Firestore instance (only called in non-mock mode). */
export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp(), databaseId)
  }
  return db
}