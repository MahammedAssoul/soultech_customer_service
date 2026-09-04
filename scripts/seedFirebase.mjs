/**
 * Seed script for the Soultech Vending Firebase project.
 *
 * Usage:
 *   1. Set your VITE_FIREBASE_* env vars (or copy .env.example → .env).
 *   2. Run: node scripts/seedFirebase.mjs
 *
 * This script:
 *   - Creates the `admins` collection with UIDs from ADMIN_UIDS below.
 *   - Seeds machines, products, issues, product requests, requested
 *     products, and machine visits from the same data used by mock mode.
 *
 * SAFETY: the script is idempotent (uses document ids derived from machine
 * codes / product names). It NEVER deletes data and never overwrites an
 * existing document — `setDoc` with `{ merge: false }` is only called for
 * documents that do not already exist.
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ---------------------------------------------------------------------------
// Configuration — fill these in before running.
// ---------------------------------------------------------------------------

const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
// Firestore database id (must match the created database, e.g. "soultech-support").
const DATABASE_ID = process.env.FIREBASE_DATABASE_ID || 'soultech-support'
const ADMIN_UIDS = (process.env.FIREBASE_ADMIN_UIDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

if (!SERVICE_ACCOUNT_PATH) {
  console.error(
    'FIREBASE_SERVICE_ACCOUNT_PATH must point to a Firebase service-account JSON file.',
  )
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Seed data — mirrors src/data/mockData.ts so both modes show the same data.
// ---------------------------------------------------------------------------

const machines = [
  { machineCode: 'ST-001', name: 'ST-001', nameAr: 'المدخل الرئيسي', location: 'Main Entrance', isActive: true },
  { machineCode: 'ST-002', name: 'ST-002', nameAr: 'الكافتيريا', location: 'Cafeteria', isActive: true },
  { machineCode: 'ST-003', name: 'ST-003', nameAr: 'الاستقبال', location: 'Reception', isActive: true },
  { machineCode: 'ST-004', name: 'ST-004', nameAr: 'قسم تقنية المعلومات', location: 'IT Department', isActive: true },
  { machineCode: 'ST-005', name: 'ST-005', nameAr: 'صالة الموظفين', location: 'Staff Lounge', isActive: true },
  { machineCode: 'ST-006', name: 'ST-006', nameAr: 'المستودع (مقفلة)', location: 'Warehouse (decommissioned)', isActive: false },
]

const products = [
  { name: 'Pepsi', category: 'Drinks', brand: 'PepsiCo', isActive: true },
  { name: '7UP', category: 'Drinks', brand: 'PepsiCo', isActive: true },
  { name: 'Water 500ml', category: 'Drinks', brand: 'Aquafina', isActive: true },
  { name: 'Water 1.5L', category: 'Drinks', brand: 'Aquafina', isActive: true },
  { name: 'Red Bull', category: 'Drinks', brand: 'Red Bull', isActive: true },
  { name: 'Energy Drink', category: 'Drinks', brand: 'Sting', isActive: true },
  { name: 'Pepsi Max', category: 'Drinks', brand: 'PepsiCo', isActive: true },
  { name: 'Doritos Cheese', category: 'Chips', brand: 'Doritos', isActive: true },
  { name: 'Doritos Chili', category: 'Chips', brand: 'Doritos', isActive: true },
  { name: 'Doritos Lemon', category: 'Chips', brand: 'Doritos', isActive: true },
  { name: "Lay's Cheese", category: 'Chips', brand: "Lay's", isActive: true },
  { name: "Lay's Chili", category: 'Chips', brand: "Lay's", isActive: true },
  { name: "Lay's Barbecue", category: 'Chips', brand: "Lay's", isActive: true },
  { name: 'Oreo', category: 'Biscuits', brand: 'Oreo', isActive: true },
  { name: 'Maxion Cookies', category: 'Biscuits', brand: 'Maxion', isActive: true },
  { name: 'Coffee Joy', category: 'Biscuits', brand: 'Coffee Joy', isActive: true },
  { name: 'Minotti Digestive', category: 'Biscuits', brand: 'Minotti', isActive: true },
  { name: 'Cashew', category: 'Nuts', brand: 'Soultech', isActive: true },
  { name: 'Almond', category: 'Nuts', brand: 'Soultech', isActive: true },
  { name: 'Pistachio', category: 'Nuts', brand: 'Soultech', isActive: true },
  { name: 'Mixed Nuts', category: 'Nuts', brand: 'Soultech', isActive: true },
  { name: 'Old Cola', category: 'Drinks', brand: 'Legacy', imageUrl: null, isActive: false },
]

const issues = [
  { referenceNumber: 'ST-1001', machineCode: 'ST-001', issueType: 'product_didnt_come_out', description: 'Paid for a Pepsi but nothing came out.', customerPhone: null, status: 'new', createdAt: '2026-08-20T09:15:00.000Z' },
  { referenceNumber: 'ST-1002', machineCode: 'ST-003', issueType: 'payment_problem', description: 'The card reader charged me twice.', customerPhone: '+218912345678', status: 'in_progress', createdAt: '2026-08-21T14:40:00.000Z' },
  { referenceNumber: 'ST-1003', machineCode: 'ST-002', issueType: 'product_got_stuck', description: 'A bag of chips got stuck in the spiral.', customerPhone: null, status: 'resolved', resolvedAt: '2026-08-19T08:30:00.000Z', createdAt: '2026-08-18T11:05:00.000Z' },
  { referenceNumber: 'ST-1004', machineCode: 'ST-004', issueType: 'machine_not_working', description: 'Screen is off, machine completely dead.', customerPhone: '+218925551234', status: 'new', createdAt: '2026-08-22T16:20:00.000Z' },
]

const productRequests = [
  { referenceNumber: 'PR-1001', machineCode: 'ST-001', productName: 'Red Bull', productId: 'red-bull', description: null, customerPhone: null, status: 'new', createdAt: '2026-08-19T10:00:00.000Z' },
  { referenceNumber: 'PR-1002', machineCode: 'ST-002', productName: 'Oreo', productId: 'oreo', description: 'Would love to see Oreo in the cafeteria machine.', customerPhone: null, status: 'in_progress', createdAt: '2026-08-20T13:30:00.000Z' },
  { referenceNumber: 'PR-1003', machineCode: 'ST-003', productName: 'Pepsi Max', productId: 'pepsi-max', description: null, customerPhone: '+218901112233', status: 'resolved', resolvedAt: '2026-08-17T12:00:00.000Z', createdAt: '2026-08-15T09:45:00.000Z' },
]

const requestedProducts = [
  { machineCode: 'ST-001', productId: 'red-bull', productName: 'Red Bull', category: 'Drinks', photoUrl: null, adminNote: "High demand. We're checking supplier availability.", voteCount: 42, status: 'reviewing', createdAt: '2026-07-01T09:00:00.000Z' },
  { machineCode: 'ST-001', productId: 'oreo', productName: 'Oreo', category: 'Biscuits', photoUrl: null, adminNote: 'Currently under review.', voteCount: 31, status: 'reviewing', createdAt: '2026-07-05T10:00:00.000Z' },
  { machineCode: 'ST-001', productId: 'pepsi-max', productName: 'Pepsi Max', category: 'Drinks', photoUrl: null, adminNote: null, voteCount: 19, status: 'new', createdAt: '2026-07-10T11:00:00.000Z' },
  { machineCode: 'ST-001', productId: 'doritos-chili', productName: 'Doritos Chili', category: 'Chips', photoUrl: null, adminNote: 'Expected to be available soon.', voteCount: 15, status: 'approved', createdAt: '2026-07-12T12:00:00.000Z' },
  { machineCode: 'ST-002', productId: 'energy-drink', productName: 'Energy Drink', category: 'Drinks', photoUrl: null, adminNote: 'Popular with the afternoon crowd.', voteCount: 27, status: 'reviewing', createdAt: '2026-07-02T09:30:00.000Z' },
  { machineCode: 'ST-002', productId: 'cashew', productName: 'Cashew', category: 'Nuts', photoUrl: null, adminNote: null, voteCount: 12, status: 'new', createdAt: '2026-07-08T10:30:00.000Z' },
  { machineCode: 'ST-002', productId: 'maxion-cookies', productName: 'Maxion Cookies', category: 'Biscuits', photoUrl: null, adminNote: 'Available from our supplier. We are considering adding it next month.', voteCount: 9, status: 'approved', createdAt: '2026-07-15T11:30:00.000Z' },
  { machineCode: 'ST-003', productId: 'water-1.5l', productName: 'Water 1.5L', category: 'Drinks', photoUrl: null, adminNote: null, voteCount: 22, status: 'available', createdAt: '2026-07-03T09:00:00.000Z' },
  { machineCode: 'ST-003', productId: 'lays-cheese', productName: "Lay's Cheese", category: 'Chips', photoUrl: null, adminNote: 'Not planned at this time.', voteCount: 6, status: 'rejected', createdAt: '2026-07-06T10:00:00.000Z' },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const app = initializeApp({
    credential: cert(SERVICE_ACCOUNT_PATH),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  })
  const db = getFirestore(app, DATABASE_ID)
  const now = FieldValue.serverTimestamp()

  // Machine id map (deterministic ids derived from machine codes).
  const machineIds = {}
  for (const m of machines) {
    const id = `machine-${m.machineCode.toLowerCase()}`
    machineIds[m.machineCode] = id
    const ref = db.collection('machines').doc(id)
    const snap = await ref.get()
    if (snap.exists) {
      console.log(`skip machines/${id} (exists)`)
    } else {
      await ref.set({ ...m, createdAt: now, updatedAt: now })
      console.log(`created machines/${id}`)
    }
  }

  // Product id map.
  const productIds = {}
  for (const p of products) {
    const id = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    productIds[p.name] = id
    const ref = db.collection('products').doc(id)
    const snap = await ref.get()
    if (snap.exists) {
      console.log(`skip products/${id} (exists)`)
    } else {
      await ref.set({ ...p, createdAt: now, updatedAt: now })
      console.log(`created products/${id}`)
    }
  }

  // Issues.
  for (const i of issues) {
    const id = `issue-${i.referenceNumber.toLowerCase()}`
    const ref = db.collection('issues').doc(id)
    const snap = await ref.get()
    if (snap.exists) {
      console.log(`skip issues/${id} (exists)`)
    } else {
      await ref.set({
        referenceNumber: i.referenceNumber,
        machineId: machineIds[i.machineCode],
        issueType: i.issueType,
        description: i.description ?? null,
        photoUrl: null,
        customerPhone: i.customerPhone ?? null,
        status: i.status,
        resolvedAt: i.resolvedAt ?? null,
        createdAt: new Date(i.createdAt),
        updatedAt: now,
      })
      console.log(`created issues/${id}`)
    }
  }

  // Product requests (legacy tracking).
  for (const r of productRequests) {
    const id = `request-${r.referenceNumber.toLowerCase()}`
    const ref = db.collection('productRequests').doc(id)
    const snap = await ref.get()
    if (snap.exists) {
      console.log(`skip productRequests/${id} (exists)`)
    } else {
      await ref.set({
        referenceNumber: r.referenceNumber,
        machineId: machineIds[r.machineCode],
        productId: r.productId ?? null,
        productName: r.productName,
        description: r.description ?? null,
        customerPhone: r.customerPhone ?? null,
        status: r.status,
        resolvedAt: r.resolvedAt ?? null,
        createdAt: new Date(r.createdAt),
        updatedAt: now,
      })
      console.log(`created productRequests/${id}`)
    }
  }

  // Requested products (voting list) + deterministic ids.
  for (const rp of requestedProducts) {
    const id = `requested-${machineIds[rp.machineCode]}-${String(rp.productId ?? rp.productName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    const ref = db.collection('requestedProducts').doc(id)
    const snap = await ref.get()
    if (snap.exists) {
      console.log(`skip requestedProducts/${id} (exists)`)
    } else {
      await ref.set({
        machineId: machineIds[rp.machineCode],
        productId: rp.productId ?? null,
        productName: rp.productName,
        category: rp.category ?? null,
        photoUrl: rp.photoUrl ?? null,
        adminNote: rp.adminNote ?? null,
        voteCount: rp.voteCount,
        status: rp.status,
        createdAt: new Date(rp.createdAt),
        updatedAt: now,
      })
      console.log(`created requestedProducts/${id}`)
    }
  }

  // Admins collection (from FIREBASE_ADMIN_UIDS).
  for (const uid of ADMIN_UIDS) {
    await db.collection('admins').doc(uid).set({ uid, createdAt: now }, { merge: true })
    console.log(`admin set: admins/${uid}`)
  }

  console.log('\n✅ Seed complete.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})