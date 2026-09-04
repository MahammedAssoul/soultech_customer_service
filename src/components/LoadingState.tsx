export function LoadingState({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      {label && <p className="text-sm font-medium text-muted">{label}</p>}
      <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
  )
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-line/60 via-soft to-line/60 bg-[length:200%_100%] ${className}`}
    />
  )
}

export function MachineSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <SkeletonBlock className="h-7 w-40" />
      <SkeletonBlock className="h-5 w-32" />
      <div className="mt-4 w-full space-y-4">
        <SkeletonBlock className="h-28 w-full rounded-2xl" />
        <SkeletonBlock className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function RequestedProductsSkeleton() {
  return (
    <div className="space-y-4 py-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card overflow-hidden">
          <SkeletonBlock className="h-36 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TrackSkeleton() {
  return (
    <div className="space-y-5 py-4">
      <div className="flex flex-col items-center gap-2">
        <SkeletonBlock className="h-5 w-28" />
        <SkeletonBlock className="h-8 w-44" />
      </div>
      <SkeletonBlock className="h-40 w-full rounded-2xl" />
      <SkeletonBlock className="h-56 w-full rounded-2xl" />
    </div>
  )
}
