import type { ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'

interface ErrorStateProps {
  title?: string
  body?: string
  onRetry?: () => void
  children?: ReactNode
}

export function ErrorState({ title, body, onRetry, children }: ErrorStateProps) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-danger/10 shadow-inner">
        <span className="text-4xl" aria-hidden="true">
          😕
        </span>
      </span>
      <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
        {title ?? t('error.title')}
      </h2>
      <p className="max-w-xs text-sm leading-relaxed text-muted">{body ?? t('error.body')}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary mt-3 max-w-56"
        >
          {t('error.retry')}
        </button>
      )}
      {children}
    </div>
  )
}
