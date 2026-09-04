import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { FileUploader } from '../components/FileUploader'
import { IssueTypeCard } from '../components/IssueTypeCard'
import { LoadingState } from '../components/LoadingState'
import { PhoneInput } from '../components/PhoneInput'
import { SubmitButton } from '../components/SubmitButton'
import { SuccessScreen } from '../components/SuccessScreen'
import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'
import { issueService, machineService } from '../services'
import { generateReference } from '../lib/reference'
import { ISSUE_TYPES, type IssueTypeValue, type Machine } from '../types'
import { FormLayout } from './FormLayout'

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

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready'; machine: Machine }
  | { phase: 'not_found' }
  | { phase: 'error' }

export function IssuePage() {
  const { machineId = '' } = useParams()
  const { t } = useI18n()

  const [loadState, setLoadState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)

  const [issueType, setIssueType] = useState<IssueTypeValue | null>(null)
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [phoneInvalid, setPhoneInvalid] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [typeError, setTypeError] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

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

    if (!issueType) {
      setTypeError(true)
      return
    }

    const trimmedPhone = phone.trim()
    if (trimmedPhone && !/^[+\d][\d\s-]{5,}$/.test(trimmedPhone)) {
      setPhoneInvalid(true)
      return
    }

    setSubmitting(true)
    setSubmitError(false)

    try {
      const created = await issueService.createIssue({
        machine_id: loadState.machine.id,
        issue_type: issueType,
        description: description.trim() || undefined,
        photo_url: photoUrl,
        customer_phone: trimmedPhone || null,
        reference_number: generateReference('ST'),
      })
      setReference(created.reference_number)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (reference) {
    return (
      <div className="mx-auto w-full max-w-md px-5 py-8">
        <SuccessScreen reference={reference} kind="issue" />
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md">
      {loadState.phase === 'loading' && (
        <div className="px-5 py-8">
          <LoadingState label={t('common.loading')} />
        </div>
      )}

      {loadState.phase === 'error' && (
        <div className="px-5 py-8">
          <ErrorState onRetry={retry} />
        </div>
      )}

      {loadState.phase === 'not_found' && (
        <div className="px-5 py-8">
          <ErrorState
            title={t('machine.notFound.title')}
            body={t('machine.notFound.body')}
          />
        </div>
      )}

      {loadState.phase === 'ready' && (
        <FormLayout
          machine={loadState.machine}
          title={t('issue.title')}
          subtitle={t('issue.subtitle')}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-bold text-ink">
                {t('issue.typeLabel')}
                <span className="ms-1 text-xs font-normal text-danger">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                {ISSUE_TYPES.map((type) => (
                  <IssueTypeCard
                    key={type}
                    value={type}
                    labelKey={ISSUE_TYPE_LABELS[type]}
                    selected={issueType === type}
                    onSelect={(value) => {
                      setIssueType(value)
                      setTypeError(false)
                    }}
                  />
                ))}
              </div>
              {typeError && (
                <p role="alert" className="mt-2 text-sm font-medium text-danger">
                  {t('issue.required')}
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="issue-description" className="mb-1.5 block text-sm font-bold text-ink">
                {t('issue.descriptionLabel')}
                <span className="ms-1.5 text-xs font-normal text-muted">({t('common.optional')})</span>
              </label>
              <textarea
                id="issue-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('issue.descriptionPlaceholder')}
                className="input min-h-28 resize-none"
              />
            </div>

            <FileUploader onUploaded={setPhotoUrl} />

            <PhoneInput
              value={phone}
              onChange={(value) => {
                setPhone(value)
                if (phoneInvalid) setPhoneInvalid(false)
              }}
              label={t('issue.phoneLabel')}
              placeholder={t('issue.phonePlaceholder')}
              invalid={phoneInvalid}
            />

            {submitError && (
              <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {t('common.submitFailed')}
              </p>
            )}

            <SubmitButton loading={submitting} disabled={submitting}>
              {t('issue.submit')}
            </SubmitButton>
          </form>
        </FormLayout>
      )}
    </div>
  )
}