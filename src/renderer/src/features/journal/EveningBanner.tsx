import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Moon, Sparkles, X, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import type { DailyAccomplishmentSummary } from '../../../../shared/types/daily-log.types'

interface EveningBannerProps {
  onOpenReview: () => void
}

export function EveningBanner({ onOpenReview }: EveningBannerProps) {
  const { t } = useTranslation()
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const [isDismissed, setIsDismissed] = useState(false)
  const [isEveningTime, setIsEveningTime] = useState(false)

  // Check if current hour is 20:00 to 23:59
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours()
      setIsEveningTime(hour >= 20 && hour <= 23)
    }
    checkTime()
    const interval = setInterval(checkTime, 60000) // check every minute
    return () => clearInterval(interval)
  }, [])

  const { data: summary } = useQuery<DailyAccomplishmentSummary>({
    queryKey: ['dailySummary', todayStr],
    queryFn: () => window.api.dailyLog.getSummary(todayStr),
    enabled: isEveningTime
  })

  // If already reflected today, or dismissed, or not evening, hide banner
  if (!isEveningTime || isDismissed || summary?.log?.reflection) {
    return null
  }

  const tasksCount = summary?.completedTasks?.length || 0
  const habitsCount = summary?.completedHabits?.length || 0

  return (
    <div className="relative z-40 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-[var(--color-text-primary)] shadow-md animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
          <Moon className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {t('journal.banner.title', { date: todayStr })}
          </span>
          <span className="text-[var(--color-text-secondary)] truncate">
            {t('journal.banner.content', { tasks: tasksCount, habits: habitsCount })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          onClick={onOpenReview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>{t('journal.banner.btn')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-md transition-colors cursor-pointer"
          title={t('journal.banner.hideTip')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
