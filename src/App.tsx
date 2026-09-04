import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nProvider'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'
import { IssuePage } from './pages/IssuePage'
import { MachinePage } from './pages/MachinePage'
import { RequestNewProductPage } from './pages/RequestNewProductPage'
import { RequestPage } from './pages/RequestPage'
import { TrackPage } from './pages/TrackPage'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/machine/:machineId" element={<MachinePage />} />
          <Route path="/machine/:machineId/issue" element={<IssuePage />} />
          <Route path="/machine/:machineId/request" element={<RequestPage />} />
          <Route path="/machine/:machineId/request/new" element={<RequestNewProductPage />} />
          <Route path="/track/:reference" element={<TrackPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}