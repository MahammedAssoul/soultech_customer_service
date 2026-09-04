import { getAuth, signInAnonymously, onAuthStateChanged, type Auth } from 'firebase/auth'
import { getFirebaseApp } from './firebaseConfig'

let auth: Auth | null = null

/** Lazily get the Auth instance (only called in non-mock mode). */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

/**
 * Ensure the customer is authenticated anonymously.
 *
 * Customers should never see a login screen: the first Firebase-backed
 * operation signs them in invisibly. The anonymous UID becomes the
 * customer's identity for voting and issue ownership.
 */
export async function ensureAnonymousAuth(): Promise<string> {
  const auth = getFirebaseAuth()
  if (auth.currentUser) return auth.currentUser.uid

  const userCredential = await signInAnonymously(auth)
  return userCredential.user.uid
}

/** Subscribe to auth state changes (used for vote ownership cleanup). */
export function onAuthChange(callback: (uid: string | null) => void): () => void {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, (user) => callback(user?.uid ?? null))
}