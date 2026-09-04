import { useI18n } from '../i18n/useI18n'
import type { Language } from '../i18n/translations'

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ]

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-line bg-surface p-1 shadow-sm"
    >
      {options.map((option) => {
        const active = language === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={active}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-muted hover:bg-soft hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}