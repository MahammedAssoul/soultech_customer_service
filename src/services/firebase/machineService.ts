import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getDb } from '../../firebase/firebaseFirestore'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'
import { mapMachine } from './mappers'
import type { Machine, MachineVisit, MachineWithStats, NewMachineInput, UpdateMachineInput } from '../../types'

const COLLECTION = 'machines'
const VISITS_COLLECTION = 'machineVisits'

function serializeMachine(input: NewMachineInput | UpdateMachineInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if ('machine_code' in input) payload.machineCode = input.machine_code
  if ('name' in input) payload.name = input.name
  if ('name_ar' in input) {
    payload.nameAr =
      input.name_ar != null && input.name_ar.trim() !== '' ? input.name_ar.trim() : null
  }
  if ('location' in input) {
    payload.location =
      input.location != null && input.location.trim() !== ''
        ? input.location.trim()
        : null
  }
  if ('is_active' in input) payload.isActive = input.is_active
  payload.updatedAt = serverTimestamp()
  return payload
}

export async function getMachines(): Promise<Machine[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  // Single-field query only (auto-indexed) — filters + sorts in memory to
  // avoid requiring a composite index in Firestore.
  const q = query(collection(db, COLLECTION), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs
    .map(mapMachine)
    .sort((a, b) => a.machine_code.localeCompare(b.machine_code))
}

export async function getMachineByCode(machineCode: string): Promise<Machine | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const q = query(collection(db, COLLECTION), where('machineCode', '==', machineCode))
  const snap = await getDocs(q)
  const doc = snap.docs.find((d) => mapMachine(d).is_active) ?? null
  return doc ? mapMachine(doc) : null
}

export async function getMachineById(id: string): Promise<Machine | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return mapMachine(snap)
}

/** All machines (active + inactive) with visitor counts — admin view. */
export async function getAllMachines(): Promise<MachineWithStats[]> {
  await ensureAnonymousAuth()
  const db = getDb()

  const machinesSnap = await getDocs(query(collection(db, COLLECTION)))
  const visitsSnap = await getDocs(collection(db, VISITS_COLLECTION))

  const counts = new Map<string, number>()
  for (const v of visitsSnap.docs) {
    const data = v.data()
    const mid = String(data.machineId ?? '')
    counts.set(mid, (counts.get(mid) ?? 0) + 1)
  }

  return machinesSnap.docs
    .map((d) => {
      const machine = mapMachine(d)
      return { ...machine, visitor_count: counts.get(machine.id) ?? 0 }
    })
    .sort((a, b) => a.machine_code.localeCompare(b.machine_code))
}

export async function createMachine(input: NewMachineInput): Promise<Machine> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = await addDoc(collection(db, COLLECTION), {
    ...serializeMachine(input),
    createdAt: serverTimestamp(),
  })
  const docSnap = await getDoc(ref)
  return mapMachine(docSnap)
}

export async function updateMachine(
  id: string,
  input: UpdateMachineInput,
): Promise<Machine | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, serializeMachine(input))
  const docSnap = await getDoc(ref)
  return docSnap.exists() ? mapMachine(docSnap) : null
}

export async function deleteMachine(id: string): Promise<boolean> {
  await ensureAnonymousAuth()
  const db = getDb()
  await deleteDoc(doc(db, COLLECTION, id))
  return true
}

/** Record a machine visit, one per browser session per machine (deduped client-side). */
export async function recordMachineVisit(machineId: string): Promise<boolean> {
  await ensureAnonymousAuth()
  const db = getDb()

  // If this machine was already recorded for this browser session, skip.
  const dedupeKey = 'soultech_visited_machines'
  const visited = new Set<string>(JSON.parse(window.localStorage.getItem(dedupeKey) ?? '[]') as string[])
  if (visited.has(machineId)) return false

  const visit: MachineVisit = { machine_id: machineId, visited_at: new Date().toISOString() }
  await addDoc(collection(db, VISITS_COLLECTION), {
    machineId,
    createdAt: Timestamp.fromDate(new Date(visit.visited_at)),
  })

  visited.add(machineId)
  window.localStorage.setItem(dedupeKey, JSON.stringify([...visited]))
  return true
}