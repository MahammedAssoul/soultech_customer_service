import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'
import type { RequestedProduct, RequestedProductStatus } from '../types'

const STATUS_LABELS: Record<RequestedProductStatus, TranslationKey> = {
  new: 'requested.status.new',
  reviewing: 'requested.status.reviewing',
  approved: 'requested.status.approved',
  available: 'requested.status.available',
  rejected: 'requested.status.rejected',
}

const STATUS_TONES: Record<RequestedProductStatus, string> = {
  new: 'bg-brand-600 text-white',
  reviewing: 'bg-warning text-white',
  approved: 'bg-brand-600 text-white',
  available: 'bg-success text-white',
  rejected: 'bg-muted text-white',
}

interface RequestedProductCardProps {
  product: RequestedProduct
  voted: boolean
  busy: boolean
  onToggleVote: (product: RequestedProduct) => void
}

export function RequestedProductCard({
  product,
  voted,
  busy,
  onToggleVote,
}: RequestedProductCardProps) {
  const { t } = useI18n()

  return (
    <button
      type="button"
      onClick={() => onToggleVote(product)}
      disabled={busy}
      aria-pressed={voted}
      aria-label={`${product.product_name}, ${product.vote_count} ${t('requested.votes')}`}
      className={`group w-full overflow-hidden rounded-2xl border-2 bg-surface text-start shadow-sm transition-all duration-200 ${
        voted
          ? 'border-brand-500 shadow-lg shadow-brand-600/15 ring-2 ring-brand-500/20'
          : 'border-line/70 shadow-sm hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg'
      } ${busy ? 'cursor-wait opacity-70' : 'active:scale-[0.98]'}`}
    >
      {/* Image area */}
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-soft via-brand-50/50 to-soft">
        {product.photo_url ? (
          <img
            src={product.photo_url}
            alt={product.product_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-6 py-4 text-muted shadow-sm backdrop-blur-sm">
            <span className="text-5xl" aria-hidden="true">
              📦
            </span>
            <span className="text-xs font-semibold">{t('requested.photoComingSoon')}</span>
          </div>
        )}
        <span
          className={`badge absolute start-3 top-3 shadow-sm ${STATUS_TONES[product.status]}`}
        >
          {t(STATUS_LABELS[product.status])}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-ink">{product.product_name}</h3>
            {product.category && (
              <p className="mt-0.5 text-sm font-medium text-muted">{product.category}</p>
            )}
          </div>
          <div
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 transition-all duration-300 ${
              voted ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'bg-soft text-ink'
            }`}
          >
            <svg
              className={`h-4 w-4 ${voted ? 'text-white' : 'text-amber-400'}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-sm font-extrabold">{product.vote_count}</span>
            <span className="text-xs font-semibold opacity-80">{t('requested.votes')}</span>
          </div>
        </div>

        {/* Admin note callout */}
        {product.admin_note && (
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-200/70 bg-gradient-to-br from-brand-50 to-brand-100/60">
            <p className="flex items-center gap-1.5 bg-brand-600/10 px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-800">
              <span aria-hidden="true">💬</span>
              {t('requested.adminNote')}
            </p>
            <p className="px-3 py-2.5 text-sm leading-relaxed text-brand-900">
              &ldquo;{product.admin_note}&rdquo;
            </p>
          </div>
        )}

        {/* Vote indicator */}
        <div
          className={`mt-3 flex min-h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            voted
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/25'
              : 'bg-soft text-muted group-hover:bg-brand-50 group-hover:text-brand-700'
          }`}
        >
          {voted ? (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t('requested.youVoted')}
            </>
          ) : (
            <span>{t('requested.notVoted')}</span>
          )}
        </div>
      </div>
    </button>
  )
}
