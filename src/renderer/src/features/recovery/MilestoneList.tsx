// src/renderer/src/features/recovery/MilestoneList.tsx
// Achieved milestones display for Recovery page

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ALL_MILESTONES = [
  { days: 1, name: 'Ngày Đầu Tiên', emoji: '🌱', xp: 10 },
  { days: 3, name: 'Ba Ngày Kiên Định', emoji: '⚡', xp: 30 },
  { days: 7, name: 'Một Tuần Bản Lĩnh', emoji: '🔥', xp: 70 },
  { days: 14, name: 'Hai Tuần Vững Chắc', emoji: '💪', xp: 140 },
  { days: 30, name: 'Một Tháng Chiến Thắng', emoji: '🏆', xp: 300 },
  { days: 60, name: 'Hai Tháng Tự Do', emoji: '🦋', xp: 600 },
  { days: 90, name: 'Ba Tháng — Thói Quen Mới', emoji: '⭐', xp: 900 },
  { days: 180, name: 'Sáu Tháng — Cuộc Sống Mới', emoji: '🌟', xp: 1800 },
  { days: 365, name: 'Một Năm — Người Mới', emoji: '👑', xp: 3650 }
]

interface MilestoneListProps {
  currentDays: number
}

export function MilestoneList({ currentDays }: MilestoneListProps) {
  const { t } = useTranslation()

  const { data: achieved = [] } = useQuery({
    queryKey: ['recovery', 'milestones'],
    queryFn: () => window.api.recovery.getMilestones() as Promise<Array<{ days: number; achievedAt: Date }>>
  })

  const achievedDays = new Set(achieved.map((m) => m.days))

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-text-muted)' }}>
        {t('recovery.milestonesTitle', 'Milestones')}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {ALL_MILESTONES.map((m, i) => {
          const isAchieved = achievedDays.has(m.days)
          return (
            <motion.div
              key={m.days}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
              style={{
                backgroundColor: isAchieved
                  ? 'rgba(99,102,241,0.1)'
                  : 'var(--color-surface-raised)',
                border: `1px solid ${isAchieved ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                opacity: isAchieved || currentDays >= m.days ? 1 : 0.4
              }}
            >
              <span className="text-2xl">{isAchieved ? m.emoji : <Lock className="w-5 h-5" />}</span>
              <span
                className="text-xs font-medium leading-tight"
                style={{ color: isAchieved ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
              >
                {t(`recovery.milestone_${m.days}`, m.name)}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                {m.days} {t('analytics.days', 'ngày')}
              </span>
              {isAchieved && (
                <div className="flex items-center gap-0.5">
                  <Trophy className="w-3 h-3" style={{ color: '#f59e0b' }} />
                  <span className="text-xs" style={{ color: '#f59e0b' }}>+{m.xp}xp</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
