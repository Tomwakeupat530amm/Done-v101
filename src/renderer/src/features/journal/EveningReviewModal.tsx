import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Moon, CheckCircle2, Sparkles, Target, Flame, ArrowRight } from 'lucide-react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import type { DailyAccomplishmentSummary } from '../../../../shared/types/daily-log.types'

interface EveningReviewModalProps {
  isOpen: boolean
  onClose: () => void
  targetDate?: string
}

export function EveningReviewModal({ isOpen, onClose, targetDate }: EveningReviewModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const today = targetDate || format(new Date(), 'yyyy-MM-dd')

  const { data: summary } = useQuery<DailyAccomplishmentSummary>({
    queryKey: ['dailySummary', today],
    queryFn: () => window.api.dailyLog.getSummary(today),
    enabled: isOpen
  })

  const [reflection, setReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (summary?.log?.reflection) {
      setReflection(summary.log.reflection)
    } else {
      setReflection('')
    }
  }, [summary])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reflection.trim()) {
      toast.error(t('journal.eveningModal.requiredError'))
      return
    }

    setIsSubmitting(true)
    try {
      await window.api.dailyLog.saveEvening(today, reflection.trim())
      await queryClient.invalidateQueries({ queryKey: ['dailyLog'] })
      await queryClient.invalidateQueries({ queryKey: ['dailySummary'] })
      toast.success(t('journal.eveningModal.saveSuccess'))
      onClose()
    } catch (error) {
      console.error('Failed to save evening reflection:', error)
      toast.error('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tasksCount = summary?.completedTasks?.length || 0
  const habitsCount = summary?.completedHabits?.length || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-surface-border)] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                {t('journal.eveningModal.title')}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {today} • {t('journal.eveningModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Morning intention recall */}
          {summary?.log?.morningIntention && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Target className="w-3.5 h-3.5" />
                {t('journal.eveningModal.morningRecall')}
              </div>
              <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                {summary.log.morningIntention}
              </p>
            </div>
          )}

          {/* Today Accomplishments (Tasks & Habits) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {t('journal.eveningModal.accomplishmentsTitle')}
              </h4>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {t('journal.eveningModal.summaryBadge', { tasks: tasksCount, habits: habitsCount })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tasks Box */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-2">
                  <span>{t('journal.eveningModal.tasksHeader')}</span>
                  <span>{tasksCount}</span>
                </div>
                {tasksCount === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] italic py-2">
                    {t('journal.eveningModal.noTasks')}
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {summary?.completedTasks?.map((task) => (
                      <li key={task.id} className="flex items-start gap-2 text-xs text-[var(--color-text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate flex-1 font-medium">{task.title}</span>
                        {task.priority === 'HIGH' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/20">
                            {t('journal.highPriority')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Habits Box */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-2">
                  <span>{t('journal.eveningModal.habitsHeader')}</span>
                  <span>{habitsCount}</span>
                </div>
                {habitsCount === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] italic py-2">
                    {t('journal.eveningModal.noHabits')}
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {summary?.completedHabits?.map((habit) => (
                      <li key={habit.id} className="flex items-center gap-2 text-xs text-[var(--color-text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate flex-1 font-medium">{habit.name}</span>
                        {habit.streak > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-bold flex items-center gap-0.5 border border-amber-500/20">
                            <Flame className="w-3 h-3 text-amber-400" />
                            {habit.streak}d
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Reflection Form */}
          <form id="evening-form" onSubmit={handleSubmit} className="space-y-2 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-400" />
              {t('journal.eveningModal.reflectionLabel')}
            </label>
            <p className="text-xs text-[var(--color-text-muted)]">
              {t('journal.eveningModal.reflectionHint')}
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={t('journal.eveningModal.reflectionPlaceholder')}
              rows={4}
              autoFocus
              className="w-full px-4 py-3 bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-surface-border)] bg-[var(--color-surface-raised)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)] rounded-xl transition-colors cursor-pointer"
          >
            {t('journal.eveningModal.close')}
          </button>
          <button
            type="submit"
            form="evening-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting ? t('journal.eveningModal.saving') : t('journal.eveningModal.submit')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
