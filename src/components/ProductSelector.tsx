import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { Product } from '../types'

interface ProductSelectorProps {
  products: Product[]
  selectedId: string | null
  onSelect: (product: Product | null) => void
  customName: string
  onCustomNameChange: (name: string) => void
}

export function ProductSelector({
  products,
  selectedId,
  onSelect,
  customName,
  onCustomNameChange,
}: ProductSelectorProps) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  const showCustom = query.trim().length > 0 && filtered.length === 0

  return (
    <div>
      <label htmlFor="product-search" className="mb-1.5 block text-sm font-bold text-ink">
        {t('request.searchLabel')}
      </label>
      <input
        id="product-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('request.searchPlaceholder')}
        className="input"
      />

      <div className="mt-3 space-y-2">
        {filtered.map((product) => {
          const selected = selectedId === product.id
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(selected ? null : product)}
              aria-pressed={selected}
              className={`flex min-h-14 w-full items-center gap-3 rounded-xl border-2 bg-surface px-4 py-3 text-start shadow-sm transition-all duration-150 ${
                selected
                  ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                  : 'border-line hover:border-brand-300'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-brand-600 bg-brand-600' : 'border-line'
                }`}
                aria-hidden="true"
              >
                {selected && (
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className="flex-1">
                <span className="block text-base font-medium text-ink">{product.name}</span>
                {product.brand && (
                  <span className="block text-xs text-muted">{product.brand}</span>
                )}
              </span>
            </button>
          )
        })}

        {filtered.length === 0 && !showCustom && (
          <p className="rounded-xl bg-soft px-4 py-3 text-sm text-muted">{t('request.noResults')}</p>
        )}

        {showCustom && (
          <div className="rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-4">
            <p className="mb-2 text-sm font-semibold text-brand-900">{t('request.otherProduct')}</p>
            <input
              type="text"
              value={customName}
              onChange={(e) => onCustomNameChange(e.target.value)}
              placeholder={t('request.otherProductPlaceholder')}
              className="input"
            />
          </div>
        )}
      </div>
    </div>
  )
}