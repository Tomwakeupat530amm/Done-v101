// src/renderer/src/pages/AnalyticsPage.tsx
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { Shield, BookOpen, Zap, ListTodo, TrendingUp, Sparkles } from 'lucide-react'
import type { HabitWeekStats, RecoverySummary, JournalStreakData, TaskWeekStats } from '../../../shared/types/ipc.types'

// ─── Task & Pomodoro Bar Chart ──────────────────────────────────────
function TaskBarChart({ days }: { days: { date: string; completedTasks: number; pomodoroCount: number }[] }) {
  const { i18n } = useTranslation()
  const dateLocale = i18n.language === 'vi' ? vi : enUS
  if (!days.length) return null
  const maxTasks = Math.max(...days.map(d => d.completedTasks), 4)

  return (
    <div className="flex items-end gap-2 h-28 pt-2">
      {days.map(d => {
        const heightPct = (d.completedTasks / maxTasks) * 100
        let dayLabel = d.date
        try {
          dayLabel = format(parseISO(d.date), 'EEE', { locale: dateLocale })
        } catch {
          // ignore
        }
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
            {d.pomodoroCount > 0 ? (
              <span className="text-[10px] text-amber-400 font-bold">
                🍅{d.pomodoroCount}
              </span>
            ) : (
              <span className="text-[10px] text-transparent select-none">-</span>
            )}
            <span className="text-xs font-bold text-[var(--color-text-primary)]">
              {d.completedTasks > 0 ? d.completedTasks : ''}
            </span>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.max(heightPct, 6)}%`,
                  backgroundColor: d.completedTasks > 0 ? '#10b981' : 'var(--color-surface-border)'
                }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium capitalize">{dayLabel}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Day Bar Chart (Habits) ────────────────────────────────────────
function DayBarChart({ days }: { days: { date: string; completed: number; total: number }[] }) {
  const { i18n } = useTranslation()
  const dateLocale = i18n.language === 'vi' ? vi : enUS
  if (!days.length) return null
  return (
    <div className="flex items-end gap-1.5 h-16">
      {days.map(d => {
        const pct = d.total > 0 ? (d.completed / d.total) * 100 : 0
        const dayLabel = format(parseISO(d.date), 'EEE', { locale: dateLocale }).slice(0, i18n.language === 'vi' ? 2 : 3)
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t transition-all"
                style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: pct >= 80 ? '#10b981' : pct >= 50 ? '#6366f1' : '#f59e0b' }}
              />
            </div>
            <span className="text-[9px] text-[var(--color-text-muted)]">{dayLabel}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({ icon, label, value, sub, color = '#6366f1' }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</p>
      {sub && <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>}
    </div>
  )
}

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.07 }
})

export default function AnalyticsPage() {
  const { t } = useTranslation()
  
  const { data: taskStats } = useQuery<TaskWeekStats>({
    queryKey: ['analytics', 'taskWeek'],
    queryFn: () => window.api.analytics.getTaskWeekStats(7)
  })

  const { data: habitStats } = useQuery<HabitWeekStats>({
    queryKey: ['analytics', 'habitWeek'],
    queryFn: () => window.api.analytics.getHabitWeekStats()
  })

  const { data: recovery } = useQuery<RecoverySummary>({
    queryKey: ['analytics', 'recoverySummary'],
    queryFn: () => window.api.analytics.getRecoverySummary()
  })

  const { data: journal } = useQuery<JournalStreakData>({
    queryKey: ['analytics', 'journalStreak'],
    queryFn: () => window.api.analytics.getJournalStreak()
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">{t('analytics.title', 'Analytics')}</h1>
        <p className="text-[var(--color-text-tertiary)]">{t('analytics.subtitle', 'Hiệu suất công việc, thói quen và hành trình phục hồi của bạn.')}</p>
      </div>

      {/* Stat summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div {...fadeIn(0)}>
          <StatCard
            icon={<ListTodo className="w-4 h-4" />}
            label={t('analytics.tasksDoneWeek', 'Tasks 7 ngày')}
            value={taskStats?.totalCompleted ?? 0}
            sub={t('analytics.pomodoroWeek', '🍅 {{count}} Pomodoro', { count: taskStats?.totalPomodoro ?? 0 })}
            color="#10b981"
          />
        </motion.div>
        <motion.div {...fadeIn(1)}>
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label={t('analytics.habitWeek', 'Habit tuần này')}
            value={`${habitStats?.completionRate ?? 0}%`}
            sub={t('analytics.habitWeekSub', '{{completed}}/{{total}} hoàn thành', { completed: habitStats?.totalCompleted ?? 0, total: habitStats?.totalPossible ?? 0 })}
            color="#f59e0b"
          />
        </motion.div>
        <motion.div {...fadeIn(2)}>
          <StatCard
            icon={<BookOpen className="w-4 h-4" />}
            label={t('analytics.journalStreak', 'Journal streak')}
            value={journal?.streak ?? 0}
            sub={t('analytics.journalStreakSub', '{{total}} ngày ghi chép', { total: journal?.totalEntries ?? 0 })}
            color="#8b5cf6"
          />
        </motion.div>
        <motion.div {...fadeIn(3)}>
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label={t('analytics.milestones', 'Milestones')}
            value={recovery?.milestonesEarned ?? '—'}
            sub={t('analytics.milestonesSub', 'Cột mốc đã đạt')}
            color="#06b6d4"
          />
        </motion.div>
      </div>

      {/* Task & Pomodoro Productivity Trend */}
      <motion.div {...fadeIn(4)}
        className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {t('analytics.taskProductivity', 'Năng suất Tasks & Pomodoro 7 ngày qua')}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {t('analytics.taskProductivitySub', 'Số task hoàn thành và phiên tập trung mỗi ngày')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-emerald-400">
              {taskStats?.totalCompleted ?? 0} <span className="text-xs text-[var(--color-text-muted)] font-normal">Tasks Done</span>
            </span>
            {(taskStats?.totalPomodoro ?? 0) > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                🍅 {taskStats?.totalPomodoro} Pomodoro
              </span>
            )}
          </div>
        </div>

        {taskStats?.byDay && <TaskBarChart days={taskStats.byDay} />}

        <div className="mt-4 pt-3 border-t border-[var(--color-surface-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>🎯 Tổng kết 7 ngày gần nhất</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {taskStats?.totalCompleted ?? 0} mục tiêu đã hoàn tất
          </span>
        </div>
      </motion.div>

      {/* Habit week */}
      <motion.div {...fadeIn(5)}
        className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('analytics.habitWeekThisWeek', 'Habits tuần này')}</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{habitStats?.habitCount ?? 0} {t('analytics.activeHabits', 'habits đang active')}</p>
          </div>
          <span className="text-2xl font-bold text-[var(--color-text-primary)]">
            {habitStats?.completionRate ?? 0}<span className="text-sm text-[var(--color-text-muted)]">%</span>
          </span>
        </div>
        {habitStats?.byDay && <DayBarChart days={habitStats.byDay} />}
        <div className="flex gap-4 mt-4 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-emerald-500" />
            ≥ 80%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-indigo-500" />
            50–79%
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded bg-amber-500" />
            &lt; 50%
          </div>
        </div>
      </motion.div>

      {/* Recovery stats */}
      {recovery && (
        <motion.div {...fadeIn(6)}
          className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6"
        >
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">{t('analytics.recoveryStats', 'Recovery Stats')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: t('analytics.milestonesEarned', 'Milestones đạt được'), value: recovery.milestonesEarned },
              { label: t('analytics.nextMilestone', 'Milestone tiếp theo'), value: recovery.nextMilestone ? `${recovery.nextMilestone} ${t('analytics.days', 'ngày')}` : t('analytics.all', 'Tất cả!') },
              { label: t('analytics.longestStreak', 'Streak dài nhất'), value: `${recovery.longestStreak} ${t('analytics.days', 'ngày')}` },
              { label: t('analytics.totalRelapses', 'Tổng relapses'), value: recovery.totalRelapses },
              { label: t('analytics.urgesResisted', 'Cơn thèm đã vượt'), value: recovery.urgeStats.resisted },
              { label: t('analytics.resistanceRate', 'Tỉ lệ kháng cự'), value: `${recovery.urgeStats.resistanceRate}%` },
            ].map(item => (
              <div key={item.label} className="bg-[var(--color-surface-overlay)] rounded-xl p-3">
                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-lg font-bold text-[var(--color-text-primary)]">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
