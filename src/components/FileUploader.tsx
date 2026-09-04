import { useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { photoService } from '../services/photoService'
import type { PhotoResult } from '../services/photoService'

interface FileUploaderProps {
  onUploaded: (url: string | null) => void
}

type UploadState =
  | { phase: 'idle' }
  | { phase: 'compressing' }
  | { phase: 'uploading' }
  | { phase: 'done'; url: string }
  | { phase: 'error'; message: string }

export function FileUploader({ onUploaded }: FileUploaderProps) {
  const { t } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>({ phase: 'idle' })

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setState({ phase: 'compressing' })
    const result: PhotoResult = await photoService.uploadCustomerPhoto(file)

    if (result.ok) {
      setState({ phase: 'done', url: result.url })
      onUploaded(result.url)
    } else {
      const message =
        result.error === 'too_large'
          ? t('common.photoTooLarge')
          : result.error === 'unsupported'
            ? t('common.photoUnsupported')
            : result.error === 'compress_failed'
              ? t('common.photoCompressFailed')
              : t('common.uploadFailed')
      setState({ phase: 'error', message })
      onUploaded(null)
    }
  }

  const remove = () => {
    setState({ phase: 'idle' })
    onUploaded(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = state.phase === 'compressing' || state.phase === 'uploading'

  return (
    <div>
      <span className="mb-1.5 block text-sm font-bold text-ink">
        {t('issue.photoLabel')}
        <span className="ms-1.5 text-xs font-normal text-muted">({t('common.optional')})</span>
      </span>

      {state.phase === 'done' ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-sm">
          <img
            src={state.url}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">✓ {t('issue.photoLabel')}</p>
            <button
              type="button"
              onClick={remove}
              className="mt-1 text-sm font-semibold text-danger hover:underline"
            >
              {t('issue.photoRemove')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-soft px-4 py-4 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <svg
                  className="h-6 w-6 animate-spin text-brand-600"
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
                <span className="text-sm font-medium text-muted">
                  {state.phase === 'compressing'
                    ? t('common.photoCompressing')
                    : t('issue.photoUploading')}
                </span>
              </>
            ) : (
              <>
                <svg
                  className="h-6 w-6 text-brand-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-semibold text-ink">{t('issue.photoHint')}</span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </>
      )}

      {state.phase === 'error' && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {state.message} — {t('issue.photoFailed')}
        </p>
      )}
    </div>
  )
}