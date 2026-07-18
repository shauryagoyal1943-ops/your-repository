export function FullScreenLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ink-50 dark:bg-ink-950">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-ink-800" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-ink-500 dark:text-ink-400 text-sm font-medium">{label}</p>
    </div>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block h-4 w-4 rounded-full border-2 border-brand-600 border-t-transparent animate-spin ${className}`} />
  )
}
