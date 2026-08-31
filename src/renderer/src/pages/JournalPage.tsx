import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { BookOpen } from 'lucide-react'
import type { DailyLog } from '../../../shared/types/daily-log.types'

export default function JournalPage() {
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === 'vi' ? vi : enUS

  const { data: logs = [], isLoading } = useQuery<DailyLog[]>({
    queryKey: ['dailyLog', 'all'],
    queryFn: () => window.api.dailyLog.getAll()
  })

  if (isLoading) return <div className="p-8 text-[var(--color-text-muted)]">{t('common.loading', 'Loading...')}</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
          {t('journal.history', 'Lịch sử Check-in')}
        </h1>
        <p className="text-[var(--color-text-tertiary)]">
          {t('journal.historyDesc', 'Xem lại các ghi chép và cảm xúc của bạn qua từng ngày.')}
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl">
          <BookOpen className="w-12 h-12 text-[var(--color-surface-border)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">{t('journal.empty', 'Chưa có ghi chép nào.')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map(log => {
            const tags = log.emotionTags || []
            const gratitude = log.gratitude || []

            return (
              <div key={log.id} className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-surface-border)] pb-4">
                  <h3 className="font-semibold text-lg text-[var(--color-text-primary)] capitalize">
                    {format(new Date(log.date), 'EEEE, MMMM do, yyyy', { locale: dateLocale })}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    {log.mood !== null && <span>{t('dashboard.mood', 'Tâm trạng')}: {['','😞','😕','😐','😊','😄'][log.mood]}</span>}
                    {log.energy !== null && <span>{t('dashboard.energy', 'Năng lượng')}: {log.energy}/5</span>}
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {log.morningIntention && (
                    <div>
                      <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{t('journal.morningIntention', 'Morning Intention')}</h4>
                      <p className="text-[var(--color-text-primary)] text-sm whitespace-pre-wrap leading-relaxed">{log.morningIntention}</p>
                    </div>
                  )}
                  
                  {gratitude.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{t('journal.gratitude', 'Gratitude')}</h4>
                      <ul className="list-disc list-inside text-[var(--color-text-primary)] text-sm space-y-1">
                        {gratitude.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  )}

                  {log.reflection && (
                    <div className="md:col-span-2 mt-2 pt-4 border-t border-[var(--color-surface-border)] border-dashed">
                      <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">{t('journal.reflection', 'Reflection')}</h4>
                      <p className="text-[var(--color-text-primary)] text-sm whitespace-pre-wrap leading-relaxed">{log.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
