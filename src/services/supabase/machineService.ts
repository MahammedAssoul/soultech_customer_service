import { getSupabase } from './supabaseClient'
import type {
  Machine,
  MachineWithStats,
  NewMachineInput,
  UpdateMachineInput,
} from '../../types'

export async function getMachines(): Promise<Machine[]> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('is_active', true)
    .order('machine_code', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getMachineByCode(machineCode: string): Promise<Machine | null> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('machine_code', machineCode)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const { data, error } = await getSupabase()
    .from('machines')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Admin: all machines (active + inactive) with visitor counts
// ---------------------------------------------------------------------------

export async function getAllMachines(): Promise<MachineWithStats[]> {
  const supabase = getSupabase()

  // Machines: all, both active and inactive.
  const machinesResult = await supabase
    .from('machines')
    .select('*')
    .order('machine_code', { ascending: true })
  if (machinesResult.error) throw machinesResult.error

  // Visitor counts aggregated per machine.
  const visitsResult = await supabase
    .from('machine_visits')
    .select('machine_id', { count: 'exact', head: false })
    .order('machine_id', { ascending: true })
  if (visitsResult.error) throw visitsResult.error

  const counts = new Map<string, number>()
  for (const row of visitsResult.data ?? []) {
    counts.set(row.machine_id, (counts.get(row.machine_id) ?? 0) + 1)
  }

  return (machinesResult.data ?? []).map((m) => ({
    ...m,
    visitor_count: counts.get(m.id) ?? 0,
  }))
}

export async function createMachine(input: NewMachineInput): Promise<Machine> {
  const { data, error } = await getSupabase()
    .from('machines')
    .insert({
      machine_code: input.machine_code.trim(),
      name: input.name.trim(),
      name_ar:
        input.name_ar != null && input.name_ar.trim() !== '' ? input.name_ar.trim() : null,
      location: input.location != null ? input.location.trim() || null : null,
      is_active: input.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMachine(
  id: string,
  input: UpdateMachineInput,
): Promise<Machine | null> {
  const update: Record<string, unknown> = {}
  if (input.machine_code !== undefined) update.machine_code = input.machine_code.trim()
  if (input.name !== undefined) update.name = input.name.trim()
  if (input.name_ar !== undefined) {
    update.name_ar =
      input.name_ar != null && input.name_ar.trim() !== '' ? input.name_ar.trim() : null
  }
  if (input.location !== undefined) {
    update.location =
      input.location != null && input.location.trim() !== ''
        ? input.location.trim()
        : null
  }
  if (input.is_active !== undefined) update.is_active = input.is_active

  const { data, error } = await getSupabase()
    .from('machines')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMachine(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('machines').delete().eq('id', id)
  if (error) throw error
  return true
}

// ---------------------------------------------------------------------------
// Visitor tracking
// ---------------------------------------------------------------------------

/** Key that identifies a unique visitor in the browser (localStorage). */
const VISITOR_KEY = 'soultech_visitor_id'

function getVisitorId(): string {
  if (typeof window === 'undefined') return 'visitor_ssr'
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const id = `visitor_${Math.random().toString(16).slice(2, 10)}`
    window.localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return `visitor_${Math.random().toString(16).slice(2, 10)}`
  }
}

/**
 * Record a visit to a machine page. Uses a per-machine visitor id stored in
 * localStorage so the same browser counts once per machine, even across
 * refreshes. Returns true when a new visit was recorded.
 */
export async function recordMachineVisit(machineId: string): Promise<boolean> {
  const supabase = getSupabase()
  const visitorId = getVisitorId()

  // Store the visitor id locally so we can dedupe on the client too.
  const dedupeKey = 'soultech_visited_machines'
  const dedupe = new Set<string>(
    JSON.parse(window.localStorage.getItem(dedupeKey) ?? '[]') as string[],
  )
  if (dedupe.has(machineId)) return false

  try {
    await supabase.from('machine_visits').insert({ machine_id: machineId, visitor_id: visitorId })
  } catch {
    return false
  }

  dedupe.add(machineId)
  window.localStorage.setItem(dedupeKey, JSON.stringify([...dedupe]))
  return true
}