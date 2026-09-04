/**
 * Central application configuration.
 *
 * Set `isMockService` to `true` to run the entire application on local mock
 * data (no Firebase, no network, works offline).
 * Set it to `false` to use the real Firebase services (Firestore + Storage +
 * anonymous auth), configured via the VITE_FIREBASE_* environment variables.
 */
export const isMockService = false