import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { isMockService } from './config/appConfig'

// Initialize Firebase Analytics in production mode only (mock mode stays
// offline and never loads the Firebase SDK).
if (!isMockService) {
  import('./firebase/firebaseAnalytics')
    .then((m) => m.getFirebaseAnalytics())
    .catch(() => {
      // Analytics is best-effort — never crash the app on failure.
    })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)