import { useI18n } from '../i18n/useI18n'
import squaredLogo from '../assets/squared_logo.png'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export function Logo({ size = 'md', showWordmark = true }: LogoProps) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={squaredLogo}
        alt="Soultech Vending logo"
        className={`${sizeClasses[size]} shrink-0 rounded-xl object-contain drop-shadow-sm`}
      />
      {showWordmark && (
        <div className="leading-tight">
          <p className="text-base font-extrabold tracking-tight text-ink sm:text-lg">
            {t('brand.name')}
          </p>
          <p className="text-xs font-semibold text-muted">{t('brand.tagline')}</p>
        </div>
      )}
    </div>
  )
}