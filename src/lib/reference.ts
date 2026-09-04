/**
 * Generate a unique, human-friendly reference number.
 *
 * Issues use the ST- prefix, product requests use PR-.
 * The numeric part is derived from a random 4-digit value, so references
 * are unique without exposing database IDs. Collisions are handled by the
 * unique constraint on reference_number — the caller retries on conflict.
 */
export function generateReference(prefix: 'ST' | 'PR'): string {
  const number = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${number}`
}

export function isValidReference(value: string): boolean {
  return /^(ST|PR)-\d{4}$/i.test(value.trim())
}