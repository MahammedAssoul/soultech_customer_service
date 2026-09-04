import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getFirebaseApp, isFirebaseConfigured } from './firebaseConfig'

let analytics: Analytics | null = null
let analyticsReady: Promise<Analytics | null> | null = null

/**
 * Lazily initializes Firebase Analytics (best-effort, only in non-mock mode).
 * Analytics is not supported in every environment (e.g. some privacy modes),
 * so failures are swallowed and `null` is returned.
 */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null)
  if (analytics) return Promise.resolve(analytics)
  if (!analyticsReady) {
    analyticsReady = isSupported()
      .then((supported) => {
        if (!supported) return null
        analytics = getAnalytics(getFirebaseApp())
        return analytics
      })
      .catch(() => null)
  }
  return analyticsReady
}