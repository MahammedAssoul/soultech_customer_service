import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { getDb } from '../../firebase/firebaseFirestore'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'
import { mapRequest, mapRequestedProduct } from './mappers'
import type {
  Machine,
  NewProductRequestInput,
  NewRequestedProductInput,
  ProductRequest,
  ProductRequestWithMachine,
  RequestedProduct,
  UpdateRequestedProductInput,
} from '../../types'
import { getMachineById } from './machineService'

const REQUESTS_COLLECTION = 'productRequests'
const REQUESTED_COLLECTION = 'requestedProducts'
const VOTES_COLLECTION = 'productRequestVotes'

// ---------------------------------------------------------------------------
// Product requests (legacy tracking records)
// ---------------------------------------------------------------------------

export async function getProductRequests(): Promise<ProductRequest[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDocs(collection(db, REQUESTS_COLLECTION))
  return snap.docs
    .map(mapRequest)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getProductRequestByReference(
  reference: string,
): Promise<ProductRequestWithMachine | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const q = query(collection(db, REQUESTS_COLLECTION), where('referenceNumber', '==', reference))
  const snap = await getDocs(q)
  const first = snap.docs[0]
  if (!first) return null

  const request = mapRequest(first)
  const machine = (await getMachineById(request.machine_id)) as Machine | null
  return { ...request, machines: machine ? { ...machine } : null }
}

export async function createProductRequest(
  input: NewProductRequestInput,
): Promise<ProductRequest> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = await addDoc(collection(db, REQUESTS_COLLECTION), {
    referenceNumber: input.reference_number,
    machineId: input.machine_id,
    productId: input.product_id ?? null,
    productName: input.product_name,
    description: input.description ?? null,
    customerPhone: input.customer_phone ?? null,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resolvedAt: null,
  })
  const docSnap = await getDoc(ref)
  return mapRequest(docSnap)
}

export async function updateProductRequestStatus(
  id: string,
  status: ProductRequest['status'],
): Promise<ProductRequest | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = doc(db, REQUESTS_COLLECTION, id)
  await updateDoc(ref, {
    status,
    resolvedAt:
      status === 'resolved' || status === 'rejected'
        ? new Date().toISOString()
        : null,
    updatedAt: serverTimestamp(),
  })
  const docSnap = await getDoc(ref)
  return docSnap.exists() ? mapRequest(docSnap) : null
}

// ---------------------------------------------------------------------------
// Requested products (voting list)
// ---------------------------------------------------------------------------

export async function getRequestedProducts(machineId: string): Promise<RequestedProduct[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const q = query(collection(db, REQUESTED_COLLECTION), where('machineId', '==', machineId))
  const snap = await getDocs(q)
  return snap.docs
    .map(mapRequestedProduct)
    .sort((a, b) => b.vote_count - a.vote_count)
}

/** All requested products across every machine (admin view). */
export async function getAllRequestedProducts(): Promise<RequestedProduct[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDocs(collection(db, REQUESTED_COLLECTION))
  return snap.docs
    .map(mapRequestedProduct)
    .sort((a, b) => b.vote_count - a.vote_count)
}

export async function getRequestedProductById(
  id: string,
): Promise<RequestedProduct | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDoc(doc(db, REQUESTED_COLLECTION, id))
  if (!snap.exists()) return null
  return mapRequestedProduct(snap)
}

/**
 * Check whether a product has already been requested for a machine.
 * Matches by productId when available, otherwise by normalized name.
 */
export async function findRequestedProduct(
  machineId: string,
  productName: string,
  productId?: string | null,
): Promise<RequestedProduct | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const normalized = productName.trim().toLowerCase()

  // Prefer matching by productId when provided.
  if (productId) {
    const q = query(
      collection(db, REQUESTED_COLLECTION),
      where('machineId', '==', machineId),
      where('productId', '==', productId),
    )
    const snap = await getDocs(q)
    const first = snap.docs[0]
    if (first) return mapRequestedProduct(first)
  }

  // Fall back to a case-insensitive name match (client-side filter).
  const q = query(
    collection(db, REQUESTED_COLLECTION),
    where('machineId', '==', machineId),
  )
  const snap = await getDocs(q)
  const match = snap.docs.find(
    (d) => String(d.data().productName ?? '').trim().toLowerCase() === normalized,
  )
  return match ? mapRequestedProduct(match) : null
}

