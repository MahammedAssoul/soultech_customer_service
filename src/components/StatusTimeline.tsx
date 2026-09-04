import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'

export type TimelineStepStatus = 'done' | 'current' | 'pending'

interface StatusTimelineProps {
  steps: { labelKey: TranslationKey; status: TimelineStepStatus }[]
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  const { t } = useI18n()
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={step.labelKey} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute start-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 rounded-full ${
                  step.status === 'done' ? 'bg-success' : 'bg-line'
                }`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                step.status === 'done'
                  ? 'border-success bg-gradient-to-br from-success to-success/80 text-white shadow-md shadow-success/30'
                  : step.status === 'current'
                    ? 'border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'border-line bg-surface text-muted'
              }`}
            >
              {step.status === 'done' ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step.status === 'current' ? (
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
              )}
            </span>
            <span
              className={`pt-1 text-sm font-semibold ${
                step.status === 'done'
                  ? 'text-ink'
                  : step.status === 'current'
                    ? 'text-brand-700'
                    : 'text-muted'
              }`}
            >
              {t(step.labelKey)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
