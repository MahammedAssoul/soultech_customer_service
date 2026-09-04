import { getSupabase } from './supabaseClient'
import type {
  NewProductRequestInput,
  NewRequestedProductInput,
  ProductRequest,
  ProductRequestWithMachine,
  ProductVote,
  RequestedProduct,
  UpdateRequestedProductInput,
} from '../../types'

// ---------------------------------------------------------------------------
// Product requests (legacy tracking records)
// ---------------------------------------------------------------------------

export async function getProductRequests(): Promise<ProductRequest[]> {
  const { data, error } = await getSupabase()
    .from('product_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getProductRequestByReference(
  reference: string,
): Promise<ProductRequestWithMachine | null> {
  const { data, error } = await getSupabase()
    .from('product_requests')
    .select('*, machines(name)')
    .eq('reference_number', reference)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createProductRequest(
  input: NewProductRequestInput,
): Promise<ProductRequest> {
  const { data, error } = await getSupabase()
    .from('product_requests')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProductRequestStatus(
  id: string,
  status: ProductRequest['status'],
): Promise<ProductRequest | null> {
  const { data, error } = await getSupabase()
    .from('product_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Requested products (voting list)
// ---------------------------------------------------------------------------

export async function getRequestedProducts(machineId: string): Promise<RequestedProduct[]> {
  const { data, error } = await getSupabase()
    .from('requested_products')
    .select('*')
    .eq('machine_id', machineId)
    .order('vote_count', { ascending: false })

  if (error) throw error
  return data ?? []
}

/** All requested products across every machine (admin view). */
export async function getAllRequestedProducts(): Promise<RequestedProduct[]> {
  const { data, error } = await getSupabase()
    .from('requested_products')
    .select('*')
    .order('vote_count', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getRequestedProductById(
  id: string,
): Promise<RequestedProduct | null> {
  const { data, error } = await getSupabase()
    .from('requested_products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function findRequestedProduct(
  machineId: string,
  productName: string,
  productId?: string | null,
): Promise<RequestedProduct | null> {
  const normalized = productName.trim().toLowerCase()

  // Prefer matching by product_id when provided.
  if (productId) {
    const { data, error } = await getSupabase()
      .from('requested_products')
      .select('*')
      .eq('machine_id', machineId)
      .eq('product_id', productId)
      .maybeSingle()

    if (error) throw error
    if (data) return data
  }

  // Fall back to a case-insensitive name match.
  const { data, error } = await getSupabase()
    .from('requested_products')
    .select('*')
    .eq('machine_id', machineId)
    .ilike('product_name', normalized)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createRequestedProduct(
  input: NewRequestedProductInput,
): Promise<RequestedProduct> {
  const { data, error } = await getSupabase()
    .from('requested_products')
    .insert({ ...input, vote_count: 0, status: 'new' })
    .select()
    .single()

  if (error) throw error
  return data
}

/** Admin-only update of a requested product (status and/or admin note). */
export async function updateRequestedProduct(
  id: string,
  input: UpdateRequestedProductInput,
): Promise<RequestedProduct | null> {
  const { data, error } = await getSupabase()
    .from('requested_products')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Voting
// ---------------------------------------------------------------------------

/** Get (or create) the anonymous voter id stored in localStorage. */
export async function getVoterId(): Promise<string> {
  if (typeof window === 'undefined') return 'voter_ssr'
  try {
    const existing = window.localStorage.getItem('soultech_voter_id')
    if (existing) return existing
    const id = `voter_${Math.random().toString(16).slice(2, 10)}`
    window.localStorage.setItem('soultech_voter_id', id)
    return id
  } catch {
    return `voter_${Math.random().toString(16).slice(2, 10)}`
  }
}

export async function voteForProduct(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  // Insert the vote; the unique (product_request_id, voter_id) constraint
  // prevents duplicates. On conflict we simply return the current product.
  const { error } = await getSupabase()
    .from('product_request_votes')
    .insert({ product_request_id: productRequestId, voter_id: voterId })
    .select()
    .single()

  if (error && !isUniqueViolation(error)) throw error

  // Increment the denormalized count safely.
  const { data, error: updateError } = await getSupabase()
    .from('requested_products')
    .update({ vote_count: { increment: 1 } })
    .eq('id', productRequestId)
    .select()
    .single()

  if (updateError) throw updateError
  return data
}

export async function removeVote(
  productRequestId: string,
  voterId: string,
): Promise<RequestedProduct | null> {
  const { error } = await getSupabase()
    .from('product_request_votes')
    .delete()
    .eq('product_request_id', productRequestId)
    .eq('voter_id', voterId)

  if (error) throw error

  const { data, error: updateError } = await getSupabase()
    .from('requested_products')
    .update({ vote_count: { increment: -1 } })
    .eq('id', productRequestId)
    .select()
    .single()

  if (updateError) throw updateError
  return data
}

export async function hasVoted(
  productRequestId: string,
  voterId: string,
): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('product_request_votes')
    .select('id')
    .eq('product_request_id', productRequestId)
    .eq('voter_id', voterId)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

export async function getVoteCount(productRequestId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from('product_request_votes')
    .select('id', { count: 'exact', head: true })
    .eq('product_request_id', productRequestId)

  if (error) throw error
  return count ?? 0
}

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === '23505'
}

export type { ProductVote }
