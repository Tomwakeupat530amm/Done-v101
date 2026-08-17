// src/renderer/src/pages/RecoveryPage.tsx
// Full Recovery page: sobriety counter + relapse button + milestone list

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SobrietyCounter } from '../features/recovery/SobrietyCounter'
import { MilestoneList } from '../features/recovery/MilestoneList'
import { RelapseModal } from '../features/recovery/RelapseModal'
import { AlertTriangle, Clock } from 'lucide-react'

export default function RecoveryPage() {
  const { t, i18n } = useTranslation()
  const [relapseOpen, setRelapseOpen] = useState(false)

  const { data: streak } = useQuery({
    queryKey: ['recovery', 'streakDisplay'],
    queryFn: () => window.api.recovery.getStreakDisplay() as Promise<{
      days: number; hours: number; minutes: number
    }>
  })

  const { data: history = [] } = useQuery({
    queryKey: ['recovery', 'relapseHistory'],
    queryFn: () => window.api.recovery.getRelapseHistory(5) as Promise<Array<{
      id: string; occurredAt: Date; triggerType: string | null
    }>>
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {t('nav.recovery', 'Recovery')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('recovery.description', 'Hành trình của bạn — mỗi giây đều có ý nghĩa.')}
        </p>
      </div>

      {/* Hero: Sobriety Counter */}
      <SobrietyCounter />

      {/* Relapse logging */}
      <div
        className="p-4 rounded-xl flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-surface-border)'
        }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {t('recovery.whatHappened', 'Có chuyện gì xảy ra?')}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {t('recovery.whatHappenedSub', 'Không phán xét. Chỉ là dữ liệu để học từ đó.')}
          </p>
        </div>
        <button
          onClick={() => setRelapseOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)'
          }}
        >
          <AlertTriangle className="w-4 h-4" />
          {t('recovery.logRelapse', 'Log Relapse')}
        </button>
      </div>

      {/* Milestones */}
      <MilestoneList currentDays={streak?.days ?? 0} />

      {/* Recent relapse history */}
      {history.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-text-muted)' }}>
            {t('recovery.history', 'Relapse History')}
          </h3>
          <div className="space-y-2">
            {history.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-surface-border)'
                }}
              >
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(r.occurredAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium mr-1 text-[var(--color-text-secondary)]">{t('recovery.trigger', 'Nguyên nhân kích hoạt')}:</span>
                    {r.triggerType ? t(`recovery.trigger_${r.triggerType.toLowerCase()}`, r.triggerType) : t('recovery.noTrigger', 'Không rõ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relapse modal */}
      <RelapseModal isOpen={relapseOpen} onClose={() => setRelapseOpen(false)} />
    </motion.div>
  )
}
