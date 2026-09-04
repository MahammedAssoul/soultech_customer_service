import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/PageLayout'
import { MachineSkeleton } from '../components/LoadingState'
import { useI18n } from '../i18n/useI18n'
import { machineService } from '../services'
import squaredLogo from '../assets/squared_logo.png'
import type { Machine } from '../types'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; machines: Machine[] }
  | { phase: 'error' }

export function HomePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>({ phase: 'loading' })
  const [machineCode, setMachineCode] = useState('')
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    machineService
      .getMachines()
      .then((machines) => {
        if (cancelled) return
        setLoadState({ phase: 'ready', machines })
      })
      .catch(() => {
        if (!cancelled) setLoadState({ phase: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    setLoadState({ phase: 'loading' })
    setAttempt((a) => a + 1)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!machineCode) {
      setError(true)
      return
    }
    navigate(`/machine/${encodeURIComponent(machineCode)}`)
  }

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <span className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white p-2 shadow-xl shadow-brand-600/20 ring-1 ring-line">
          <img
            src={squaredLogo}
            alt="Soultech Vending logo"
            className="h-full w-full rounded-[1.6rem] object-contain"
          />
        </span>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
          {t('home.title')}
        </h1>
        <p className="mt-2 max-w-xs text-base leading-relaxed text-muted">
          {t('home.subtitle')}
        </p>

        <div className="card card-hover mt-8 w-full p-5">
          <p className="mb-3 text-sm font-medium text-muted">{t('home.scanHint')}</p>

          {loadState.phase === 'loading' && <MachineSkeleton />}

          {loadState.phase === 'error' && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <p className="text-sm text-muted">{t('error.body')}</p>
              <button
                type="button"
                onClick={retry}
                className="btn-primary mt-1 max-w-52"
              >
                {t('error.retry')}
              </button>
            </div>
          )}

          {loadState.phase === 'ready' && loadState.machines.length === 0 && (
            <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
              {t('home.noMachines')}
            </p>
          )}

          {loadState.phase === 'ready' && loadState.machines.length > 0 && (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="machine-select" className="sr-only">
                {t('home.selectMachine')}
              </label>
              <div className="relative">
                <select
                  id="machine-select"
                  value={machineCode}
                  onChange={(e) => {
                    setMachineCode(e.target.value)
                    if (error) setError(false)
                  }}
                  aria-invalid={error || undefined}
                  className={`input appearance-none pe-10 font-semibold ${
                    machineCode ? 'text-ink' : 'text-muted'
                  } ${error ? '!border-danger focus:!ring-danger/25' : ''}`}
                >
                  <option value="" disabled>
                    {t('home.selectMachinePlaceholder')}
                  </option>
                  {loadState.machines.map((machine) => (
                    <option key={machine.id} value={machine.machine_code} className="text-ink">
                      {machine.machine_code}
                      {machine.location ? ` — ${machine.location}` : ''}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted rtl:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {error && (
                <p role="alert" className="mt-2 text-sm text-danger">
                  {t('home.codeError')}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary mt-4"
              >
                {t('home.go')}
                <svg
                  className="h-5 w-5 rtl:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
