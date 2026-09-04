import { mockProducts } from '../../data/mockData'
import { delay } from './mockUtils'
import type { Product } from '../../types'

export async function getProducts(): Promise<Product[]> {
  await delay(300)
  return [...mockProducts]
}

export async function getActiveProducts(): Promise<Product[]> {
  await delay(300)
  return mockProducts
    .filter((p) => p.is_active)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(250)
  const q = query.trim().toLowerCase()
  if (!q) return getActiveProducts()
  return mockProducts.filter(
    (p) =>
      p.is_active &&
      (p.name.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false)),
  )
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await delay(250)
  return mockProducts.filter(
    (p) => p.is_active && p.category?.toLowerCase() === category.toLowerCase(),
  )
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200)
  return mockProducts.find((p) => p.id === id) ?? null
}