// src/renderer/src/pages/DashboardPage.tsx
// Dashboard — Command center. Aggregates all features into one unified view.

import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import {
  Sun, Moon, Sunset, BookOpen, Smile, ArrowRight,
  CheckCircle2, Circle, ShieldCheck
} from 'lucide-react'
import { SobrietyCounter } from '../features/recovery/SobrietyCounter'
import type { TodayHabitStatus } from '../../../shared/types/habit.types'
import type { JournalEntry } from '../../../shared/types/journal.types'
import type { MoodLog } from '../../../shared/types/mood.types'
import type { IdentityProfile } from '../../../shared/types/identity.types'

function getGreeting(t: any): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: t('dashboard.goodMorning', 'Chào buổi sáng'), icon: <Sun className="w-5 h-5 text-amber-400" /> }
  if (hour < 18) return { text: t('dashboard.goodAfternoon', 'Chào buổi chiều'), icon: <Sunset className="w-5 h-5 text-orange-400" /> }
  return { text: t('dashboard.goodEvening', 'Chào buổi tối'), icon: <Moon className="w-5 h-5 text-violet-400" /> }
}

const MOOD_EMOJI = ['', '😞', '😕', '😐', '😊', '😄']

const card = "bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-5"
const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 }
})

export default function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const greeting = getGreeting(t)
  const today = format(new Date(), 'yyyy-MM-dd')

  const { data: habits = [] } = useQuery<TodayHabitStatus[]>({
    queryKey: ['habits', 'todayStatus'],
    queryFn: () => window.api.habits.getTodayStatus()
  })

  const { data: journal } = useQuery<JournalEntry | null>({
    queryKey: ['journal', today],
    queryFn: () => window.api.journal.getByDate(today)
  })

  const { data: moods = [] } = useQuery<MoodLog[]>({
    queryKey: ['moods', today],
    queryFn: () => window.api.mood.getByDate(today)
  })

  const { data: profile } = useQuery<IdentityProfile | null>({
    queryKey: ['identity', 'profile'],
    queryFn: () => window.api.identity.getProfile()
  })

  const completedHabits = habits.filter(h => h.isCompletedToday).length
  const totalHabits = habits.length
  const morningMood = moods.find(m => m.period === 'MORNING')
  const hasJournal = !!journal?.morningIntention

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      {/* Greeting */}
      <div className="flex items-center gap-2.5 pt-1">
        {greeting.icon}
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {greeting.text}{profile?.displayName ? `, ${profile.displayName}` : ''}
        </h1>
      </div>

      {/* Hero: Sobriety Counter */}
      <motion.div {...fadeIn(0)}>
        <SobrietyCounter />
      </motion.div>

      {/* Identity Statement */}
      {profile?.identityStatement && (
        <motion.div {...fadeIn(1)}
          className="border border-indigo-500/20 bg-indigo-500/5 rounded-2xl px-6 py-4 cursor-pointer hover:bg-indigo-500/10 transition-colors"
          onClick={() => navigate('/identity')}
        >
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mb-1">{t('dashboard.iam', 'Tôi là')}</p>
          <p className="text-[var(--color-text-primary)] font-medium leading-relaxed">
            {profile.identityStatement}
          </p>
        </motion.div>
      )}

      {/* Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Habits card */}
        <motion.div {...fadeIn(2)}
          className={`${card} cursor-pointer hover:border-indigo-500/30 transition-colors col-span-1`}
          onClick={() => navigate('/habits')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">{t('nav.habits', 'Thói quen')}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          {totalHabits === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm">{t('dashboard.noHabits', 'Chưa có thói quen nào')}</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {completedHabits}<span className="text-[var(--color-text-muted)] text-lg">/{totalHabits}</span>
              </p>
              <div className="flex gap-1.5 mt-3">
                {habits.slice(0, 8).map(h => (
                  <div
                    key={h.habit.id}
                    title={h.habit.name}
                    className={`w-2 h-2 rounded-full transition-colors ${h.isCompletedToday ? 'bg-indigo-500' : 'bg-[var(--color-surface-border)]'}`}
                  />
                ))}
                {habits.length > 8 && <span className="text-xs text-[var(--color-text-muted)]">+{habits.length - 8}</span>}
              </div>
            </>
          )}
        </motion.div>

        {/* Journal card */}
        <motion.div {...fadeIn(3)}
          className={`${card} cursor-pointer hover:border-violet-500/40 transition-colors`}
          onClick={() => navigate('/journal')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">{t('nav.journal', 'Journal')}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          {hasJournal ? (
            <>
              <p className="text-[var(--color-text-primary)] text-sm leading-relaxed line-clamp-3">
                {journal?.morningIntention}
              </p>
              <div className="flex items-center gap-1.5 mt-3">
                <Circle className="w-2 h-2 fill-violet-500 text-violet-500" />
                <span className="text-xs text-[var(--color-text-muted)]">{journal?.wordCount ?? 0} {t('dashboard.words', 'từ')}</span>
              </div>
            </>
          ) : (
            <p className="text-[var(--color-text-muted)] text-sm">{t('dashboard.notWrittenIntention', 'Chưa viết intention sáng nay')}</p>
          )}
        </motion.div>

        {/* Mood card */}
        <motion.div {...fadeIn(4)}
          className={`${card} cursor-pointer hover:border-cyan-500/40 transition-colors`}
          onClick={() => navigate('/journal')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">{t('dashboard.mood', 'Tâm trạng')}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          {morningMood ? (
            <>
              <p className="text-4xl mb-1">{MOOD_EMOJI[morningMood.mood]}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t('dashboard.energy', 'Năng lượng')}: {morningMood.energy}/5
              </p>
            </>
          ) : (
            <p className="text-[var(--color-text-muted)] text-sm">{t('dashboard.notLoggedMood', 'Chưa log tâm trạng hôm nay')}</p>
          )}
        </motion.div>
      </div>

      {/* Quick habits check-in */}
      {habits.length > 0 && (
        <motion.div {...fadeIn(5)} className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">{t('dashboard.quickCheckin', 'Check-in nhanh')}</h2>
            <button
              onClick={() => navigate('/habits')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              {t('dashboard.viewAll', 'Xem tất cả')} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {habits.slice(0, 5).map(habit => (
              <div key={habit.habit.id} className="flex items-center gap-3 py-1.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${habit.isCompletedToday
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-[var(--color-surface-border)]'}`}
                >
                  {habit.isCompletedToday && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm transition-colors ${habit.isCompletedToday ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'}`}>
                  {habit.habit.name}
                </span>
                {(habit.streak?.currentStreak ?? 0) > 0 && (
                  <span className="ml-auto text-xs text-amber-400">🔥 {habit.streak!.currentStreak}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recovery page link */}
      <motion.div {...fadeIn(6)}
        className={`${card} cursor-pointer hover:border-emerald-500/40 transition-colors flex items-center justify-between`}
        onClick={() => navigate('/recovery')}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('dashboard.recoveryZone', 'Recovery Journey')}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.recoveryZoneSub', 'Xem lịch sử, milestones và thống kê')}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
      </motion.div>
    </motion.div>
  )
}
