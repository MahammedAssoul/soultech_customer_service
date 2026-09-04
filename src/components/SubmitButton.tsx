import { useI18n } from '../i18n/useI18n'

interface SubmitButtonProps {
  loading?: boolean
  disabled?: boolean
  children: string
}

export function SubmitButton({ loading = false, disabled = false, children }: SubmitButtonProps) {
  const { t } = useI18n()
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="btn-primary"
    >
      {loading && (
        <svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading ? t('common.loading') : children}
      {!loading && (
        <svg
          className="h-5 w-5 rtl:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
}
