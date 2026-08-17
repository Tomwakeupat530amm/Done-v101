import { useState } from 'react'
import { Smile, Meh, Frown, Zap, Battery, BatteryWarning } from 'lucide-react'
import type { LogMoodDto } from '../../../../shared/dtos/mood.dto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

interface MoodPickerProps {
  date?: string // Default to today
  period?: string // MORNING, AFTERNOON, EVENING
  onSuccess?: () => void
}

export function MoodPicker({ date = format(new Date(), 'yyyy-MM-dd'), period = 'MORNING', onSuccess }: MoodPickerProps) {
  const { t } = useTranslation()
  
  const MOODS = [
    { value: 1, icon: <Frown className="w-6 h-6 text-red-500" />, label: t('journal.moods.terrible', 'Terrible') },
    { value: 2, icon: <Frown className="w-6 h-6 text-orange-400" />, label: t('journal.moods.bad', 'Bad') },
    { value: 3, icon: <Meh className="w-6 h-6 text-yellow-400" />, label: t('journal.moods.okay', 'Okay') },
    { value: 4, icon: <Smile className="w-6 h-6 text-lime-400" />, label: t('journal.moods.good', 'Good') },
    { value: 5, icon: <Smile className="w-6 h-6 text-emerald-500" />, label: t('journal.moods.great', 'Great') }
  ]

  const ENERGIES = [
    { value: 1, icon: <BatteryWarning className="w-5 h-5 text-red-500" />, label: t('journal.energies.exhausted', 'Exhausted') },
    { value: 3, icon: <Battery className="w-5 h-5 text-yellow-400" />, label: t('journal.energies.normal', 'Normal') },
    { value: 5, icon: <Zap className="w-5 h-5 text-emerald-500" />, label: t('journal.energies.high', 'High') }
  ]
  const queryClient = useQueryClient()
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [note, setNote] = useState('')

  const logMood = useMutation({
    mutationFn: (data: LogMoodDto) => window.api.mood.log(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods', date] })
      onSuccess?.()
    }
  })

  const handleSubmit = () => {
    if (!mood || !energy) return
    logMood.mutate({
      date,
      period,
      mood,
      energy,
      anxiety: 3,
      focus: 3,
      emotionTags: [],
      note
    })
  }

  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">{t('journal.howAreYou', 'How are you feeling {{period}}?', { period: period.toLowerCase() })}</h3>
        <div className="flex justify-between gap-2">
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl flex-1 transition-all
                ${mood === m.value ? 'bg-white/10 ring-2 ring-[var(--color-brand)]' : 'hover:bg-white/5 grayscale hover:grayscale-0'}
              `}
            >
              {m.icon}
              <span className="text-xs text-[var(--color-text-tertiary)]">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">{t('journal.energyLevel', 'Energy Level')}</h3>
        <div className="flex gap-2">
          {ENERGIES.map(e => (
            <button
              key={e.value}
              onClick={() => setEnergy(e.value)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl flex-1 transition-all
                ${energy === e.value ? 'bg-white/10 ring-2 ring-[var(--color-brand)]' : 'hover:bg-white/5 grayscale hover:grayscale-0'}
              `}
            >
              {e.icon}
              <span className="text-xs text-[var(--color-text-tertiary)]">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('journal.notePlaceholder', 'Any quick notes? (Optional)')}
          className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-xl p-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-20"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!mood || !energy || logMood.isPending}
        className="w-full py-3 bg-[var(--color-brand)] text-white font-medium rounded-xl disabled:opacity-50 hover:bg-[var(--color-brand-hover)] transition-colors"
      >
        {logMood.isPending ? t('journal.loggingMood', 'Logging...') : t('journal.logMoodBtn', 'Log Mood')}
      </button>
    </div>
  )
}
