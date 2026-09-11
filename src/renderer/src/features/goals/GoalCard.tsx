import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, Calendar, Edit2, Trash2, Trophy, AlertCircle } from 'lucide-react'
import type { Goal } from '../../../../shared/types/goal.types'
import { format, isPast, isToday, differenceInDays } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onExtend: (goal: Goal) => void
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  RECOVERY: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  HEALTH: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  CAREER: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  PERSONAL: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  GENERAL: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' }
}

export function GoalCard({ goal, onEdit, onDelete, onComplete, onExtend }: GoalCardProps) {
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === 'vi' ? vi : enUS
  const target = new Date(goal.targetDate)
  const isCompleted = goal.status === 'COMPLETED'
  const isDueToday = isToday(target)
  const isOverdue = !isCompleted && isPast(target) && !isDueToday
  const daysDiff = Math.abs(differenceInDays(target, new Date()))

  const catStyle = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.GENERAL

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'RECOVERY': return t('goals.catRecovery')
      case 'HEALTH': return t('goals.catHealth')
      case 'CAREER': return t('goals.catCareer')
      case 'PERSONAL': return t('goals.catPersonal')
      case 'GENERAL': default: return t('goals.catGeneral')
    }
  }

  return (
    <div
      className={`relative group rounded-2xl p-5 border transition-all duration-300 ${
        isCompleted
          ? 'bg-surface-raised/40 border-surface-border opacity-75'
          : isDueToday
          ? 'bg-surface-raised border-amber-500/60 shadow-lg shadow-amber-500/5'
          : isOverdue
          ? 'bg-surface-raised border-rose-500/50 shadow-lg shadow-rose-500/5'
          : 'bg-surface-raised border-surface-border hover:border-brand/40 hover:shadow-xl hover:shadow-black/20'
      }`}
    >
      {/* Top row: Category and Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
          {getCategoryLabel(goal.category)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && (
            <>
              <button
                onClick={() => onComplete(goal.id)}
                className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                title={t('goals.markCompleteTip')}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onExtend(goal)}
                className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                title={t('goals.extendTip')}
              >
                <Clock className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-overlay rounded-lg transition-colors cursor-pointer"
            title={t('goals.editTip')}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(t('goals.confirmDelete'))) {
                onDelete(goal.id)
              }
            }}
            className="p-1.5 text-text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title={t('goals.deleteTip')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Goal Title */}
      <h3 className={`text-base font-bold mb-1.5 flex items-start gap-2 ${
        isCompleted ? 'line-through text-text-muted' : 'text-text-primary'
      }`}>
        {isCompleted && <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-1" />}
        <span>{goal.title}</span>
      </h3>

      {/* Description */}
      {goal.description && (
        <p className="text-xs text-text-secondary line-clamp-2 mb-4">
          {goal.description}
        </p>
      )}

      {/* Target Date & Status Info */}
      <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-text-muted" />
          <span>{t('goals.due')}: {format(target, 'dd/MM/yyyy', { locale: dateLocale })}</span>
        </div>

        {isCompleted ? (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('goals.achieved')}
          </span>
        ) : isDueToday ? (
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            {t('goals.dueToday')}
          </span>
        ) : isOverdue ? (
          <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
            {t('goals.overdueDays', { days: daysDiff })}
          </span>
        ) : (
          <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {t('goals.daysLeft', { days: daysDiff })}
          </span>
        )}
      </div>
    </div>
  )
}
