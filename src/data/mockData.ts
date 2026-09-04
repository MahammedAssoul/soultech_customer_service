import type {
  CustomerIssue,
  Machine,
  Product,
  ProductRequest,
  RequestedProduct,
} from '../types'

// ---------------------------------------------------------------------------
// Machines
// ---------------------------------------------------------------------------

export const mockMachines: Machine[] = [
  {
    id: 'm-001',
    machine_code: 'ST-001',
    name: 'ST-001',
    name_ar: 'المدخل الرئيسي',
    location: 'Main Entrance',
    is_active: true,
    created_at: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'm-002',
    machine_code: 'ST-002',
    name: 'ST-002',
    name_ar: 'الكافتيريا',
    location: 'Cafeteria',
    is_active: true,
    created_at: '2025-01-10T08:05:00.000Z',
  },
  {
    id: 'm-003',
    machine_code: 'ST-003',
    name: 'ST-003',
    name_ar: 'الاستقبال',
    location: 'Reception',
    is_active: true,
    created_at: '2025-02-01T09:00:00.000Z',
  },
  {
    id: 'm-004',
    machine_code: 'ST-004',
    name: 'ST-004',
    name_ar: 'قسم تقنية المعلومات',
    location: 'IT Department',
    is_active: true,
    created_at: '2025-02-15T10:30:00.000Z',
  },
  {
    id: 'm-005',
    machine_code: 'ST-005',
    name: 'ST-005',
    name_ar: 'صالة الموظفين',
    location: 'Staff Lounge',
    is_active: true,
    created_at: '2025-03-01T11:00:00.000Z',
  },
  {
    id: 'm-006',
    machine_code: 'ST-006',
    name: 'ST-006',
    name_ar: 'المستودع (مقفلة)',
    location: 'Warehouse (decommissioned)',
    is_active: false,
    created_at: '2024-06-01T08:00:00.000Z',
  },
]

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const placeholderImage = (label: string): string =>
  `https://placehold.co/200x200/eef4ff/274ce4?text=${encodeURIComponent(label)}`

