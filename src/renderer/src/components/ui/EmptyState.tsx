// src/renderer/src/components/ui/EmptyState.tsx
// Reusable empty state component

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] flex items-center justify-center mb-4 text-[var(--color-text-muted)]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
