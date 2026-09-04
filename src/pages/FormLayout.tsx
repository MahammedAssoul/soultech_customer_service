import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { Machine } from '../types'

interface FormLayoutProps {
  machine: Machine
  title: string
  subtitle: string
  children: ReactNode
}

export function FormLayout({ machine, title, subtitle, children }: FormLayoutProps) {
  const { t } = useI18n()
  return (
    <div className="mx-auto w-full max-w-md px-5 py-8">
      <Link
        to={`/machine/${machine.machine_code}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand-700"
      >
        <svg
          className="h-4 w-4 rtl:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t('machine.back')}
      </Link>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-md shadow-brand-950/5">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
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
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">
              {machine.name || machine.machine_code}
            </p>
            <p className="truncate text-xs text-muted">
              {machine.machine_code}
              {machine.location ? ` · ${machine.location}` : ''}
            </p>
          </div>
          <span className="ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-success">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            CONNECTED
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>

      <div className="mt-6">{children}</div>
    </div>
  )
}