export const mockProducts: Product[] = [
  // Drinks
  { id: 'p-001', name: 'Pepsi', category: 'Drinks', brand: 'PepsiCo', image_url: placeholderImage('Pepsi'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-002', name: '7UP', category: 'Drinks', brand: 'PepsiCo', image_url: placeholderImage('7UP'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-003', name: 'Water 500ml', category: 'Drinks', brand: 'Aquafina', image_url: placeholderImage('Water'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-004', name: 'Water 1.5L', category: 'Drinks', brand: 'Aquafina', image_url: placeholderImage('Water 1.5L'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-005', name: 'Red Bull', category: 'Drinks', brand: 'Red Bull', image_url: placeholderImage('Red Bull'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-006', name: 'Energy Drink', category: 'Drinks', brand: 'Sting', image_url: placeholderImage('Energy'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-007', name: 'Pepsi Max', category: 'Drinks', brand: 'PepsiCo', image_url: placeholderImage('Pepsi Max'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  // Chips
  { id: 'p-008', name: 'Doritos Cheese', category: 'Chips', brand: 'Doritos', image_url: placeholderImage('Doritos Cheese'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-009', name: 'Doritos Chili', category: 'Chips', brand: 'Doritos', image_url: placeholderImage('Doritos Chili'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-010', name: 'Doritos Lemon', category: 'Chips', brand: 'Doritos', image_url: placeholderImage('Doritos Lemon'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-011', name: "Lay's Cheese", category: 'Chips', brand: "Lay's", image_url: placeholderImage("Lay's Cheese"), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-012', name: "Lay's Chili", category: 'Chips', brand: "Lay's", image_url: placeholderImage("Lay's Chili"), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-013', name: "Lay's Barbecue", category: 'Chips', brand: "Lay's", image_url: placeholderImage("Lay's BBQ"), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  // Biscuits
  { id: 'p-014', name: 'Oreo', category: 'Biscuits', brand: 'Oreo', image_url: placeholderImage('Oreo'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-015', name: 'Maxion Cookies', category: 'Biscuits', brand: 'Maxion', image_url: placeholderImage('Maxion'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-016', name: 'Coffee Joy', category: 'Biscuits', brand: 'Coffee Joy', image_url: placeholderImage('Coffee Joy'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-017', name: 'Minotti Digestive', category: 'Biscuits', brand: 'Minotti', image_url: placeholderImage('Minotti'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  // Nuts
  { id: 'p-018', name: 'Cashew', category: 'Nuts', brand: 'Soultech', image_url: placeholderImage('Cashew'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-019', name: 'Almond', category: 'Nuts', brand: 'Soultech', image_url: placeholderImage('Almond'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-020', name: 'Pistachio', category: 'Nuts', brand: 'Soultech', image_url: placeholderImage('Pistachio'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  { id: 'p-021', name: 'Mixed Nuts', category: 'Nuts', brand: 'Soultech', image_url: placeholderImage('Mixed Nuts'), is_active: true, created_at: '2025-01-10T08:00:00.000Z' },
  // Inactive example
  { id: 'p-022', name: 'Old Cola', category: 'Drinks', brand: 'Legacy', image_url: null, is_active: false, created_at: '2024-06-01T08:00:00.000Z' },
]

// ---------------------------------------------------------------------------
// Customer issues
// ---------------------------------------------------------------------------

export const mockIssues: CustomerIssue[] = [
  {
    id: 'i-001',
    reference_number: 'ST-1001',
    machine_id: 'm-001',
    issue_type: 'product_didnt_come_out',
    description: 'Paid for a Pepsi but nothing came out.',
    photo_url: null,
    customer_phone: null,
    status: 'new',
    created_at: '2026-08-20T09:15:00.000Z',
    resolved_at: null,
  },
  {
    id: 'i-002',
    reference_number: 'ST-1002',
    machine_id: 'm-003',
    issue_type: 'payment_problem',
    description: 'The card reader charged me twice.',
    photo_url: null,
    customer_phone: '+218912345678',
    status: 'in_progress',
    created_at: '2026-08-21T14:40:00.000Z',
    resolved_at: null,
  },
  {
    id: 'i-003',
    reference_number: 'ST-1003',
    machine_id: 'm-002',
    issue_type: 'product_got_stuck',
    description: 'A bag of chips got stuck in the spiral.',
    photo_url: null,
    customer_phone: null,
    status: 'resolved',
    created_at: '2026-08-18T11:05:00.000Z',
    resolved_at: '2026-08-19T08:30:00.000Z',
  },
  {
    id: 'i-004',
    reference_number: 'ST-1004',
    machine_id: 'm-004',
    issue_type: 'machine_not_working',
    description: 'Screen is off, machine completely dead.',
    photo_url: null,
    customer_phone: '+218925551234',
    status: 'new',
    created_at: '2026-08-22T16:20:00.000Z',
    resolved_at: null,
  },
]

// ---------------------------------------------------------------------------
// Product requests
// ---------------------------------------------------------------------------

export const mockProductRequests: ProductRequest[] = [
  {
    id: 'r-001',
    reference_number: 'PR-1001',
    machine_id: 'm-001',
    product_id: 'p-005',
    product_name: 'Red Bull',
    description: null,
    customer_phone: null,
    status: 'new',
    created_at: '2026-08-19T10:00:00.000Z',
    resolved_at: null,
  },
  {
    id: 'r-002',
    reference_number: 'PR-1002',
    machine_id: 'm-002',
    product_id: 'p-014',
    product_name: 'Oreo',
    description: 'Would love to see Oreo in the cafeteria machine.',
    customer_phone: null,
    status: 'in_progress',
    created_at: '2026-08-20T13:30:00.000Z',
    resolved_at: null,
  },
  {
    id: 'r-003',
    reference_number: 'PR-1003',
    machine_id: 'm-003',
    product_id: 'p-007',
    product_name: 'Pepsi Max',
    description: null,
    customer_phone: '+218901112233',
    status: 'resolved',
    created_at: '2026-08-15T09:45:00.000Z',
    resolved_at: '2026-08-17T12:00:00.000Z',
  },
  {
    id: 'r-004',
    reference_number: 'PR-1004',
    machine_id: 'm-001',
    product_id: 'p-004',
    product_name: 'Water 1.5L',
    description: 'The 500ml bottles run out too fast.',
    customer_phone: null,
    status: 'new',
    created_at: '2026-08-22T08:10:00.000Z',
    resolved_at: null,
  },
]

// ---------------------------------------------------------------------------
// Requested products (voting list) — machine-specific
// ---------------------------------------------------------------------------

export const mockRequestedProducts: RequestedProduct[] = [
  // ST-001 (Main Entrance)
  {
    id: 'rp-001',
    machine_id: 'm-001',
    product_id: 'p-005',
    product_name: 'Red Bull',
    category: 'Drinks',
    photo_url: placeholderImage('Red Bull'),
    admin_note: "High demand. We're checking supplier availability.",
    vote_count: 42,
    status: 'reviewing',
    created_at: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'rp-002',
    machine_id: 'm-001',
    product_id: 'p-014',
    product_name: 'Oreo',
    category: 'Biscuits',
    photo_url: placeholderImage('Oreo'),
    admin_note: 'Currently under review.',
    vote_count: 31,
    status: 'reviewing',
    created_at: '2026-07-05T10:00:00.000Z',
  },
  {
    id: 'rp-003',
    machine_id: 'm-001',
    product_id: 'p-007',
    product_name: 'Pepsi Max',
    category: 'Drinks',
    photo_url: placeholderImage('Pepsi Max'),
    admin_note: null,
    vote_count: 19,
    status: 'new',
    created_at: '2026-07-10T11:00:00.000Z',
  },
  {
    id: 'rp-004',
    machine_id: 'm-001',
    product_id: 'p-009',
    product_name: 'Doritos Chili',
    category: 'Chips',
    photo_url: placeholderImage('Doritos Chili'),
    admin_note: 'Expected to be available soon.',
    vote_count: 15,
    status: 'approved',
    created_at: '2026-07-12T12:00:00.000Z',
  },
  // ST-002 (Cafeteria)
  {
    id: 'rp-005',
    machine_id: 'm-002',
    product_id: 'p-006',
    product_name: 'Energy Drink',
    category: 'Drinks',
    photo_url: placeholderImage('Energy Drink'),
    admin_note: 'Popular with the afternoon crowd.',
    vote_count: 27,
    status: 'reviewing',
    created_at: '2026-07-02T09:30:00.000Z',
  },
  {
    id: 'rp-006',
    machine_id: 'm-002',
    product_id: 'p-018',
    product_name: 'Cashew',
    category: 'Nuts',
    photo_url: placeholderImage('Cashew'),
    admin_note: null,
    vote_count: 12,
    status: 'new',
    created_at: '2026-07-08T10:30:00.000Z',
  },
  {
    id: 'rp-007',
    machine_id: 'm-002',
    product_id: 'p-015',
    product_name: 'Maxion Cookies',
    category: 'Biscuits',
    photo_url: placeholderImage('Maxion'),
    admin_note: 'Available from our supplier. We are considering adding it next month.',
    vote_count: 9,
    status: 'approved',
    created_at: '2026-07-15T11:30:00.000Z',
  },
  // ST-003 (Reception)
  {
    id: 'rp-008',
    machine_id: 'm-003',
    product_id: 'p-004',
    product_name: 'Water 1.5L',
    category: 'Drinks',
    photo_url: placeholderImage('Water 1.5L'),
    admin_note: null,
    vote_count: 22,
    status: 'available',
    created_at: '2026-07-03T09:00:00.000Z',
  },
  {
    id: 'rp-009',
    machine_id: 'm-003',
    product_id: 'p-011',
    product_name: "Lay's Cheese",
    category: 'Chips',
    photo_url: placeholderImage("Lay's Cheese"),
    admin_note: 'Not planned at this time.',
    vote_count: 6,
    status: 'rejected',
    created_at: '2026-07-06T10:00:00.000Z',
  },
]