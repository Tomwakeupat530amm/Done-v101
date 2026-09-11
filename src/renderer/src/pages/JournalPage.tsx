import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format, isThisWeek, isThisMonth, parseISO } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import {
  BookOpen,
  Sun,
  Moon,
  Target,
  CheckCircle2,
  Flame,
  Search,
  Calendar,
  Filter,
  Sparkles,
  Edit3,
  X
} from 'lucide-react'
import type { DailyAccomplishmentSummary } from '../../../shared/types/daily-log.types'
import { MorningFocusModal } from '../features/journal/MorningFocusModal'
import { EveningReviewModal } from '../features/journal/EveningReviewModal'

type TimeFilter = 'ALL' | 'WEEK' | 'MONTH'
type ContentFilter = 'ALL' | 'HAS_NOTES' | 'HAS_ACCOMPLISHMENTS'

export default function JournalPage() {
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === 'vi' ? vi : enUS
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL')
  const [contentFilter, setContentFilter] = useState<ContentFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals for editing past or specific days
  const [editingMorningDate, setEditingMorningDate] = useState<string | null>(null)
  const [editingEveningDate, setEditingEveningDate] = useState<string | null>(null)

  const { data: feed = [], isLoading } = useQuery<DailyAccomplishmentSummary[]>({
    queryKey: ['dailyLog', 'feed'],
    queryFn: () => window.api.dailyLog.getAllFeed()
  })

  // Filter feed items
  const filteredFeed = useMemo(() => {
    return feed.filter((item) => {
      const itemDate = parseISO(item.date)

      // 1. Time filter
      if (timeFilter === 'WEEK' && !isThisWeek(itemDate, { weekStartsOn: 1 })) {
        return false
      }
      if (timeFilter === 'MONTH' && !isThisMonth(itemDate)) {
        return false
      }

      // 2. Content filter
      const hasNotes = !!item.log?.morningIntention || !!item.log?.reflection
      const hasAccomplishments = (item.completedTasks?.length || 0) > 0 || (item.completedHabits?.length || 0) > 0

      if (contentFilter === 'HAS_NOTES' && !hasNotes) {
        return false
      }
      if (contentFilter === 'HAS_ACCOMPLISHMENTS' && !hasAccomplishments) {
        return false
      }

      // 3. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchMorning = item.log?.morningIntention?.toLowerCase().includes(query)
        const matchReflection = item.log?.reflection?.toLowerCase().includes(query)
        const matchTasks = item.completedTasks?.some((t) => t.title.toLowerCase().includes(query))
        const matchHabits = item.completedHabits?.some((h) => h.name.toLowerCase().includes(query))

        if (!matchMorning && !matchReflection && !matchTasks && !matchHabits) {
          return false
        }
      }

      return true
    })
  }, [feed, timeFilter, contentFilter, searchQuery])

  if (isLoading) {
    return <div className="p-8 text-[var(--color-text-muted)]">{t('common.loading', 'Loading...')}</div>
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-7 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1.5 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            {t('journal.title')}
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {t('journal.subtitle')}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setEditingMorningDate(todayStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-text-primary)] hover:border-amber-500/50 hover:bg-amber-500/10 transition-all shadow-sm cursor-pointer"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{t('journal.morningGoalBtn')}</span>
          </button>
          <button
            onClick={() => setEditingEveningDate(todayStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Moon className="w-4 h-4" />
            <span>{t('journal.eveningReviewBtn')}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Time range toggle */}
          <div className="flex items-center gap-1 bg-[var(--color-surface-base)] p-1 rounded-xl border border-[var(--color-surface-border)] self-start">
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t('journal.all')}
            </button>
            <button
              onClick={() => setTimeFilter('WEEK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeFilter === 'WEEK'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t('journal.thisWeek')}
            </button>
            <button
              onClick={() => setTimeFilter('MONTH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeFilter === 'MONTH'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t('journal.thisMonth')}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('journal.searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] rounded-xl text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--color-surface-border)]/60 text-xs">
          <span className="text-[var(--color-text-muted)] flex items-center gap-1 font-medium mr-1">
            <Filter className="w-3 h-3" /> {t('journal.filterLabel')}
          </span>
          <button
            onClick={() => setContentFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              contentFilter === 'ALL'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t('journal.filterAll')}
          </button>
          <button
            onClick={() => setContentFilter('HAS_ACCOMPLISHMENTS')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              contentFilter === 'HAS_ACCOMPLISHMENTS'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t('journal.filterAccomplishments')}
          </button>
          <button
            onClick={() => setContentFilter('HAS_NOTES')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              contentFilter === 'HAS_NOTES'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t('journal.filterNotes')}
          </button>
        </div>
      </div>

      {/* Feed List */}
      {filteredFeed.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6">
          <Calendar className="w-12 h-12 text-[var(--color-surface-border)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            {t('journal.emptyFeed')}
          </p>
          {(searchQuery || timeFilter !== 'ALL' || contentFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setTimeFilter('ALL')
                setContentFilter('ALL')
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all border border-indigo-500/20 cursor-pointer"
            >
              {t('journal.resetFilter')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFeed.map((item) => {
            const isToday = item.date === todayStr
            const tasksCount = item.completedTasks?.length || 0
            const habitsCount = item.completedHabits?.length || 0
            const parsedDate = parseISO(item.date)

            return (
              <div
                key={item.date}
                className={`rounded-2xl p-6 space-y-5 transition-all shadow-sm ${
                  isToday
                    ? 'bg-gradient-to-b from-[var(--color-surface-raised)] to-[var(--color-surface-base)] border border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-indigo-500/5'
                    : 'bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] hover:border-[var(--color-surface-border)]/80'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-surface-border)] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)] capitalize">
                      {format(parsedDate, 'EEEE, dd MMMM, yyyy', { locale: dateLocale })}
                    </h3>
                    {isToday && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {t('journal.today')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      {tasksCount} Tasks • {habitsCount} Habits
                    </span>
                    <button
                      onClick={() => {
                        setEditingMorningDate(item.date)
                      }}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-amber-400 hover:bg-[var(--color-surface-overlay)] rounded-lg transition-colors cursor-pointer"
                      title={t('journal.morningGoalBtn')}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingEveningDate(item.date)
                      }}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-indigo-400 hover:bg-[var(--color-surface-overlay)] rounded-lg transition-colors cursor-pointer"
                      title={t('journal.eveningReviewBtn')}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Block 1: Morning Intention */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      {t('journal.morningTargetSet')}
                    </h4>
                  </div>
                  {item.log?.morningIntention ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                      {item.log.morningIntention}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[var(--color-surface-base)] border border-dashed border-[var(--color-surface-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                      <span>{t('journal.noMorningTarget')}</span>
                      {isToday && (
                        <button
                          onClick={() => setEditingMorningDate(todayStr)}
                          className="text-amber-400 hover:underline font-semibold cursor-pointer"
                        >
                          {t('journal.setMorningNow')}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Block 2: Actual Accomplishments (Tasks + Habits) */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('journal.actualAccomplishments')}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Tasks Done Box */}
                    <div className="p-3.5 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)]/70 pb-1.5">
                        <span>{t('journal.tasksDoneHeader')}</span>
                        <span className="text-emerald-400 font-bold">{tasksCount}</span>
                      </div>
                      {tasksCount === 0 ? (
                        <p className="text-xs text-[var(--color-text-muted)] italic py-1">
                          {t('journal.noTasksDone')}
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {item.completedTasks.map((tItem) => (
                            <li key={tItem.id} className="flex items-center gap-2 text-xs text-[var(--color-text-primary)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="truncate flex-1 font-medium">{tItem.title}</span>
                              {tItem.priority === 'HIGH' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/20">
                                  {t('journal.highPriority')}
                                </span>
                              )}
                              {tItem.pomodoroSessions > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
                                  🍅 {tItem.pomodoroSessions}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Habits Done Box */}
                    <div className="p-3.5 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)]/70 pb-1.5">
                        <span>{t('journal.habitsDoneHeader')}</span>
                        <span className="text-indigo-400 font-bold">{habitsCount}</span>
                      </div>
                      {habitsCount === 0 ? (
                        <p className="text-xs text-[var(--color-text-muted)] italic py-1">
                          {t('journal.noHabitsDone')}
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {item.completedHabits.map((h) => (
                            <li key={h.id} className="flex items-center gap-2 text-xs text-[var(--color-text-primary)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                              <span className="truncate flex-1 font-medium">{h.name}</span>
                              {h.streak > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-bold flex items-center gap-0.5 border border-amber-500/20">
                                  <Flame className="w-3 h-3 text-amber-400" />
                                  {h.streak}d
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Block 3: Evening Reflection */}
                <div className="space-y-1.5 pt-1 border-t border-[var(--color-surface-border)]/60">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    {t('journal.eveningReflectionHeader')}
                  </h4>
                  {item.log?.reflection ? (
                    <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                      {item.log.reflection}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[var(--color-surface-base)] border border-dashed border-[var(--color-surface-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                      <span>{t('journal.noEveningReflection')}</span>
                      {isToday && (
                        <button
                          onClick={() => setEditingEveningDate(todayStr)}
                          className="text-purple-400 hover:underline font-semibold cursor-pointer"
                        >
                          {t('journal.writeEveningNow')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Target Date Morning Focus Modal */}
      <MorningFocusModal
        isOpen={!!editingMorningDate}
        onClose={() => setEditingMorningDate(null)}
        initialValue={
          feed.find((item) => item.date === editingMorningDate)?.log?.morningIntention
        }
        targetDate={editingMorningDate || todayStr}
      />

      {/* Target Date Evening Review Modal */}
      <EveningReviewModal
        isOpen={!!editingEveningDate}
        onClose={() => setEditingEveningDate(null)}
        targetDate={editingEveningDate || todayStr}
      />
    </div>
  )
}
