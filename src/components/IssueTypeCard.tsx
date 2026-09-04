import { useId } from 'react'
import { useI18n } from '../i18n/useI18n'
import type { TranslationKey } from '../i18n/translations'
import { ISSUE_TYPE_ICONS, type IssueTypeValue } from '../types'

interface IssueTypeCardProps {
  value: IssueTypeValue
  labelKey: TranslationKey
  selected: boolean
  onSelect: (value: IssueTypeValue) => void
}

export function IssueTypeCard({ value, labelKey, selected, onSelect }: IssueTypeCardProps) {
  const { t } = useI18n()
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-4 text-center transition-all duration-150 ${
        selected
          ? 'border-brand-500 bg-gradient-to-b from-brand-50/80 to-brand-100/40 shadow-md shadow-brand-500/15 ring-2 ring-brand-500/25'
          : 'border-line/80 bg-surface shadow-sm hover:border-brand-300 hover:bg-brand-50/40'
      }`}
    >
      <input
        id={id}
        type="radio"
        name="issue-type"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span className="text-2xl" aria-hidden="true">
        {ISSUE_TYPE_ICONS[value]}
      </span>
      <span
        className={`text-xs font-semibold leading-tight ${selected ? 'text-brand-900' : 'text-ink'}`}
      >
        {t(labelKey)}
      </span>
      {selected && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
          <svg
            className="h-3 w-3"
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
        </span>
      )}
    </label>
  )
}
