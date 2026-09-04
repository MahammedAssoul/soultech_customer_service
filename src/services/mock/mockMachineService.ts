import { mockMachines } from '../../data/mockData'
import { delay, mockId } from './mockUtils'
import type {
  Machine,
  MachineVisit,
  MachineWithStats,
  NewMachineInput,
  UpdateMachineInput,
} from '../../types'

const STORAGE_KEY = 'soultech_mock_machines'
const VISITS_KEY = 'soultech_machine_visits'

let machines: Machine[] = loadMachines()

function loadMachines(): Machine[] {
  if (typeof window === 'undefined') return [...mockMachines]
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Machine[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return [...mockMachines]
}

function persistMachines(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(machines))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

/** All recorded machine visits (may be large; used for per-machine counts). */
function getVisits(): MachineVisit[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(VISITS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MachineVisit[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // corrupted storage
  }
  return []
}

function persistVisits(visits: MachineVisit[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VISITS_KEY, JSON.stringify(visits))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

export async function getMachines(): Promise<Machine[]> {
  await delay(300)
  return machines
    .filter((m) => m.is_active)
    .sort((a, b) => a.machine_code.localeCompare(b.machine_code))
    .map((m) => ({ ...m }))
}

export async function getMachineByCode(machineCode: string): Promise<Machine | null> {
  await delay(300)
  const machine = machines.find(
    (m) => m.machine_code.toLowerCase() === machineCode.toLowerCase() && m.is_active,
  )
  return machine ?? null
}

export async function getMachineById(id: string): Promise<Machine | null> {
  await delay(200)
  return machines.find((m) => m.id === id) ?? null
}

// ---------------------------------------------------------------------------
// Admin: all machines (active + inactive) with visitor counts
// ---------------------------------------------------------------------------

export async function getAllMachines(): Promise<MachineWithStats[]> {
  await delay(300)
  const visits = getVisits()
  const counts = new Map<string, number>()
  for (const visit of visits) {
    counts.set(visit.machine_id, (counts.get(visit.machine_id) ?? 0) + 1)
  }

  return machines
    .sort((a, b) => a.machine_code.localeCompare(b.machine_code))
    .map((m) => ({
      ...m,
      visitor_count: counts.get(m.id) ?? 0,
    }))
}

export async function createMachine(input: NewMachineInput): Promise<Machine> {
  await delay(400)
  const now = new Date().toISOString()
  const machine: Machine = {
    id: mockId('m'),
    machine_code: input.machine_code.trim(),
    name: input.name.trim(),
    name_ar: input.name_ar != null && input.name_ar.trim() !== '' ? input.name_ar.trim() : null,
    location: input.location != null ? input.location.trim() || null : null,
    is_active: input.is_active ?? true,
    created_at: now,
  }
  machines = [...machines, machine]
  persistMachines()
  return { ...machine }
}

export async function updateMachine(
  id: string,
  input: UpdateMachineInput,
): Promise<Machine | null> {
  await delay(300)
  const machine = machines.find((m) => m.id === id)
  if (!machine) return null

  if (input.machine_code !== undefined) machine.machine_code = input.machine_code.trim()
  if (input.name !== undefined) machine.name = input.name.trim()
  if (input.name_ar !== undefined) {
    machine.name_ar =
      input.name_ar != null && input.name_ar.trim() !== '' ? input.name_ar.trim() : null
  }
  if (input.location !== undefined) {
    machine.location =
      input.location != null && input.location.trim() !== ''
        ? input.location.trim()
        : null
  }
  if (input.is_active !== undefined) machine.is_active = input.is_active
  persistMachines()
  return { ...machine }
}

export async function deleteMachine(id: string): Promise<boolean> {
  await delay(300)
  const before = machines.length
  machines = machines.filter((m) => m.id !== id)
  const deleted = machines.length < before
  if (deleted) persistMachines()
  return deleted
}

// ---------------------------------------------------------------------------
// Visitor tracking
// ---------------------------------------------------------------------------

const SESSION_KEY = 'soultech_visited_machines'

/**
 * Record a visit to a machine page. A machine counts once per browser session
 * (localStorage) so refreshing the page or re-entering does not inflate the
 * counter. Returns true when a new visit was recorded.
 */
export async function recordMachineVisit(machineId: string): Promise<boolean> {
  await delay(100)
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    const visited = new Set<string>(raw ? (JSON.parse(raw) as string[]) : [])
    if (visited.has(machineId)) return false

    visited.add(machineId)
    window.localStorage.setItem(SESSION_KEY, JSON.stringify([...visited]))

    const visits = getVisits()
    visits.push({ machine_id: machineId, visited_at: new Date().toISOString() })
    persistVisits(visits)
    return true
  } catch {
    return false
  }
}