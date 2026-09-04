import { createContext } from 'react'
import type { TranslationKey } from './translations'

export interface I18nContextValue {
  language: 'en' | 'ar'
  setLanguage: (lang: 'en' | 'ar') => void
  t: (key: TranslationKey) => string
  dir: 'ltr' | 'rtl'
}

export const I18nContext = createContext<I18nContextValue | null>(null)