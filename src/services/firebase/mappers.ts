import type { FieldValue, Timestamp } from 'firebase/firestore'
import type {
  CustomerIssue,
  IssueStatus,
  Machine,
  Product,
  ProductRequest,
  RequestedProduct,
  RequestedProductStatus,
  RequestStatus,
} from '../../types'

/**
 * Convert a Firestore timestamp (or null/undefined) into the ISO string the
 * UI expects. All Firebase <-> model conversions live in this layer.
 */
export function toIso(value: Timestamp | Date | string | null | undefined): string {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  if (typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate().toISOString()
  }
  return String(value)
}

/** Convert an arbitrary Firestore snapshot field value to a string or null. */
export function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return String(value)
}

/** Model shapes for Firestore documents. */

export type FirestoreMachine = Omit<Machine, 'created_at'> & {
  createdAt: FieldValue | ReturnType<typeof Date.prototype.toISOString>
}

export type FirestoreProduct = Omit<Product, 'created_at'> & {
  createdAt: ReturnType<typeof Date.prototype.toISOString> | FieldValue
}

export type FirestoreIssue = Omit<CustomerIssue, 'created_at' | 'resolved_at'> & {
  createdAt: ReturnType<typeof Date.prototype.toISOString> | FieldValue
  resolvedAt: string | null
}

export type FirestoreRequest = Omit<ProductRequest, 'created_at' | 'resolved_at'> & {
  createdAt: ReturnType<typeof Date.prototype.toISOString> | FieldValue
  resolvedAt: string | null
}

export type FirestoreRequestedProduct = Omit<
  RequestedProduct,
  'created_at'
> & {
  createdAt: ReturnType<typeof Date.prototype.toISOString> | FieldValue
}

/**
 * A Firestore document snapshot or a plain { id, data } object.
 * `data()` may return undefined for empty snapshots.
 */
export interface FirestoreDocLike {
  id: string
  data: () => Record<string, unknown> | undefined
}

/** Map a Firestore machine document to the app Machine model. */
export function mapMachine(doc: FirestoreDocLike): Machine {
  const d = doc.data() ?? {}
  return {
    id: doc.id,
    machine_code: String(d.machineCode ?? ''),
    name: String(d.name ?? ''),
    name_ar: toNullableString(d.nameAr),
    location: toNullableString(d.location),
    is_active: Boolean(d.isActive ?? true),
    created_at: toIso(d.createdAt as Timestamp),
  }
}

/** Map a Firestore product document to the app Product model. */
export function mapProduct(doc: FirestoreDocLike): Product {
  const d = doc.data() ?? {}
  return {
    id: doc.id,
    name: String(d.name ?? ''),
    category: toNullableString(d.category),
    brand: toNullableString(d.brand),
    image_url: toNullableString(d.imageUrl),
    is_active: Boolean(d.isActive ?? true),
    created_at: toIso(d.createdAt as Timestamp),
  }
}

/** Map a Firestore issue document to the app CustomerIssue model. */
export function mapIssue(doc: FirestoreDocLike): CustomerIssue {
  const d = doc.data() ?? {}
  return {
    id: doc.id,
    reference_number: String(d.referenceNumber ?? ''),
    machine_id: String(d.machineId ?? ''),
    issue_type: String(d.issueType ?? 'other') as CustomerIssue['issue_type'],
    description: toNullableString(d.description),
    photo_url: toNullableString(d.photoUrl),
    customer_phone: toNullableString(d.customerPhone),
    status: (d.status ?? 'new') as IssueStatus,
    created_at: toIso(d.createdAt as Timestamp),
    resolved_at: d.resolvedAt ? toIso(d.resolvedAt as Timestamp) : null,
  }
}

/** Map a Firestore product-request document to the app ProductRequest model. */
export function mapRequest(doc: FirestoreDocLike): ProductRequest {
  const d = doc.data() ?? {}
  return {
    id: doc.id,
    reference_number: String(d.referenceNumber ?? ''),
    machine_id: String(d.machineId ?? ''),
    product_id: toNullableString(d.productId),
    product_name: String(d.productName ?? ''),
    description: toNullableString(d.description),
    customer_phone: toNullableString(d.customerPhone),
    status: (d.status ?? 'new') as RequestStatus,
    created_at: toIso(d.createdAt as Timestamp),
    resolved_at: d.resolvedAt ? toIso(d.resolvedAt as Timestamp) : null,
  }
}

/** Map a Firestore requested-product document to the app RequestedProduct model. */
export function mapRequestedProduct(doc: FirestoreDocLike): RequestedProduct {
  const d = doc.data() ?? {}
  return {
    id: doc.id,
    machine_id: String(d.machineId ?? ''),
    product_id: toNullableString(d.productId),
    product_name: String(d.productName ?? ''),
    category: toNullableString(d.category),
    photo_url: toNullableString(d.photoUrl),
    admin_note: toNullableString(d.adminNote),
    vote_count: Number(d.voteCount ?? 0),
    status: (d.status ?? 'new') as RequestedProductStatus,
    created_at: toIso(d.createdAt as Timestamp),
  }
}

/** Apply updatedAt to create/update payloads. */
export function withUpdatedAt<T extends Record<string, unknown>>(
  payload: T,
  updatedAt: ReturnType<typeof Date.prototype.toISOString>,
): T {
  return { ...payload, updatedAt }
}