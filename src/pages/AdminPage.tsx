import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { PageLayout } from '../components/PageLayout'
import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'
import { adminService, issueService, machineService, requestService } from '../services'
import { photoService } from '../services/photoService'
import type {
  CustomerIssue,
  IssueTypeValue,
  Machine,
  MachineWithStats,
  ProductRequest,
  RequestedProduct,
  RequestedProductStatus,
} from '../types'

type Tab = 'issues' | 'requests' | 'requested' | 'machines' | 'admins'

type LoadState =
  | { phase: 'loading' }
  | {
      phase: 'ready'
      issues: CustomerIssue[]
      requests: ProductRequest[]
      requested: RequestedProduct[]
      machines: MachineWithStats[]
    }
  | { phase: 'error'; error?: string }

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

const REQUESTED_STATUS_LABELS: Record<RequestedProductStatus, TranslationKey> = {
  new: 'requested.status.new',
  reviewing: 'requested.status.reviewing',
  approved: 'requested.status.approved',
  available: 'requested.status.available',
  rejected: 'requested.status.rejected',
}

const REQUESTED_STATUS_OPTIONS: RequestedProductStatus[] = [
  'new',
  'reviewing',
  'approved',
  'available',
  'rejected',
]

const ISSUE_STATUS_OPTIONS: CustomerIssue['status'][] = ['new', 'in_progress', 'resolved', 'rejected']
const REQUEST_STATUS_OPTIONS: ProductRequest['status'][] = ['new', 'in_progress', 'resolved', 'rejected']

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  // Hide epoch placeholder dates (missing createdAt on legacy admin docs).
  if (date.getFullYear() <= 1970) return ''
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminPage() {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('issues')
  const [state, setState] = useState<LoadState>({ phase: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [machines, setMachines] = useState<Record<string, Machine>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState(false)
  const [creatingMachine, setCreatingMachine] = useState(false)
  const [adminUid, setAdminUid] = useState<string | null>(null)
  const [uidCopied, setUidCopied] = useState(false)

  // Read the current anonymous UID (the app's admin identity in Firebase mode)
  // so admins can grant themselves access via the `admins` collection.
  useEffect(() => {
    let cancelled = false
    requestService
      .getVoterId()
      .then((uid) => {
        if (!cancelled) setAdminUid(uid)
      })
      .catch(() => {
        // ignore — mock mode has no uid concept
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const [issues, requests, requested, machines] = await Promise.all([
        issueService.getIssues(),
        requestService.getProductRequests(),
        requestService.getAllRequestedProducts(),
        machineService.getAllMachines(),
      ])
      if (cancelled) return

      const machineMap: Record<string, Machine> = {}
      for (const m of machines) machineMap[m.id] = m
      setMachines(machineMap)
      setState({ phase: 'ready', issues, requests, requested, machines })
    }

    load().catch((err: unknown) => {
      if (!cancelled) {
        const message = err instanceof Error ? err.message : String(err)
        setState({ phase: 'error', error: message })
      }
    })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => {
    setState({ phase: 'loading' })
    setAttempt((a) => a + 1)
  }

  const setMachineMap = (
    updater: (prev: Record<string, Machine>) => Record<string, Machine>,
  ) => {
    setMachines((prev) => updater(prev))
  }

  const machineLabel = (id: string): string => {
    const machine = machines[id]
    return machine ? machine.machine_code : id
  }

  const updateIssue = async (issue: CustomerIssue, status: CustomerIssue['status']) => {
    if (status === issue.status) return
    setSavingId(issue.id)
    setUpdateError(false)
    try {
      const updated = await issueService.updateIssueStatus(issue.id, status)
      if (updated && state.phase === 'ready') {
        setState({
          ...state,
          issues: state.issues.map((i) => (i.id === updated.id ? updated : i)),
        })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setSavingId(null)
    }
  }

  const updateRequest = async (request: ProductRequest, status: ProductRequest['status']) => {
    if (status === request.status) return
    setSavingId(request.id)
    setUpdateError(false)
    try {
      const updated = await requestService.updateProductRequestStatus(request.id, status)
      if (updated && state.phase === 'ready') {
        setState({
          ...state,
          requests: state.requests.map((r) => (r.id === updated.id ? updated : r)),
        })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setSavingId(null)
    }
  }

  const updateRequested = async (
    product: RequestedProduct,
    status: RequestedProductStatus,
    note: string,
    photoUrl: string | null,
  ) => {
    const nextNote = note.trim() === '' ? null : note.trim()
    if (
      status === product.status &&
      nextNote === product.admin_note &&
      photoUrl === product.photo_url
    ) {
      return
    }
    setSavingId(product.id)
    setUpdateError(false)
    try {
      const updated = await requestService.updateRequestedProduct(product.id, {
        status,
        admin_note: nextNote,
        photo_url: photoUrl,
      })
      if (updated && state.phase === 'ready') {
        setState({
          ...state,
          requested: state.requested.map((p) => (p.id === updated.id ? updated : p)),
        })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setSavingId(null)
    }
  }

  const saveMachine = async (machine: MachineWithStats, input: MachineEditorValues) => {
    const nextCode = input.machine_code.trim()
    const nextName = input.name.trim()
    const nextNameAr = input.name_ar.trim() === '' ? null : input.name_ar.trim()
    const nextLocation = input.location.trim() === '' ? null : input.location.trim()
    if (
      nextCode === machine.machine_code &&
      nextName === machine.name &&
      nextNameAr === machine.name_ar &&
      nextLocation === machine.location &&
      input.is_active === machine.is_active
    ) {
      return
    }
    setSavingId(machine.id)
    setUpdateError(false)
    try {
      const updated = await machineService.updateMachine(machine.id, {
        machine_code: nextCode,
        name: nextName,
        name_ar: nextNameAr,
        location: nextLocation,
        is_active: input.is_active,
      })
      if (updated && state.phase === 'ready') {
        const next = { ...updated, visitor_count: machine.visitor_count }
        setMachineMap((prev) => ({ ...prev, [next.id]: next }))
        setState({
          ...state,
          machines: state.machines.map((m) => (m.id === next.id ? next : m)),
        })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setSavingId(null)
    }
  }

  const addMachine = async (input: MachineEditorValues) => {
    setCreatingMachine(true)
    setUpdateError(false)
    try {
      const created = await machineService.createMachine({
        machine_code: input.machine_code,
        name: input.name,
        name_ar: input.name_ar,
        location: input.location,
        is_active: input.is_active,
      })
      if (state.phase === 'ready') {
        const withStats: MachineWithStats = { ...created, visitor_count: 0 }
        setMachineMap((prev) => ({ ...prev, [created.id]: withStats }))
        setState({ ...state, machines: [...state.machines, withStats] })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setCreatingMachine(false)
    }
  }

  const removeMachine = async (machine: MachineWithStats) => {
    setSavingId(machine.id)
    setUpdateError(false)
    try {
      await machineService.deleteMachine(machine.id)
      if (state.phase === 'ready') {
        setState({ ...state, machines: state.machines.filter((m) => m.id !== machine.id) })
      }
    } catch {
      setUpdateError(true)
    } finally {
      setSavingId(null)
    }
  }

  const statusSelect = (
    value: string,
    options: readonly string[],
    onChange: (value: string) => void,
    busy: boolean,
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={busy}
      aria-label={t('admin.status')}
      className="input !min-h-10 !px-2.5 !py-1.5 text-sm font-semibold"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )

  return (
    <PageLayout minimal>
      <div className="flex flex-1 flex-col py-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">{t('admin.title')}</h1>
            <p className="mt-0.5 text-sm text-muted">{t('admin.subtitle')}</p>
          </div>
          <Link
            to="/"
            className="btn-secondary !min-h-10 !px-3 !py-2 text-sm"
          >
            {t('admin.logout')}
          </Link>
        </div>

        {state.phase === 'loading' ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="text-sm font-medium text-muted">{t('common.loading')}</p>
          </div>
        ) : state.phase === 'error' && !adminUid ? (
          <ErrorState
            onRetry={retry}
            body={state.error ? `${t('error.title')} — ${state.error}` : undefined}
          />
        ) : (
          <>
            {/* Admin UID helper — always visible, even in error state, so a fresh
                anonymous visitor can grant themselves admin access. */}
            {adminUid && (
              <div className="mb-4 rounded-2xl border border-brand-200/70 bg-brand-50/60 p-4">
                <p className="text-sm font-extrabold text-brand-900">{t('admin.uidTitle')}</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-800">{t('admin.uidBody')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-900 ring-1 ring-line">
                    {adminUid}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(adminUid).catch(() => {})
                      setUidCopied(true)
                      window.setTimeout(() => setUidCopied(false), 2000)
                    }}
                    className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
                  >
                    {uidCopied ? t('admin.uidCopied') : t('admin.uidCopy')}
                  </button>
                </div>
              </div>
            )}

            {state.phase === 'error' && adminUid && (
              <p
                role="alert"
                className="mb-3 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger"
              >
                {state.error ?? t('admin.updateFailed')}
              </p>
            )}

            {state.phase === 'ready' && (
          <>
            <div className="mb-4 flex gap-2 rounded-2xl bg-soft p-1" role="tablist">
              {(['issues', 'requests', 'requested', 'machines', 'admins'] as Tab[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    tab === key
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-muted hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {t(`admin.tab.${key}`)}
                </button>
              ))}
            </div>

            {updateError && (
              <p role="alert" className="mb-3 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {t('admin.updateFailed')}
              </p>
            )}

            {tab === 'issues' && (
              <div className="space-y-3">
                {state.issues.length === 0 && (
                  <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                    {t('admin.empty.issues')}
                  </p>
                )}
                {state.issues.map((issue) => (
                  <div key={issue.id} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">
                          #{issue.reference_number}
                          <span className="ms-1.5 text-xs font-semibold text-muted">
                            {machineLabel(issue.machine_id)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-ink">
                          {t(ISSUE_TYPE_LABELS[issue.issue_type])}
                        </p>
                        {issue.description && (
                          <p className="mt-1 text-sm leading-relaxed text-muted">
                            {issue.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted">
                          {t('admin.date')}: {formatDate(issue.created_at)}
                          {issue.customer_phone ? ` · ${t('admin.phone')}: ${issue.customer_phone}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {statusSelect(
                        issue.status,
                        ISSUE_STATUS_OPTIONS,
                        (value) => updateIssue(issue, value as CustomerIssue['status']),
                        savingId === issue.id,
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'requests' && (
              <div className="space-y-3">
                {state.requests.length === 0 && (
                  <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                    {t('admin.empty.requests')}
                  </p>
                )}
                {state.requests.map((request) => (
                  <div key={request.id} className="card p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink">
                        #{request.reference_number}
                        <span className="ms-1.5 text-xs font-semibold text-muted">
                          {machineLabel(request.machine_id)}
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-ink">{request.product_name}</p>
                      {request.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {request.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted">
                        {t('admin.date')}: {formatDate(request.created_at)}
                        {request.customer_phone ? ` · ${t('admin.phone')}: ${request.customer_phone}` : ''}
                      </p>
                    </div>
                    <div className="mt-3">
                      {statusSelect(
                        request.status,
                        REQUEST_STATUS_OPTIONS,
                        (value) => updateRequest(request, value as ProductRequest['status']),
                        savingId === request.id,
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'requested' && (
              <div className="space-y-3">
                {state.requested.length === 0 && (
                  <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                    {t('admin.empty.requested')}
                  </p>
                )}
                {state.requested.map((product) => (
                  <RequestedProductEditor
                    key={product.id}
                    product={product}
                    machineLabel={machineLabel(product.machine_id)}
                    busy={savingId === product.id}
                    onSave={(status, note, photoUrl) =>
                      updateRequested(product, status, note, photoUrl)
                    }
                  />
                ))}
              </div>
            )}

            {tab === 'machines' && (
              <div className="space-y-3">
                <div className="card p-4">
                  <p className="text-sm font-bold text-ink">{t('admin.machines.addTitle')}</p>
                  <MachineEditor
                    busy={creatingMachine}
                    submitLabel={t('admin.machines.add')}
                    onSubmit={(values) => void addMachine(values)}
                  />
                </div>

                {state.machines.length === 0 && (
                  <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">
                    {t('admin.empty.machines')}
                  </p>
                )}
                {state.machines.map((machine) => (
                  <MachineRow
                    key={machine.id}
                    machine={machine}
                    busy={savingId === machine.id}
                    onSave={(values) => void saveMachine(machine, values)}
                    onDelete={() => {
                      if (window.confirm(t('admin.machines.deleteConfirm'))) {
                        void removeMachine(machine)
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {tab === 'admins' && <AdminAccessPanel />}
          </>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}

interface MachineEditorValues {
  machine_code: string
  name: string
  name_ar: string
  location: string
  is_active: boolean
}

interface MachineEditorProps {
  initial?: Machine
  busy?: boolean
  submitLabel: string
  onSubmit: (values: MachineEditorValues) => void
}

function MachineEditor({
  initial,
  busy = false,
  submitLabel,
  onSubmit,
}: MachineEditorProps) {
  const { t } = useI18n()
  const [code, setCode] = useState(initial?.machine_code ?? '')
  const [name, setName] = useState(initial?.name ?? '')
  const [nameAr, setNameAr] = useState(initial?.name_ar ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ machine_code: code, name, name_ar: nameAr, location, is_active: isActive })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3 space-y-2.5">
      <div>
        <label className="text-xs font-semibold text-muted" htmlFor={`mc-${initial?.id ?? 'new'}-code`}>
          {t('admin.machines.code')}
        </label>
        <input
          id={`mc-${initial?.id ?? 'new'}-code`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="ST-007"
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted" htmlFor={`mc-${initial?.id ?? 'new'}-name`}>
          {t('admin.machines.name')}
        </label>
        <input
          id={`mc-${initial?.id ?? 'new'}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={t('admin.machines.namePlaceholder')}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted" htmlFor={`mc-${initial?.id ?? 'new'}-name-ar`}>
          {t('admin.machines.nameAr')}
        </label>
        <input
          id={`mc-${initial?.id ?? 'new'}-name-ar`}
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          dir="rtl"
          placeholder={t('admin.machines.nameArPlaceholder')}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted" htmlFor={`mc-${initial?.id ?? 'new'}-location`}>
          {t('admin.machines.location')}
        </label>
        <input
          id={`mc-${initial?.id ?? 'new'}-location`}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('admin.machines.locationPlaceholder')}
          className="input mt-1"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 accent-brand-600"
        />
        {t('admin.machines.visible')}
      </label>

      <button type="submit" disabled={busy} className="btn-primary !min-h-11 !px-4 !py-2 text-sm">
        {busy ? t('admin.saving') : submitLabel}
      </button>
    </form>
  )
}

interface MachineRowProps {
  machine: MachineWithStats
  busy: boolean
  onSave: (values: MachineEditorValues) => void
  onDelete: () => void
}

function MachineRow({ machine, busy, onSave, onDelete }: MachineRowProps) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">
            {machine.machine_code}
            <span className="mx-1.5 text-muted">-</span>
            <span className="text-xs font-semibold text-muted">{machine.name}</span>
          </p>
          {machine.name_ar && (
            <p className="mt-0.5 text-xs font-semibold text-muted" dir="rtl">
              {machine.name_ar}
            </p>
          )}
          {machine.location && (
            <p className="mt-0.5 text-xs text-muted">{machine.location}</p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-700">
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
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {machine.visitor_count} {t('admin.machines.visitors')}
          </p>
        </div>
        <span
          className={`badge shrink-0 ${
            machine.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}
        >
          {machine.is_active ? t('admin.machines.active') : t('admin.machines.inactive')}
        </span>
      </div>

      {editing && (
        <div className="mt-3 border-t border-line/60 pt-3">
          <MachineEditor
            initial={machine}
            busy={busy}
            submitLabel={t('admin.save')}
            onSubmit={(values) => {
              onSave(values)
              setEditing(false)
            }}
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="btn-secondary mt-2 !min-h-10 !px-3 !py-2 text-sm !text-danger"
          >
            {t('admin.machines.delete')}
          </button>
        </div>
      )}

      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-3 btn-secondary !min-h-10 !px-3 !py-2 text-sm"
        >
          {t('admin.machines.edit')}
        </button>
      )}
    </div>
  )
}

interface AdminRecord {
  uid: string
  created_at: string
}

/**
 * Admin access management: shows the current device's UID, lets admins add
 * another admin UID (e.g. their phone's anonymous UID) and revoke access.
 */
function AdminAccessPanel() {
  const { t } = useI18n()
  const [myUid, setMyUid] = useState<string | null>(null)
  const [admins, setAdmins] = useState<AdminRecord[]>([])
  const [newUid, setNewUid] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([adminService.getAdminUid(), adminService.listAdmins()])
      .then(([uid, list]) => {
        if (cancelled) return
        setMyUid(uid)
        setAdmins(list)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [adding])

  const handleAdd = async () => {
    const uid = newUid.trim()
    if (!uid || busy) return
    setBusy(true)
    setFailed(false)
    try {
      await adminService.addAdmin(uid)
      setNewUid('')
      setAdding((a) => !a)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async (uid: string) => {
    if (busy) return
    setBusy(true)
    setFailed(false)
    try {
      await adminService.removeAdmin(uid)
      setAdding((a) => !a)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <p className="text-sm font-extrabold text-ink">{t('admin.admins.title')}</p>
        <p className="mt-0.5 text-sm text-muted">{t('admin.admins.subtitle')}</p>
      </div>

      {/* This device */}
      <div className="card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t('admin.admins.current')}
        </p>
        <code className="mt-1.5 block truncate rounded-lg bg-soft px-3 py-2 text-xs font-semibold text-ink">
          {myUid ?? '…'}
        </code>
        <p className="mt-1 text-xs text-muted">
          {t('admin.admins.addLabel')}:{' '}
          <span dir="ltr" className="font-semibold text-ink">{myUid ?? '…'}</span>
        </p>
      </div>

      {/* Add admin */}
      <div className="card p-4">
        <p className="text-sm font-bold text-ink">{t('admin.admins.addLabel')}</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            dir="ltr"
            value={newUid}
            onChange={(e) => {
              setNewUid(e.target.value)
              if (failed) setFailed(false)
            }}
            placeholder={t('admin.admins.addPlaceholder')}
            className="input min-w-0 flex-1 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={busy || newUid.trim() === ''}
            className="btn-primary !min-h-10 !px-4 !py-2 text-sm"
          >
            {busy ? t('admin.admins.adding') : t('admin.admins.add')}
          </button>
        </div>
        {failed && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {t('admin.admins.failed')}
          </p>
        )}
      </div>

      {/* Admin list */}
      <div className="card p-4">
        <p className="text-sm font-bold text-ink">{t('admin.tab.admins')}</p>
        {admins.length === 0 && (
          <p className="mt-2 rounded-xl bg-soft px-4 py-3 text-sm text-muted">
            {t('admin.admins.empty')}
          </p>
        )}
        <div className="mt-2 space-y-2">
          {admins.map((admin) => {
            const isMe = admin.uid === myUid
            return (
              <div
                key={admin.uid}
                className="flex items-center justify-between gap-3 rounded-xl bg-soft px-3 py-2"
              >
                <div className="min-w-0">
                  <code className="block truncate text-xs font-semibold text-ink" dir="ltr">
                    {admin.uid}
                  </code>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(admin.created_at)}
                    {isMe ? ` · ${t('admin.admins.you')}` : ''}
                  </p>
                </div>
                {!isMe && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(t('admin.admins.removeConfirm'))) {
                        void handleRemove(admin.uid)
                      }
                    }}
                    disabled={busy}
                    className="shrink-0 text-sm font-semibold text-danger hover:underline"
                  >
                    {t('admin.admins.remove')}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface RequestedProductEditorProps {
  product: RequestedProduct
  machineLabel: string
  busy: boolean
  onSave: (status: RequestedProductStatus, note: string, photoUrl: string | null) => void
}

function RequestedProductEditor({
  product,
  machineLabel,
  busy,
  onSave,
}: RequestedProductEditorProps) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<RequestedProductStatus>(product.status)
  const [note, setNote] = useState(product.admin_note ?? '')
  const [photoUrl, setPhotoUrl] = useState<string | null>(product.photo_url)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState(false)

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setPhotoError(false)
    const result = await photoService.uploadAdminPhoto(file)
    setUploading(false)

    if (result.ok) {
      setPhotoUrl(result.url)
    } else {
      setPhotoError(true)
    }
  }

  const removePhoto = () => {
    setPhotoUrl(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">
            {product.product_name}
            <span className="ms-1.5 text-xs font-semibold text-muted">{machineLabel}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {product.category ? `${product.category} · ` : ''}
            {product.vote_count} {t('admin.votes')} · {t('admin.date')}: {formatDate(product.created_at)}
          </p>
        </div>
        <span className={`badge shrink-0 ${REQUESTED_STATUS_TONES[product.status]}`}>
          {t(REQUESTED_STATUS_LABELS[product.status])}
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {/* Photo */}
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={product.product_name}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-soft text-muted">
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <circle cx="15.5" cy="8.5" r="1.5" />
                <path d="M12 13l-2 3 4 0 0-3" />
              </svg>
            </span>
          )}

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy || uploading}
              className="btn-secondary !min-h-10 !px-3 !py-2 text-sm"
            >
              {uploading ? t('admin.photoUploading') : photoUrl ? t('admin.photoChange') : t('admin.photoAdd')}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={busy || uploading}
                className="text-sm font-semibold text-danger hover:underline"
              >
                {t('admin.photoRemove')}
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => void handlePhoto(e.target.files?.[0])}
          />
        </div>

        {photoError && (
          <p role="alert" className="text-sm text-danger">
            {t('admin.updateFailed')}
          </p>
        )}

        <label className="text-xs font-semibold text-muted" htmlFor={`note-${product.id}`}>
          {t('admin.noteLabel')}
        </label>
        <textarea
          id={`note-${product.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={t('admin.notePlaceholder')}
          className="input resize-none"
        />

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RequestedProductStatus)}
            disabled={busy}
            aria-label={t('admin.status')}
            className="input !min-h-10 !px-2.5 !py-1.5 text-sm font-semibold"
          >
            {REQUESTED_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(REQUESTED_STATUS_LABELS[option])}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onSave(status, note, photoUrl)}
            disabled={busy || uploading}
            className="btn-primary !min-h-10 !px-4 !py-2 text-sm"
          >
            {busy ? t('admin.saving') : t('admin.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

const REQUESTED_STATUS_TONES: Record<RequestedProductStatus, string> = {
  new: 'bg-brand-50 text-brand-700',
  reviewing: 'bg-warning/10 text-warning',
  approved: 'bg-brand-50 text-brand-700',
  available: 'bg-success/10 text-success',
  rejected: 'bg-danger/10 text-danger',
}