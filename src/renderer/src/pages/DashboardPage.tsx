import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import {
  Sun, Moon, Sunset, BookOpen, ArrowRight,
  CheckCircle2, ShieldCheck, ListTodo
} from 'lucide-react'
import { SobrietyCounter } from '../features/recovery/SobrietyCounter'
import type { TodayHabitStatus } from '../../../shared/types/habit.types'
import type { IdentityProfile } from '../../../shared/types/identity.types'
import type { Task } from '../../../shared/types/task.types'
import type { DailyAccomplishmentSummary } from '../../../shared/types/daily-log.types'

function getGreeting(t: any): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: t('dashboard.goodMorning', 'Chào buổi sáng'), icon: <Sun className="w-5 h-5 text-amber-400" /> }
  if (hour < 18) return { text: t('dashboard.goodAfternoon', 'Chào buổi chiều'), icon: <Sunset className="w-5 h-5 text-orange-400" /> }
  return { text: t('dashboard.goodEvening', 'Chào buổi tối'), icon: <Moon className="w-5 h-5 text-violet-400" /> }
}

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

  const { data: summary } = useQuery<DailyAccomplishmentSummary>({
    queryKey: ['dailySummary', today],
    queryFn: () => window.api.dailyLog.getSummary(today)
  })

  const { data: profile } = useQuery<IdentityProfile | null>({
    queryKey: ['identity', 'profile'],
    queryFn: () => window.api.identity.getProfile()
  })

  const { data: dashboardTasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => window.api.task.getDashboardTasks()
  })

  const completedHabits = habits.filter(h => h.isCompletedToday).length
  const totalHabits = habits.length
  const completedTasks = summary?.completedTasks || []
  const completedTasksCount = completedTasks.length
  const totalPomodoros = completedTasks.reduce((acc, t) => acc + (t.pomodoroSessions || 0), 0)
  const hasJournal = !!summary?.log?.morningIntention

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

        {/* Tasks Done card */}
        <motion.div {...fadeIn(3)}
          className={`${card} cursor-pointer hover:border-emerald-500/40 transition-colors`}
          onClick={() => navigate('/tasks')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">{t('dashboard.tasksDone', 'Tasks Done')}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          {completedTasksCount === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm">{t('dashboard.noTasksDone', 'Chưa hoàn thành task nào hôm nay')}</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                {completedTasksCount} <span className="text-emerald-400 text-lg font-semibold">Done</span>
              </p>
              <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5 mt-2">
                {totalPomodoros > 0 ? (
                  <span className="text-amber-400 font-medium">🍅 {totalPomodoros} Pomodoro tập trung</span>
                ) : (
                  <span>Đã chuyển sang DONE hôm nay</span>
                )}
              </p>
            </>
          )}
        </motion.div>

        {/* Journal card */}
        <motion.div {...fadeIn(4)}
          className={`${card} cursor-pointer hover:border-violet-500/40 transition-colors`}
          onClick={() => navigate('/journal')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">{t('nav.journal', 'Nhật ký')}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          {hasJournal ? (
            <>
              <p className="text-[var(--color-text-primary)] text-sm leading-relaxed line-clamp-2">
                {summary?.log?.morningIntention}
              </p>
              <p className="text-[10px] text-amber-400/90 mt-2 font-medium">
                🎯 Mục tiêu trọng tâm hôm nay
              </p>
            </>
          ) : (
            <>
              <p className="text-[var(--color-text-muted)] text-sm">{t('dashboard.notWrittenIntention', 'Chưa viết mục tiêu sáng nay')}</p>
              <p className="text-[10px] text-indigo-400 mt-2 font-medium">+ Bấm để mở nhật ký</p>
            </>
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

      {/* Focus Today (Tasks) */}
      {dashboardTasks.length > 0 && (
        <motion.div {...fadeIn(5.5)} className={card}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Focus Today</h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              {t('dashboard.viewAll', 'Xem tất cả')} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {dashboardTasks.map(task => (
              <div key={task.id} className="flex flex-col py-1.5 border-b border-surface-border last:border-0 cursor-pointer hover:bg-surface-overlay px-2 -mx-2 rounded transition-colors" onClick={() => navigate('/tasks')}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                  <span className="text-sm text-text-primary font-medium">{task.title}</span>
                </div>
                {task.description && (
                  <span className="text-xs text-text-muted mt-1 ml-4 line-clamp-1">{task.description}</span>
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
