import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from 'firebase/firestore'
import { getDb } from '../../firebase/firebaseFirestore'
import { ensureAnonymousAuth } from '../../firebase/firebaseAuth'
import { mapProduct } from './mappers'
import type { Product } from '../../types'

const COLLECTION = 'products'

export async function getProducts(): Promise<Product[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  // No orderBy to avoid composite indexes — sort in memory.
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs.map(mapProduct).sort((a, b) => a.name.localeCompare(b.name))
}

export async function getActiveProducts(): Promise<Product[]> {
  await ensureAnonymousAuth()
  const db = getDb()
  const q = query(collection(db, COLLECTION), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(mapProduct).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Client-side search over active products. Firestore has no native
 * case-insensitive substring search, so we fetch active products and filter
 * in memory — acceptable given the small product catalog.
 */
export async function searchProducts(queryText: string): Promise<Product[]> {
  const q = queryText.trim().toLowerCase()
  const products = await getActiveProducts()
  if (!q) return products
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.category?.toLowerCase().includes(q) ?? false),
  )
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getActiveProducts()
  return products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase(),
  )
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureAnonymousAuth()
  const db = getDb()
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return mapProduct(snap)
}