import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { getDb } from '../../firebase/firebaseFirestore'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'
import { mapIssue } from './mappers'
import type { CustomerIssue, IssueWithMachine, Machine, NewIssueInput } from '../../types'
import { getMachineById } from './machineService'

const COLLECTION = 'issues'

export async function getIssues(): Promise<CustomerIssue[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs
    .map(mapIssue)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getIssueByReference(
  reference: string,
): Promise<IssueWithMachine | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const q = query(collection(db, COLLECTION), where('referenceNumber', '==', reference))
  const snap = await getDocs(q)
  const first = snap.docs[0]
  if (!first) return null

  const issue = mapIssue(first)
  const machine = (await getMachineById(issue.machine_id)) as Machine | null
  return { ...issue, machines: machine ? { ...machine } : null }
}

export async function createIssue(input: NewIssueInput): Promise<CustomerIssue> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = await addDoc(collection(db, COLLECTION), {
    referenceNumber: input.reference_number,
    machineId: input.machine_id,
    issueType: input.issue_type,
    description: input.description ?? null,
    photoUrl: input.photo_url ?? null,
    customerPhone: input.customer_phone ?? null,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resolvedAt: null,
  })
  const docSnap = await getDoc(ref)
  return mapIssue(docSnap)
}

export async function updateIssueStatus(
  id: string,
  status: CustomerIssue['status'],
): Promise<CustomerIssue | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  const resolvedAt =
    status === 'resolved' || status === 'rejected'
      ? new Date().toISOString()
      : null
  await updateDoc(ref, {
    status,
    resolvedAt,
    updatedAt: serverTimestamp(),
  })
  const docSnap = await getDoc(ref)
  return docSnap.exists() ? mapIssue(docSnap) : null
}