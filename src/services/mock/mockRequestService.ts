import { mockProductRequests, mockRequestedProducts } from '../../data/mockData'
import { delay, mockId } from './mockUtils'
import type {
  Machine,
  NewProductRequestInput,
  NewRequestedProductInput,
  ProductRequest,
  ProductRequestWithMachine,
  ProductVote,
  RequestedProduct,
} from '../../types'
import { getMachineById } from './mockMachineService'

const REQUESTS_KEY = 'soultech_mock_product_requests'
const REQUESTED_KEY = 'soultech_mock_requested_products'
const VOTES_KEY = 'soultech_product_votes'
const VOTER_KEY = 'soultech_voter_id'

// ---------------------------------------------------------------------------
// Product requests (legacy tracking records)
// ---------------------------------------------------------------------------

let requests: ProductRequest[] = loadRequests()

function loadRequests(): ProductRequest[] {
  if (typeof window === 'undefined') return [...mockProductRequests]
  try {
    const raw = window.localStorage.getItem(REQUESTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ProductRequest[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return [...mockProductRequests]
}

function persistRequests(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

function nextReference(): string {
  const max = requests.reduce((acc, request) => {
    const match = /^PR-(\d+)$/.exec(request.reference_number)
    return match ? Math.max(acc, Number(match[1])) : acc
  }, 1000)
  return `PR-${max + 1}`
}

// ---------------------------------------------------------------------------
// Requested products (voting list)
// ---------------------------------------------------------------------------

let requestedProducts: RequestedProduct[] = loadRequested()

function loadRequested(): RequestedProduct[] {
  if (typeof window === 'undefined') return [...mockRequestedProducts]
  try {
    const raw = window.localStorage.getItem(REQUESTED_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RequestedProduct[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return [...mockRequestedProducts]
}

function persistRequested(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(REQUESTED_KEY, JSON.stringify(requestedProducts))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

// ---------------------------------------------------------------------------
// Votes + voter id
// ---------------------------------------------------------------------------

let votes: ProductVote[] = loadVotes()

function loadVotes(): ProductVote[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(VOTES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ProductVote[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // corrupted storage
  }
  return []
}

function persistVotes(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
  } catch {
    // storage full/unavailable — keep in-memory only
  }
}

/** Get (or create) the anonymous voter id stored in localStorage. */
export function getVoterId(): string {
  if (typeof window === 'undefined') return 'voter_ssr'
  try {
    const existing = window.localStorage.getItem(VOTER_KEY)
    if (existing) return existing
    const id = `voter_${Math.random().toString(16).slice(2, 10)}`
    window.localStorage.setItem(VOTER_KEY, id)
    return id
  } catch {
    return `voter_${Math.random().toString(16).slice(2, 10)}`
  }
}

// ---------------------------------------------------------------------------
// Product requests (legacy)
// ---------------------------------------------------------------------------

export async function getProductRequests(): Promise<ProductRequest[]> {
  await delay(300)
  return [...requests]
}

export async function getProductRequestByReference(
  reference: string,
): Promise<ProductRequestWithMachine | null> {
  await delay(300)
  const request = requests.find(
    (r) => r.reference_number.toLowerCase() === reference.toLowerCase(),
  )
  if (!request) return null

  const machine = (await getMachineById(request.machine_id)) as Machine | null
  return {
    ...request,
    machines: machine
      ? {
          id: machine.id,
          machine_code: machine.machine_code,
          name: machine.name,
          location: machine.location,
          is_active: machine.is_active,
          created_at: machine.created_at,
        }
      : null,
  }
}

export async function createProductRequest(
  data: NewProductRequestInput,
): Promise<ProductRequest> {
  await delay(600)

  const now = new Date().toISOString()
  const request: ProductRequest = {
    id: mockId('r'),
    reference_number: data.reference_number || nextReference(),
    machine_id: data.machine_id,
    product_id: data.product_id ?? null,
    product_name: data.product_name,
    description: data.description ?? null,
    customer_phone: data.customer_phone ?? null,
    status: 'new',
    created_at: now,
    resolved_at: null,
  }

  requests = [request, ...requests]
  persistRequests()
  return request
}

export async function updateProductRequestStatus(
  id: string,
  status: ProductRequest['status'],
): Promise<ProductRequest | null> {
  await delay(300)
  const request = requests.find((r) => r.id === id)
  if (!request) return null

  request.status = status
  request.resolved_at =
    status === 'resolved' || status === 'rejected' ? new Date().toISOString() : null
  persistRequests()
  return { ...request }
}

// ---------------------------------------------------------------------------
// Requested products (voting list)
// ---------------------------------------------------------------------------

export async function getRequestedProducts(machineId: string): Promise<RequestedProduct[]> {
  await delay(300)
  return requestedProducts
    .filter((rp) => rp.machine_id === machineId)
    .sort((a, b) => b.vote_count - a.vote_count)
    .map((rp) => ({ ...rp }))
}

export async function getRequestedProductById(
  id: string,
): Promise<RequestedProduct | null> {
  await delay(200)
  return requestedProducts.find((rp) => rp.id === id) ?? null
}

/**
 * Check whether a product has already been requested for a machine.
 * Matches by product_id when available, otherwise by normalized name.
 */
export async function findRequestedProduct(
  machineId: string,
  productName: string,
  productId?: string | null,
): Promise<RequestedProduct | null> {
  await delay(200)
  const normalized = productName.trim().toLowerCase()
  return (
    requestedProducts.find((rp) => {
      if (rp.machine_id !== machineId) return false
      if (productId && rp.product_id === productId) return true
      return rp.product_name.trim().toLowerCase() === normalized
    }) ?? null
  )
}

export async function createRequestedProduct(
  data: NewRequestedProductInput,
): Promise<RequestedProduct> {
  await delay(600)

  const now = new Date().toISOString()
  const requested: RequestedProduct = {
    id: mockId('rp'),
    machine_id: data.machine_id,
    product_id: data.product_id ?? null,
    product_name: data.product_name,
    category: data.category ?? null,
    photo_url: data.photo_url ?? null,
    admin_note: data.admin_note ?? null,
    vote_count: 0,
    status: 'new',
    created_at: now,
  }

  requestedProducts = [requested, ...requestedProducts]
  persistRequested()
  return { ...requested }
}

// ---------------------------------------------------------------------------
// Voting
// ---------------------------------------------------------------------------

export async function voteForProduct(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  await delay(300)

  const existing = votes.find(
    (v) => v.product_request_id === productRequestId && v.voter_id === voterId,
  )
  if (existing) return getRequestedProductById(productRequestId)

  const requested = requestedProducts.find((rp) => rp.id === productRequestId)
  if (!requested) return null

  votes = [
    ...votes,
    { id: mockId('v'), product_request_id: productRequestId, voter_id: voterId, created_at: new Date().toISOString() },
  ]
  requested.vote_count += 1
  persistVotes()
  persistRequested()
  return { ...requested }
}

export async function removeVote(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  await delay(300)

  const existing = votes.find(
    (v) => v.product_request_id === productRequestId && v.voter_id === voterId,
  )
  if (!existing) return getRequestedProductById(productRequestId)

  votes = votes.filter((v) => v.id !== existing.id)
  const requested = requestedProducts.find((rp) => rp.id === productRequestId)
  if (requested) {
    requested.vote_count = Math.max(0, requested.vote_count - 1)
  }
  persistVotes()
  persistRequested()
  return requested ? { ...requested } : null
}

export async function hasVoted(
  productRequestId: string,
  voterId: string,
): Promise<boolean> {
  await delay(100)
  return votes.some(
    (v) => v.product_request_id === productRequestId && v.voter_id === voterId,
  )
}

export async function getVoteCount(productRequestId: string): Promise<number> {
  await delay(100)
  return votes.filter((v) => v.product_request_id === productRequestId).length
}
