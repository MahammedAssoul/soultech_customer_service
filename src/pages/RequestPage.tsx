import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { PageLayout } from '../components/PageLayout'
import { RequestedProductsSkeleton } from '../components/LoadingState'
import { RequestedProductCard } from '../components/RequestedProductCard'
import { useI18n } from '../i18n/useI18n'
import { machineService, requestService } from '../services'
import type { Machine, RequestedProduct } from '../types'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; machine: Machine; products: RequestedProduct[]; votedIds: Set<string> }
  | { phase: 'not_found' }
  | { phase: 'error' }

export function RequestPage() {
  const { machineId = '' } = useParams()
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [voteError, setVoteError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const machine = await machineService.getMachineByCode(machineId)
      if (cancelled) return
      if (!machine) {
        setLoadState({ phase: 'not_found' })
        return
      }

      const [products, voterId] = await Promise.all([
        requestService.getRequestedProducts(machine.id),
        requestService.getVoterId(),
      ])
      if (cancelled) return

      const votedResults = await Promise.all(
        products.map((p) => requestService.hasVoted(p.id, voterId)),
      )
      if (cancelled) return

      const votedIds = new Set(
        products.filter((_, i) => votedResults[i]).map((p) => p.id),
      )
      setLoadState({ phase: 'ready', machine, products, votedIds })
    }

    load().catch(() => {
      if (!cancelled) setLoadState({ phase: 'error' })
    })

    return () => {
      cancelled = true
    }
  }, [machineId, attempt])

  const retry = () => {
    setLoadState({ phase: 'loading' })
    setAttempt((a) => a + 1)
  }

  const handleToggleVote = useCallback(
    async (product: RequestedProduct) => {
      if (loadState.phase !== 'ready' || busyId) return
      setBusyId(product.id)
      setVoteError(false)

      try {
        const voterId = await requestService.getVoterId()
        const voted = loadState.votedIds.has(product.id)
        const updated = voted
          ? await requestService.removeVote(product.id, voterId)
          : await requestService.voteForProduct(product.id, voterId)

        if (updated) {
          setLoadState((prev) => {
            if (prev.phase !== 'ready') return prev
            const nextVoted = new Set(prev.votedIds)
            if (voted) nextVoted.delete(product.id)
            else nextVoted.add(product.id)
            const products = prev.products
              .map((p) => (p.id === updated.id ? updated : p))
              .sort((a, b) => b.vote_count - a.vote_count)
            return { ...prev, products, votedIds: nextVoted }
          })
        }
      } catch {
        setVoteError(true)
      } finally {
        setBusyId(null)
      }
    },
    [loadState, busyId],
  )

  return (
    <PageLayout>
      <div className="flex flex-1 flex-col py-4">
        {loadState.phase === 'loading' && <RequestedProductsSkeleton />}

        {loadState.phase === 'error' && <ErrorState onRetry={retry} />}

        {loadState.phase === 'not_found' && (
          <ErrorState title={t('machine.notFound.title')} body={t('machine.notFound.body')} />
        )}

        {loadState.phase === 'ready' && (
          <>
            <Link
              to={`/machine/${loadState.machine.machine_code}`}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand-700"
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

            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-line/70 bg-surface px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25">
                <svg
                  className="h-5 w-5"
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
                  {loadState.machine.name || loadState.machine.machine_code}
                </p>
                <p className="truncate text-xs font-medium text-muted">
                  {loadState.machine.machine_code}
                  {loadState.machine.location ? ` · ${loadState.machine.location}` : ''}
                </p>
              </div>
              <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                CONNECTED
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              {t('requested.title')}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted">{t('requested.subtitle')}</p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-50 to-brand-100/50 p-4 text-sm text-brand-900">
              <p className="font-extrabold">{t('requested.helpTitle')}</p>
              <p className="mt-0.5 leading-relaxed">{t('requested.helpBody')}</p>
            </div>

            {voteError && (
              <p role="alert" className="mt-3 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {t('requested.voteError')}
              </p>
            )}

            {loadState.products.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-brand-200 bg-surface/70 p-10 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 text-4xl shadow-inner" aria-hidden="true">
                  📦
                </span>
                <h2 className="text-lg font-extrabold tracking-tight text-ink">{t('requested.empty.title')}</h2>
                <p className="text-sm text-muted">{t('requested.empty.body')}</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {loadState.products.map((product) => (
                  <RequestedProductCard
                    key={product.id}
                    product={product}
                    voted={loadState.votedIds.has(product.id)}
                    busy={busyId === product.id}
                    onToggleVote={handleToggleVote}
                  />
                ))}
              </div>
            )}

            <Link
              to={`/machine/${loadState.machine.machine_code}/request/new`}
              className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 text-base font-bold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:shadow-brand-700/30 active:scale-[0.98]"
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                +
              </span>
              {t('requested.newRequest')}
            </Link>
          </>
        )}
      </div>
    </PageLayout>
  )
}
