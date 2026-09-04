import type { Machine } from '../types'
import { useI18n } from '../i18n/useI18n'

interface MachineHeaderProps {
  machine: Machine
  compact?: boolean
}

export function MachineHeader({ machine, compact = false }: MachineHeaderProps) {
  const { t } = useI18n()
  return (
    <div className="card relative overflow-hidden p-6 text-center shadow-lg shadow-brand-950/5">
      {/* Decorative top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-100/70 to-transparent" aria-hidden="true" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3.5 py-1.5 text-xs font-bold text-success">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          CONNECTED
        </span>

        <h1 className={`mt-3 font-extrabold tracking-tight text-ink ${compact ? 'text-2xl' : 'text-3xl'}`}>
          {machine.machine_code}
        </h1>

        {machine.location && (
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm font-medium text-muted">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {machine.location}
          </p>
        )}

        <p className="mt-4 text-sm font-semibold text-brand-700">{t('machine.howCanWeHelp')}</p>
      </div>
    </div>
  )
}
