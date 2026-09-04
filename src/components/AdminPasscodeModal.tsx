import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/useI18n'

export const ADMIN_PASSCODE = '19992001'

interface AdminPasscodeModalProps {
  open: boolean
  onUnlock: () => void
  onCancel: () => void
}

export function AdminPasscodeModal({ open, onUnlock, onCancel }: AdminPasscodeModalProps) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (code === ADMIN_PASSCODE) {
      setCode('')
      setError(false)
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('admin.passcode.title')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="card w-full max-w-sm p-6 shadow-xl shadow-brand-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11v-6M17 11v-6" />
          </svg>
        </div>

        <h2 className="mt-4 text-center text-xl font-extrabold tracking-tight text-ink">
          {t('admin.passcode.title')}
        </h2>
        <p className="mt-1 text-center text-sm text-muted">{t('admin.passcode.subtitle')}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3">
          <label htmlFor="admin-passcode" className="sr-only">
            {t('admin.passcode.placeholder')}
          </label>
          <input
            id="admin-passcode"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError(false)
            }}
            aria-invalid={error || undefined}
            placeholder={t('admin.passcode.placeholder')}
            className={`input text-center tracking-[0.3em] ${
              error ? '!border-danger focus:!ring-danger/25' : ''
            }`}
          />

          {error && (
            <p role="alert" className="text-sm text-danger">
              {t('admin.passcode.error')}
            </p>
          )}

          <button type="submit" className="btn-primary">
            {t('admin.passcode.submit')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            {t('admin.passcode.cancel')}
          </button>
        </form>
      </div>
    </div>
  )
}