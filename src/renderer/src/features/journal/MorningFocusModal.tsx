import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Sun, Target, ArrowRight } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface MorningFocusModalProps {
  isOpen: boolean
  onClose: () => void
  initialValue?: string | null
  targetDate?: string
}

export function MorningFocusModal({ isOpen, onClose, initialValue, targetDate }: MorningFocusModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const today = targetDate || format(new Date(), 'yyyy-MM-dd')

  const [morningIntention, setMorningIntention] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMorningIntention(initialValue || '')
    }
  }, [isOpen, initialValue])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!morningIntention.trim()) {
      toast.error(t('journal.morningModal.requiredError'))
      return
    }

    setIsSubmitting(true)
    try {
      await window.api.dailyLog.saveMorning(today, morningIntention.trim())
      await queryClient.invalidateQueries({ queryKey: ['dailyLog'] })
      await queryClient.invalidateQueries({ queryKey: ['dailySummary'] })
      toast.success(t('journal.morningModal.saveSuccess'))
      onClose()
    } catch (error) {
      console.error('Failed to save morning focus:', error)
      toast.error('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-surface-border)] bg-gradient-to-r from-amber-500/10 via-transparent to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                {t('journal.morningModal.title')}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {today} • {t('journal.morningModal.subtitle')}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              {t('journal.morningModal.label')}
            </label>
            <p className="text-xs text-[var(--color-text-muted)]">
              {t('journal.morningModal.hint')}
            </p>
            <textarea
              value={morningIntention}
              onChange={(e) => setMorningIntention(e.target.value)}
              placeholder={t('journal.morningModal.placeholder')}
              rows={4}
              autoFocus
              className="w-full px-4 py-3 bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-surface-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)] rounded-xl transition-colors cursor-pointer"
            >
              {t('journal.morningModal.skip')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? t('journal.morningModal.saving') : t('journal.morningModal.submit')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
