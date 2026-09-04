import type { ReactNode } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { useI18n } from '../i18n/useI18n'

interface PageLayoutProps {
  children: ReactNode
  /** Hide the language switcher (e.g. inside focused form pages). */
  minimal?: boolean
}

export function PageLayout({ children, minimal = false }: PageLayoutProps) {
  const { t } = useI18n()
  return (
    <div className="page-shell">
      <header className="flex items-center justify-between py-2">
        <Logo size="sm" />
        {!minimal && <LanguageSwitcher />}
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="mt-8 border-t border-line/60 pb-2 pt-4 text-center">
        <p className="text-xs font-semibold tracking-wide text-muted">{t('brand.name')}</p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-muted/70">
          {t('brand.tagline')}
        </p>
        <p className="mt-1.5 text-[11px] text-muted/60">
          © {new Date().getFullYear()} {t('brand.name')}
        </p>
      </footer>
    </div>
  )
}