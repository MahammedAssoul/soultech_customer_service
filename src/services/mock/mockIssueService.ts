import { mockIssues } from '../../data/mockData'
import { delay, mockId } from './mockUtils'
import type { CustomerIssue, IssueWithMachine, Machine, NewIssueInput } from '../../types'
import { getMachineById } from './mockMachineService'

const STORAGE_KEY = 'soultech_mock_issues'

/** In-memory store, seeded from localStorage (or defaults). */
let issues: CustomerIssue[] = load()

function load(): CustomerIssue[] {
  if (typeof window === 'undefined') return [...mockIssues]
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CustomerIssue[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return [...mockIssues]
}

function persist(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(issues))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

/** Generate the next sequential reference, e.g. ST-1005. */
function nextReference(): string {
  const max = issues.reduce((acc, issue) => {
    const match = /^ST-(\d+)$/.exec(issue.reference_number)
    return match ? Math.max(acc, Number(match[1])) : acc
  }, 1000)
  return `ST-${max + 1}`
}

export async function getIssues(): Promise<CustomerIssue[]> {
  await delay(300)
  return [...issues]
}

export async function getIssueByReference(
  reference: string,
): Promise<IssueWithMachine | null> {
  await delay(300)
  const issue = issues.find(
    (i) => i.reference_number.toLowerCase() === reference.toLowerCase(),
  )
  if (!issue) return null

  const machine = (await getMachineById(issue.machine_id)) as Machine | null
  return {
    ...issue,
    machines: machine ? { ...machine } : null,
  }
}

export async function createIssue(data: NewIssueInput): Promise<CustomerIssue> {
  await delay(600)

  const now = new Date().toISOString()
  const issue: CustomerIssue = {
    id: mockId('i'),
    reference_number: data.reference_number || nextReference(),
    machine_id: data.machine_id,
    issue_type: data.issue_type,
    description: data.description ?? null,
    photo_url: data.photo_url ?? null,
    customer_phone: data.customer_phone ?? null,
    status: 'new',
    created_at: now,
    resolved_at: null,
  }

  issues = [issue, ...issues]
  persist()
  return issue
}

export async function updateIssueStatus(
  id: string,
  status: CustomerIssue['status'],
): Promise<CustomerIssue | null> {
  await delay(300)
  const issue = issues.find((i) => i.id === id)
  if (!issue) return null

  issue.status = status
  issue.resolved_at = status === 'resolved' || status === 'rejected' ? new Date().toISOString() : null
  persist()
  return { ...issue }
}