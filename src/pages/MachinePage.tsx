import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ActionCard } from '../components/ActionCard'
import { ErrorState } from '../components/ErrorState'
import { PageLayout } from '../components/PageLayout'
import { MachineHeader } from '../components/MachineHeader'
import { MachineSkeleton } from '../components/LoadingState'
import { useI18n } from '../i18n/useI18n'
import { machineService } from '../services'
import type { Machine } from '../types'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; machine: Machine }
  | { phase: 'not_found' }
  | { phase: 'error' }

export function MachinePage() {
  const { machineId = '' } = useParams()
  const { t } = useI18n()
  const [state, setState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    machineService
      .getMachineByCode(machineId)
      .then((machine) => {
        if (cancelled) return
        setState(machine ? { phase: 'ready', machine } : { phase: 'not_found' })
      })
      .catch(() => {
        if (!cancelled) setState({ phase: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [machineId, attempt])

  const retry = () => {
    setState({ phase: 'loading' })
    setAttempt((a) => a + 1)
  }

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col justify-center py-6">
        {state.phase === 'loading' && <MachineSkeleton />}

        {state.phase === 'error' && <ErrorState onRetry={retry} />}

        {state.phase === 'not_found' && (
          <ErrorState title={t('machine.notFound.title')} body={t('machine.notFound.body')}>
            <p className="max-w-xs text-sm text-muted">{t('machine.notFound.hint')}</p>
            <Link to="/" className="btn-secondary mt-1 max-w-56">
              {t('error.backHome')}
            </Link>
          </ErrorState>
        )}

        {state.phase === 'ready' && (
          <>
            <MachineHeader machine={state.machine} />

            <div className="mt-6 space-y-4">
              <ActionCard
                to={`/machine/${state.machine.machine_code}/issue`}
                tone="brand"
                title={t('machine.reportIssue')}
                hint={t('machine.reportIssueHint')}
                icon={
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                }
              />
              <ActionCard
                to={`/machine/${state.machine.machine_code}/request`}
                tone="accent"
                title={t('machine.requestProduct')}
                hint={t('machine.requestProductHint')}
                icon={
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                }
              />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
