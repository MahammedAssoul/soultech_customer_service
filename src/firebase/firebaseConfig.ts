import { initializeApp, type FirebaseApp } from 'firebase/app'

/**
 * Firebase configuration.
 *
 * The app reads all values from Vite environment variables. Mock mode
 * (isMockService = true) never initializes Firebase — these files are only
 * loaded when the firebase services are dynamically imported.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
)

// Initialize Firebase.
// This module is only loaded when the Firebase services are dynamically
// imported (isMockService === false), so initializing at module level is safe
// and matches the standard Firebase web SDK setup.
export const app: FirebaseApp | null = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null

/** Thrown when the Firebase environment variables are missing. */
export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super(
      'Firebase is not configured. Set the VITE_FIREBASE_* variables in your environment.',
    )
    this.name = 'FirebaseNotConfiguredError'
  }
}

/**
 * Returns the initialized Firebase app instance. Throws a descriptive error
 * when the environment variables are missing so pages can show a friendly
 * state instead of crashing.
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    throw new FirebaseNotConfiguredError()
  }
  return app
}