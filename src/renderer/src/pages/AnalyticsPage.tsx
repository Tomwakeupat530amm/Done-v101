// src/renderer/src/pages/AnalyticsPage.tsx
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus, Shield, BookOpen, Target, Zap } from 'lucide-react'
import type { MoodTrendDay, HabitWeekStats, RecoverySummary, JournalStreakData } from '../../../shared/types/ipc.types'

// ─── Mini SVG Line Chart ───────────────────────────────────────────
function MiniLineChart({ data, color = '#6366f1' }: { data: (number | null)[]; color?: string }) {
  const { t } = useTranslation()
  const values = data.filter(v => v !== null) as number[]
  if (values.length < 2) return <div className="h-16 flex items-center justify-center text-xs text-[var(--color-text-muted)]">{t('analytics.notEnoughData', 'Chưa đủ dữ liệu')}</div>

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const W = 280, H = 64, PAD = 8

  const points = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: v !== null ? H - PAD - ((v - min) / range) * (H - PAD * 2) : null
  }))

  const path = points
    .filter(p => p.y !== null)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`}
        fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => p.y !== null ? (
        <circle key={i} cx={p.x} cy={p.y!} r="3" fill={color} />
      ) : null)}
    </svg>
  )
}

// ─── Day Bar Chart ─────────────────────────────────────────────────
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

const MOOD_LABEL: Record<number, string> = { 1: 'Rất tệ', 2: 'Không tốt', 3: 'Bình thường', 4: 'Tốt', 5: 'Tuyệt vời' }
const MOOD_COLOR: Record<number, string> = { 1: '#f43f5e', 2: '#f97316', 3: '#f59e0b', 4: '#6366f1', 5: '#10b981' }

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
  
  const { data: moodTrend = [] } = useQuery<MoodTrendDay[]>({
    queryKey: ['analytics', 'moodTrend'],
    queryFn: () => window.api.analytics.getMoodTrend(7)
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

  const moodValues = moodTrend.map(d => d.avgMood)
  const moodDates = moodTrend.map(d => {
    try { return format(parseISO(d.date), 'd/M') } catch { return d.date }
  })

  const avgMood = moodValues.filter(Boolean).length > 0
    ? (moodValues.filter(Boolean) as number[]).reduce((a, b) => a + b, 0) / moodValues.filter(Boolean).length
    : null

  const moodTrending = moodValues.length >= 2
    ? (moodValues.at(-1) ?? 0) - (moodValues.at(0) ?? 0)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8 pb-24"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">{t('analytics.title', 'Analytics')}</h1>
        <p className="text-[var(--color-text-tertiary)]">{t('analytics.subtitle', 'Xu hướng tâm trạng, thói quen, và hành trình phục hồi.')}</p>
      </div>

      {/* Stat summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div {...fadeIn(0)}>
          <StatCard
            icon={<Shield className="w-4 h-4" />}
            label={t('analytics.milestones', 'Milestones')}
            value={recovery?.milestonesEarned ?? '—'}
            sub={t('analytics.milestonesSub', 'Cột mốc đã đạt')}
            color="#10b981"
          />
        </motion.div>
        <motion.div {...fadeIn(1)}>
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label={t('analytics.urgeResist', 'Urge resist')}
            value={`${recovery?.urgeStats.resistanceRate ?? 0}%`}
            sub={t('analytics.urgeResistSub', '{{resisted}}/{{total}} lần', { resisted: recovery?.urgeStats.resisted ?? 0, total: recovery?.urgeStats.total ?? 0 })}
            color="#6366f1"
          />
        </motion.div>
        <motion.div {...fadeIn(2)}>
          <StatCard
            icon={<BookOpen className="w-4 h-4" />}
            label={t('analytics.journalStreak', 'Journal streak')}
            value={journal?.streak ?? 0}
            sub={t('analytics.journalStreakSub', '{{total}} entries tổng', { total: journal?.totalEntries ?? 0 })}
            color="#8b5cf6"
          />
        </motion.div>
        <motion.div {...fadeIn(3)}>
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label={t('analytics.habitWeek', 'Habit tuần này')}
            value={`${habitStats?.completionRate ?? 0}%`}
            sub={t('analytics.habitWeekSub', '{{completed}}/{{total}} hoàn thành', { completed: habitStats?.totalCompleted ?? 0, total: habitStats?.totalPossible ?? 0 })}
            color="#f59e0b"
          />
        </motion.div>
      </div>

      {/* Mood trend */}
      <motion.div {...fadeIn(4)}
        className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t('analytics.moodTrend', 'Tâm trạng 7 ngày qua')}</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('analytics.moodTrendSub', 'Trung bình mỗi ngày')}</p>
          </div>
          <div className="flex items-center gap-2">
            {avgMood !== null && (
              <span className="text-lg font-bold" style={{ color: MOOD_COLOR[Math.round(avgMood)] }}>
                {avgMood.toFixed(1)}
              </span>
            )}
            {moodTrending > 0.3 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
            {moodTrending < -0.3 && <TrendingDown className="w-4 h-4 text-rose-500" />}
            {Math.abs(moodTrending) <= 0.3 && <Minus className="w-4 h-4 text-[var(--color-text-muted)]" />}
          </div>
        </div>
        <MiniLineChart data={moodValues} color="#8b5cf6" />
        <div className="flex justify-between mt-2">
          {moodDates.map((d, i) => (
            <span key={i} className="text-[9px] text-[var(--color-text-muted)]">{d}</span>
          ))}
        </div>
        {avgMood !== null && (
          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            {t('analytics.avgMood', 'Tâm trạng trung bình:')} <span style={{ color: MOOD_COLOR[Math.round(avgMood)] }}>{t(`journal.moods.${['', 'terrible', 'bad', 'okay', 'good', 'great'][Math.round(avgMood)]}`, MOOD_LABEL[Math.round(avgMood)])}</span>
          </p>
        )}
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
