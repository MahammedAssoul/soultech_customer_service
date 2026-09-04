import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ActionCardProps {
  to: string
  icon: ReactNode
  title: string
  hint: string
  tone: 'brand' | 'accent'
}

export function ActionCard({ to, icon, title, hint, tone }: ActionCardProps) {
  const isBrand = tone === 'brand'

  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] ${
        isBrand
          ? 'border-brand-600/10 bg-gradient-to-br from-surface to-brand-50/80 hover:border-brand-300'
          : 'border-accent-600/10 bg-gradient-to-br from-surface to-accent-50/80 hover:border-accent-300'
      }`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-200 group-hover:scale-105 ${
          isBrand ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-600/30' : 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-accent-500/30'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{hint}</span>
      </span>

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 ${
          isBrand ? 'bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white' : 'bg-accent-100 text-accent-600 group-hover:bg-accent-500 group-hover:text-white'
        }`}
        aria-hidden="true"
      >
        <svg
          className="h-5 w-5 rtl:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}
