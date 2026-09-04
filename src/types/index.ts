export type IssueStatus = 'new' | 'in_progress' | 'resolved' | 'rejected'
export type RequestStatus = 'new' | 'in_progress' | 'resolved' | 'rejected'

/** Status of a requested product shown on the requested-products list. */
export type RequestedProductStatus = 'new' | 'reviewing' | 'approved' | 'available' | 'rejected'

export const ISSUE_TYPES = [
  'product_didnt_come_out',
  'product_got_stuck',
  'payment_problem',
  'wrong_change',
  'machine_not_working',
  'machine_empty',
  'product_damaged',
  'other',
] as const

export type IssueTypeValue = (typeof ISSUE_TYPES)[number]

export type IssueType = IssueTypeValue

/** Emoji icon per issue type for a visual, touch-friendly picker. */
export const ISSUE_TYPE_ICONS: Record<IssueTypeValue, string> = {
  product_didnt_come_out: '📦',
  product_got_stuck: '🌀',
  payment_problem: '💳',
  wrong_change: '💰',
  machine_not_working: '⚙️',
  machine_empty: '🕳️',
  product_damaged: '⚠️',
  other: '💬',
}

export interface Machine {
  id: string
  machine_code: string
  name: string
  /** Arabic display name shown to customers when the app language is Arabic. */
  name_ar: string | null
  location: string | null
  is_active: boolean
  created_at: string
}

/** A machine plus its visitor count, used in the admin panel. */
export interface MachineWithStats extends Machine {
  visitor_count: number
}

/** Admin-only creation of a machine. */
export interface NewMachineInput {
  machine_code: string
  name: string
  name_ar?: string | null
  location?: string | null
  is_active?: boolean
}

/** Admin-only updates to a machine. */
export interface UpdateMachineInput {
  machine_code?: string
  name?: string
  name_ar?: string | null
  location?: string | null
  is_active?: boolean
}

/** Public payload recorded when a customer opens a machine page. */
export interface MachineVisit {
  machine_id: string
  visited_at: string
}

export interface Product {
  id: string
  name: string
  category: string | null
  brand: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface CustomerIssue {
  id: string
  reference_number: string
  machine_id: string
  issue_type: IssueType
  description: string | null
  photo_url: string | null
  customer_phone: string | null
  status: IssueStatus
  created_at: string
  resolved_at: string | null
}

export interface ProductRequest {
  id: string
  reference_number: string
  machine_id: string
  product_id: string | null
  product_name: string
  description: string | null
  customer_phone: string | null
  status: RequestStatus
  created_at: string
  resolved_at: string | null
}

/**
 * A product that has been requested for a specific machine and can be voted on.
 * `product_id` is optional — customers can request products that don't exist
 * in the main product database yet.
 */
export interface RequestedProduct {
  id: string
  machine_id: string
  product_id: string | null
  product_name: string
  category: string | null
  photo_url: string | null
  admin_note: string | null
  vote_count: number
  status: RequestedProductStatus
  created_at: string
}

export interface MachineWithName extends Machine {
  name: string
}

export interface IssueWithMachine extends CustomerIssue {
  machines: MachineWithName | null
}

export interface ProductRequestWithMachine extends ProductRequest {
  machines: MachineWithName | null
}

export interface NewIssueInput {
  reference_number: string
  machine_id: string
  issue_type: IssueType
  description?: string
  photo_url?: string | null
  customer_phone?: string | null
}

export interface NewProductRequestInput {
  reference_number: string
  machine_id: string
  product_id?: string | null
  product_name: string
  description?: string
  customer_phone?: string | null
}

/** Input for creating a requested-product entry (voting list). */
export interface NewRequestedProductInput {
  machine_id: string
  product_id?: string | null
  product_name: string
  category?: string | null
  photo_url?: string | null
  admin_note?: string | null
}

export interface ProductVote {
  id: string
  product_request_id: string
  voter_id: string
  created_at: string
}

/** Admin-only updates to a requested product (status, note, photo). */
export interface UpdateRequestedProductInput {
  status?: RequestedProductStatus
  admin_note?: string | null
  photo_url?: string | null
}