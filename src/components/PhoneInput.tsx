import { useId } from 'react'
import { useI18n } from '../i18n/useI18n'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  invalid?: boolean
}

export function PhoneInput({ value, onChange, label, placeholder, invalid = false }: PhoneInputProps) {
  const { t } = useI18n()
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        <span className="ms-1.5 text-xs font-normal text-muted">({t('common.optional')})</span>
      </label>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={`input ${invalid ? '!border-danger focus:!ring-danger/25' : ''}`}
      />
      {invalid && <p className="mt-1.5 text-sm text-danger">{t('common.phoneInvalid')}</p>}
    </div>
  )
}
