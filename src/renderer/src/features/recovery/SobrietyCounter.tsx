// src/renderer/src/features/recovery/SobrietyCounter.tsx
// Atomic Recovery — Hero sobriety counter card with milestone progress

import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Flame, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365]

function getNextMilestone(days: number): { target: number; daysLeft: number } | null {
  const next = MILESTONES.find((m) => m > days)
  if (!next) return null
  return { target: next, daysLeft: next - days }
}

export function SobrietyCounter() {
  const { t } = useTranslation()
  const { data: streak } = useQuery({
    queryKey: ['recovery', 'streakDisplay'],
    queryFn: () => window.api.recovery.getStreakDisplay() as Promise<{
      days: number; hours: number; minutes: number; totalSeconds: number
    }>,
    refetchInterval: 60_000 // refresh every 60 seconds
  })

  const days = streak?.days ?? 0
  const hours = streak?.hours ?? 0
  const nextMilestone = getNextMilestone(days)
  const prevMilestone = MILESTONES.filter((m) => m <= days).pop() ?? 0
  const progress = nextMilestone
    ? ((days - prevMilestone) / (nextMilestone.target - prevMilestone)) * 100
    : 100

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.2)'
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}>
            Sobriety Streak
          </span>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}
        >
          Active
        </div>
      </div>

      {/* Counter */}
      <div className="mb-5 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={days}
            initial={{ opacity: 0.6, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-baseline gap-2"
          >
            <span
              className="font-mono font-bold"
              style={{ fontSize: 64, lineHeight: 1, color: '#a78bfa' }}
            >
              {days}
            </span>
            <span
              className="font-mono font-medium text-2xl"
              style={{ color: 'rgba(167,139,250,0.7)' }}
            >
              days
            </span>
          </motion.div>
        </AnimatePresence>
        <div
          className="font-mono text-sm mt-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {hours}h clean today
        </div>
      </div>

      {/* Milestone progress bar */}
      {nextMilestone && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Next: <span className="font-medium text-white">{nextMilestone.target} days</span>
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {nextMilestone.daysLeft} days left
            </span>
          </div>

          {/* Progress track */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>
      )}

      {days >= 365 && (
        <div className="mt-3 text-xs" style={{ color: '#f59e0b' }}>
          {t('recovery.oneYearWin', '🏆 Đã vượt qua 1 năm — bạn là người chiến thắng!')}
        </div>
      )}
    </div>
  )
}
