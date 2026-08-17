// src/renderer/src/components/ui/Skeleton.tsx
// Loading skeleton components

import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded-lg bg-[var(--color-surface-raised)]',
        className
      )}
    />
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${85 - i * 12}%` }} />
      ))}
    </div>
  )
}

export function SkeletonSobriety() {
  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-16 w-48 mx-auto rounded-xl" />
      <Skeleton className="h-3 w-32 mx-auto" />
    </div>
  )
}

export function SkeletonHabitList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-4 bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-xl">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
