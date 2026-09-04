import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'

interface SuccessScreenProps {
  reference: string
  kind: 'issue' | 'request'
}

export function SuccessScreen({ reference, kind }: SuccessScreenProps) {
  const { t } = useI18n()
  const title = kind === 'issue' ? t('success.issue.title') : t('success.request.title')
  const body = kind === 'issue' ? t('success.issue.body') : t('success.request.body')

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-success/5">
        <span className="absolute inset-0 animate-ping rounded-full bg-success/10 [animation-duration:2.5s]" aria-hidden="true" />
        <svg
          className="relative h-12 w-12 text-success"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="16 8 10.5 14.5 8 12" />
        </svg>
      </span>

      <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted">{body}</p>

      <div className="mt-2 w-full overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-b from-surface to-brand-50/50 p-6 shadow-lg shadow-brand-950/5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">
          {t('success.reference')}
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight text-brand-700">
          #{reference}
        </p>
      </div>

      <p className="text-sm font-medium text-muted">{t('track.received')}</p>

      <div className="mt-2 flex w-full flex-col gap-3">
        <Link to={`/track/${reference}`} className="btn-primary">
          {t('success.track')}
        </Link>
        <Link to="/" className="btn-secondary">
          {t('success.done')}
        </Link>
      </div>
    </div>
  )
}
