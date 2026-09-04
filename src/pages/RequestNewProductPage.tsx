import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PageLayout } from '../components/PageLayout'
import { SubmitButton } from '../components/SubmitButton'
import { useI18n } from '../i18n/useI18n'
import { machineService, requestService } from '../services'
import type { Machine, RequestedProduct } from '../types'

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; machine: Machine }
  | { phase: 'not_found' }
  | { phase: 'error' }

export function RequestNewProductPage() {
  const { machineId = '' } = useParams()
  const { t } = useI18n()
  const navigate = useNavigate()

  const [loadState, setLoadState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [duplicate, setDuplicate] = useState<RequestedProduct | null>(null)

  useEffect(() => {
    let cancelled = false

    machineService
      .getMachineByCode(machineId)
      .then((machine) => {
        if (cancelled) return
        setLoadState(machine ? { phase: 'ready', machine } : { phase: 'not_found' })
      })
      .catch(() => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loadState.phase !== 'ready' || submitting) return

    const name = productName.trim()
    if (!name) {
      setNameError(true)
      return
    }

    setSubmitting(true)
    setSubmitError(false)
    setDuplicate(null)

    try {
      // Prevent duplicate requests for the same machine.
      const existing = await requestService.findRequestedProduct(
        loadState.machine.id,
        name,
        null,
      )
      if (existing) {
        setDuplicate(existing)
        setSubmitting(false)
        return
      }

      await requestService.createRequestedProduct({
        machine_id: loadState.machine.id,
        product_id: null,
        product_name: name,
        category: category.trim() || null,
        photo_url: null,
        admin_note: null,
      })

      // Return to the requested-products list so the new item shows immediately.
      navigate(`/machine/${loadState.machine.machine_code}/request`, { replace: true })
    } catch {
      setSubmitError(true)
      setSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-md px-5 py-8">
      {loadState.phase === 'loading' && <LoadingState label={t('common.loading')} />}

      {loadState.phase === 'error' && <ErrorState onRetry={retry} />}

      {loadState.phase === 'not_found' && (
        <ErrorState title={t('machine.notFound.title')} body={t('machine.notFound.body')} />
      )}

      {loadState.phase === 'ready' && (
        <>
          <Link
            to={`/machine/${loadState.machine.machine_code}/request`}
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

          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {t('requested.new.title')}
          </h1>
          <p className="mt-1.5 text-sm text-muted">{t('requested.new.subtitle')}</p>

          {duplicate && (
            <div className="mt-5 overflow-hidden rounded-2xl border-2 border-warning/40 bg-warning/10">
              <div className="bg-warning/15 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-extrabold text-warning">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {t('requested.new.duplicate.title')}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-ink">
                  {duplicate.product_name} — {t('requested.new.duplicate.body')}
                </p>
                <p className="mt-1 text-sm text-muted">{t('requested.new.duplicate.vote')}</p>
                <Link
                  to={`/machine/${loadState.machine.machine_code}/request`}
                  className="btn-primary mt-3 w-full min-h-11"
                >
                  {t('requested.new.duplicate.view')}
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div>
              <label htmlFor="new-product-name" className="mb-1.5 block text-sm font-bold text-ink">
                {t('requested.new.productName')}
                <span className="ms-1 text-xs font-normal text-danger">*</span>
              </label>
              <input
                id="new-product-name"
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value)
                  if (nameError) setNameError(false)
                  if (duplicate) setDuplicate(null)
                }}
                placeholder={t('requested.new.productNamePlaceholder')}
                aria-invalid={nameError || undefined}
                className={`input ${nameError ? 'border-danger focus:ring-danger/30' : ''}`}
              />
              {nameError && (
                <p role="alert" className="mt-1.5 text-sm font-medium text-danger">
                  {t('requested.new.required')}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-product-category" className="mb-1.5 block text-sm font-bold text-ink">
                {t('requested.new.category')}
                <span className="ms-1.5 text-xs font-normal text-muted">({t('common.optional')})</span>
              </label>
              <input
                id="new-product-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t('requested.new.categoryPlaceholder')}
                className="input"
              />
            </div>

            {submitError && (
              <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {t('common.submitFailed')}
              </p>
            )}

            <SubmitButton loading={submitting} disabled={submitting}>
              {t('requested.new.submit')}
            </SubmitButton>
          </form>
        </>
      )}
      </div>
    </PageLayout>
  )
}