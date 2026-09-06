import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  type Timestamp,
} from 'firebase/firestore'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'
import { getDb } from '../../firebase/firebaseFirestore'

const ADMINS_COLLECTION = 'admins'

export interface AdminRecord {
  uid: string
  created_at: string
}

function toIso(value: unknown): string {
  if (value && typeof value === 'object' && 'seconds' in value) {
    return new Date((value as Timestamp).seconds * 1000).toISOString()
  }
  return new Date(0).toISOString()
}

/**
 * The current user's UID (their admin identity in Firebase mode).
 * In mock mode this returns a stable local id.
 */
export async function getAdminUid(): Promise<string> {
  return ensureAnonymousAuth()
}

/**
 * List everyone registered as an admin. Reading the admins collection is
 * admin-only in the rules, so this only succeeds for existing admins.
 */
export async function listAdmins(): Promise<AdminRecord[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDocs(collection(db, ADMINS_COLLECTION))
  return snap.docs.map((d) => ({
    uid: d.id,
    created_at: toIso(d.data().createdAt),
  }))
}

/**
 * Grant admin to another UID. Only existing admins can do this (rules).
 * The document id is the UID; the uid field stores the same value for
 * discoverability.
 */
export async function addAdmin(uid: string): Promise<void> {
  await ensureAnonymousAuth()
  const db = getDb()
  const trimmed = uid.trim()
  if (!trimmed) return
  await setDoc(doc(db, ADMINS_COLLECTION, trimmed), {
    uid: trimmed,
    createdAt: new Date(),
  })
}

/**
 * Revoke admin from another UID. Only existing admins can do this (rules).
 */
export async function removeAdmin(uid: string): Promise<void> {
  await ensureAnonymousAuth()
  const db = getDb()
  await deleteDoc(doc(db, ADMINS_COLLECTION, uid))
}