export async function createRequestedProduct(
  input: NewRequestedProductInput,
): Promise<RequestedProduct> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = await addDoc(collection(db, REQUESTED_COLLECTION), {
    machineId: input.machine_id,
    productId: input.product_id ?? null,
    productName: input.product_name,
    category: input.category ?? null,
    photoUrl: input.photo_url ?? null,
    adminNote: input.admin_note ?? null,
    voteCount: 0,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const docSnap = await getDoc(ref)
  return mapRequestedProduct(docSnap)
}

/** Admin-only update of a requested product (status/note/photo). */
export async function updateRequestedProduct(
  id: string,
  input: UpdateRequestedProductInput,
): Promise<RequestedProduct | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const ref = doc(db, REQUESTED_COLLECTION, id)

  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() }
  if (input.status !== undefined) payload.status = input.status
  if (input.admin_note !== undefined) {
    const note = input.admin_note?.trim()
    payload.adminNote = note ? note : null
  }
  if (input.photo_url !== undefined) {
    const url = input.photo_url?.trim()
    payload.photoUrl = url ? url : null
  }

  await updateDoc(ref, payload)
  const docSnap = await getDoc(ref)
  return docSnap.exists() ? mapRequestedProduct(docSnap) : null
}

// ---------------------------------------------------------------------------
// Voting
// ---------------------------------------------------------------------------

/**
 * The voter id is the Firebase anonymous UID. Kept behind this function so the
 * UI stays identical to the mock implementation (which used a localStorage id).
 */
export async function getVoterId(): Promise<string> {
  return ensureAnonymousAuth()
}

/** True when the anonymous user already voted for this product. */
export async function hasVoted(
  productRequestId: string,
  voterId: string,
): Promise<boolean> {
  const db = getDb()
  const q = query(
    collection(db, VOTES_COLLECTION),
    where('productRequestId', '==', productRequestId),
    where('voterId', '==', voterId),
  )
  const snap = await getDocs(q)
  return snap.size > 0
}

export async function getVoteCount(productRequestId: string): Promise<number> {
  const db = getDb()
  const q = query(
    collection(db, VOTES_COLLECTION),
    where('productRequestId', '==', productRequestId),
  )
  const snap = await getDocs(q)
  return snap.size
}

/**
 * Vote for a product in a transaction: insert the vote document and
 * increment the denormalized voteCount atomically. The composite unique
 * constraint (productRequestId + voterId) is enforced by the vote document
 * id being `productRequestId_voterId`, so duplicate votes are impossible.
 */
export async function voteForProduct(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  const db = getDb()
  const productRef = doc(db, REQUESTED_COLLECTION, productRequestId)
  const voteId = `${productRequestId}_${voterId}`
  const voteRef = doc(db, VOTES_COLLECTION, voteId)

  const result = await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef)
    if (!productSnap.exists()) return null

    // User already voted — return current state unchanged.
    const voteSnap = await transaction.get(voteRef)
    if (voteSnap.exists()) {
      return mapRequestedProduct(productSnap)
    }

    transaction.set(voteRef, {
      productRequestId,
      voterId,
      createdAt: serverTimestamp(),
    })
    transaction.update(productRef, {
      voteCount: (Number(productSnap.data().voteCount ?? 0) + 1),
      updatedAt: serverTimestamp(),
    })
    return mapRequestedProduct(productSnap)
  })

  if (!result) return null
  // Return the latest product state after increment.
  const latest = await getRequestedProductById(productRequestId)
  return latest ?? result
}

/** Remove the user's vote and decrement voteCount atomically. */
export async function removeVote(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  const db = getDb()
  const productRef = doc(db, REQUESTED_COLLECTION, productRequestId)
  const voteId = `${productRequestId}_${voterId}`
  const voteRef = doc(db, VOTES_COLLECTION, voteId)

  await runTransaction(db, async (transaction) => {
    const productSnap = await transaction.get(productRef)
    if (!productSnap.exists()) return

    const voteSnap = await transaction.get(voteRef)
    if (!voteSnap.exists()) return

    transaction.delete(voteRef)
    transaction.update(productRef, {
      voteCount: Math.max(0, Number(productSnap.data().voteCount ?? 0) - 1),
      updatedAt: serverTimestamp(),
    })
  })

  return getRequestedProductById(productRequestId)
}