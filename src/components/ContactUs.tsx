import type { ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'

export const CONTACT_PHONE = '+218910461043'
export const CONTACT_WHATSAPP = '+218910461043'
export const CONTACT_EMAIL = 'soultech4vending@gmail.com'

/** Digits only, for tel:/whatsapp links. */
const PHONE_DIGITS = CONTACT_PHONE.replace(/\D/g, '')

/** Official WhatsApp logo (brand color). */
function WhatsAppIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 32 32"
      fill="#25D366"
      aria-hidden="true"
    >
      <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.66-1.75a12.74 12.74 0 0 0 6.14 1.55h.01c7.06 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.05a12.72 12.72 0 0 0-9.05-3.75Zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.95 1.04 1.05-3.85-.25-.4a10.56 10.56 0 0 1-1.63-5.68c0-5.87 4.78-10.64 10.66-10.64 2.84 0 5.52 1.11 7.53 3.12a10.58 10.58 0 0 1 3.12 7.53c0 5.87-4.78 10.64-10.73 10.64Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.45 4.82.76.33 1.36.53 1.82.67.77.25 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  )
}

interface ContactIconProps {
  href: string
  icon: ReactNode
  label: string
  external?: boolean
}

function ContactIcon({ href, icon, label, external = true }: ContactIconProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={label}
      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-brand-600/10 bg-gradient-to-br from-surface to-brand-50/80 px-2 shadow-sm transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md active:scale-95"
    >
      <span className="flex h-6 items-center justify-center text-xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-bold text-ink">{label}</span>
    </a>
  )
}

export function ContactUs() {
  const { t } = useI18n()

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line/70" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          {t('contact.title')}
        </span>
        <span className="h-px flex-1 bg-line/70" aria-hidden="true" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        <ContactIcon
          href={`tel:${CONTACT_PHONE}`}
          icon="📞"
          label={t('contact.call')}
          external={false}
        />
        <ContactIcon
          href={`https://wa.me/${PHONE_DIGITS}`}
          icon={<WhatsAppIcon />}
          label={t('contact.whatsapp')}
        />
        <ContactIcon
          href={`mailto:${CONTACT_EMAIL}`}
          icon="✉️"
          label={t('contact.email')}
        />
      </div>
    </div>
  )
}