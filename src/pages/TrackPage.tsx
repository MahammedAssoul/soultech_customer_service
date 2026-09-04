import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { PageLayout } from '../components/PageLayout'
import { TrackSkeleton } from '../components/LoadingState'
import { StatusTimeline, type TimelineStepStatus } from '../components/StatusTimeline'
import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'
import { issueService, requestService } from '../services'
import type { IssueTypeValue, IssueWithMachine, ProductRequestWithMachine } from '../types'

type TrackResult =
  | { kind: 'issue'; data: IssueWithMachine }
  | { kind: 'request'; data: ProductRequestWithMachine }

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; result: TrackResult }
  | { phase: 'not_found' }
  | { phase: 'error' }

const ISSUE_TYPE_LABELS: Record<IssueTypeValue, TranslationKey> = {
  product_didnt_come_out: 'issue.type.productDidntComeOut',
  product_got_stuck: 'issue.type.productGotStuck',
  payment_problem: 'issue.type.paymentProblem',
  wrong_change: 'issue.type.wrongChange',
  machine_not_working: 'issue.type.machineNotWorking',
  machine_empty: 'issue.type.machineEmpty',
  product_damaged: 'issue.type.productDamaged',
  other: 'issue.type.other',
}

function issueSteps(status: string): { labelKey: TranslationKey; status: TimelineStepStatus }[] {
  const order = ['new', 'in_progress', 'resolved', 'rejected']
  const index = order.indexOf(status)
  const current = index === -1 ? 0 : index

  return [
    { labelKey: 'track.submitted', status: 'done' },
    { labelKey: 'track.received', status: current >= 1 ? 'done' : current === 0 ? 'current' : 'pending' },
    { labelKey: 'track.inProgress', status: current >= 2 ? 'done' : current === 1 ? 'current' : 'pending' },
    {
      labelKey: status === 'rejected' ? 'track.rejected' : 'track.resolved',
      status: current >= 3 ? 'done' : current === 2 ? 'current' : 'pending',
    },
  ]
}

function requestSteps(status: string): { labelKey: TranslationKey; status: TimelineStepStatus }[] {
  const order = ['new', 'in_progress', 'resolved', 'rejected']
  const index = order.indexOf(status)
  const current = index === -1 ? 0 : index

  return [
    { labelKey: 'track.submitted', status: 'done' },
    { labelKey: 'track.reviewing', status: current >= 1 ? 'done' : current === 0 ? 'current' : 'pending' },
    {
      labelKey: status === 'rejected' ? 'track.rejected' : 'track.added',
      status: current >= 2 ? 'done' : current === 1 ? 'current' : 'pending',
    },
  ]
}

export function TrackPage() {
  const { reference = '' } = useParams()
  const { t } = useI18n()
  const [state, setState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const isIssue = /^ST-/i.test(reference)
    const lookup = isIssue
      ? issueService.getIssueByReference(reference)
      : requestService.getProductRequestByReference(reference)

    lookup
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setState({ phase: 'not_found' })
          return
        }
        setState({
          phase: 'ready',
          result: isIssue
            ? { kind: 'issue', data: data as IssueWithMachine }
            : { kind: 'request', data: data as ProductRequestWithMachine },
        })
      })
      .catch(() => {
        if (!cancelled) setState({ phase: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [reference, attempt])

  const retry = () => {
    setState({ phase: 'loading' })
    setAttempt((a) => a + 1)
  }

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col justify-center py-4">
        {state.phase === 'loading' && <TrackSkeleton />}

        {state.phase === 'error' && <ErrorState onRetry={retry} />}

        {state.phase === 'not_found' && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-ink">{t('track.notFound.title')}</h1>
            <p className="max-w-xs text-sm text-muted">{t('track.notFound.body')}</p>
            <Link to="/" className="btn-primary mt-2 max-w-56">
              {t('track.back')}
            </Link>
          </div>
        )}

        {state.phase === 'ready' && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {state.result.kind === 'issue' ? t('track.issue') : t('track.request')}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
                #{state.result.data.reference_number}
              </h1>
            </div>

            <div className="card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-accent-500/5" aria-hidden="true" />
              <dl className="relative space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-muted">{t('track.machine')}</dt>
                  <dd className="text-end font-semibold text-ink">
                    {state.result.data.machines?.name ?? state.result.data.machine_id}
                  </dd>
                </div>
                {state.result.kind === 'issue' && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-muted">{t('issue.typeLabel')}</dt>
                    <dd className="text-end font-semibold text-ink">
                      {t(ISSUE_TYPE_LABELS[state.result.data.issue_type])}
                    </dd>
                  </div>
                )}
                {state.result.kind === 'request' && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-muted">{t('track.product')}</dt>
                    <dd className="text-end font-semibold text-ink">
                      {state.result.data.product_name}
                    </dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-muted">{t('track.status')}</dt>
                  <dd className="text-end">
                    <span
                      className={`badge ${
                        state.result.data.status === 'resolved'
                          ? 'bg-success/10 text-success'
                          : state.result.data.status === 'rejected'
                            ? 'bg-danger/10 text-danger'
                            : state.result.data.status === 'in_progress'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          state.result.data.status === 'resolved'
                            ? 'bg-success'
                            : state.result.data.status === 'rejected'
                              ? 'bg-danger'
                              : state.result.data.status === 'in_progress'
                                ? 'bg-warning'
                                : 'bg-brand-600'
                        }`}
                        aria-hidden="true"
                      />
                      {state.result.data.status === 'resolved'
                        ? t('track.resolved')
                        : state.result.data.status === 'rejected'
                          ? t('track.rejected')
                          : state.result.data.status === 'in_progress'
                            ? t('track.inProgress')
                            : t('track.submitted')}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">{t('track.status')}</h2>
              <StatusTimeline
                steps={
                  state.result.kind === 'issue'
                    ? issueSteps(state.result.data.status)
                    : requestSteps(state.result.data.status)
                }
              />
            </div>

            <Link to="/" className="btn-secondary">
              {t('track.back')}
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  )
}