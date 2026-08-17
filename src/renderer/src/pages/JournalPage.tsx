import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { Check, Loader2 } from 'lucide-react'
import { MoodPicker } from '../features/journal/MoodPicker'
import type { JournalEntry } from '../../../shared/types/journal.types'
import type { SaveJournalDto } from '../../../shared/types/ipc.types'

export default function JournalPage() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const dateLocale = i18n.language === 'vi' ? vi : enUS
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const [formData, setFormData] = useState<Partial<SaveJournalDto>>({
    date: today,
    morningIntention: '',
    morningGratitude: '',
    freeWrite: '',
    eveningReflection: '',
    eveningWins: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const { data: entry, isLoading } = useQuery({
    queryKey: ['journal', today],
    queryFn: () => window.api.journal.getByDate(today) as Promise<JournalEntry | null>
  })

  // Load existing data
  useEffect(() => {
    if (entry) {
      setFormData({
        date: today,
        morningIntention: entry.morningIntention || '',
        morningGratitude: (() => {
          try { return JSON.parse(entry.gratitude).join('\n') } catch { return '' }
        })(),
        freeWrite: entry.freeWrite || '',
        eveningReflection: entry.eveningReflection || '',
        eveningWins: (() => {
          try { return JSON.parse(entry.wins).join('\n') } catch { return '' }
        })()
      })
    }
  }, [entry, today])

  const saveMutation = useMutation({
    mutationFn: (data: SaveJournalDto) => window.api.journal.save(data),
    onMutate: () => setIsSaving(true),
    onSuccess: () => {
      setLastSaved(new Date())
      queryClient.invalidateQueries({ queryKey: ['journal', today] })
    },
    onSettled: () => setIsSaving(false)
  })

  // Debounced Save
  useEffect(() => {
    // Only auto-save if data is loaded and modified
    if (isLoading) return

    const handler = setTimeout(() => {
      saveMutation.mutate(formData as SaveJournalDto)
    }, 2000)

    return () => clearTimeout(handler)
  }, [formData]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field: keyof SaveJournalDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) return <div className="p-8 text-gray-500">{t('journal.loading', 'Loading journal...')}</div>

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
            {t('nav.journal', 'Journal')}
          </h1>
          <p className="text-[var(--color-text-tertiary)] capitalize">{format(new Date(), 'EEEE, MMMM do, yyyy', { locale: dateLocale })}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t('journal.saving', 'Saving...')}</>
          ) : lastSaved ? (
            <><Check className="w-4 h-4 text-emerald-500" /> {t('journal.savedAt', 'Saved at')} {format(lastSaved, 'HH:mm')}</>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Morning Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{t('journal.morningIntention', 'Morning Intention')}</h2>
            <textarea
              placeholder={t('journal.focusPlaceholder', 'What is your main focus for today?')}
              value={formData.morningIntention || ''}
              onChange={e => handleChange('morningIntention', e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-24"
            />
            <textarea
              placeholder={t('journal.gratitudePlaceholder', 'I am grateful for... (one per line)')}
              value={formData.morningGratitude || ''}
              onChange={e => handleChange('morningGratitude', e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-32"
            />
          </section>

          {/* Free Write */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{t('journal.freeWrite', 'Brain Dump / Free Write')}</h2>
            <textarea
              placeholder={t('journal.freeWritePlaceholder', 'Clear your mind. Write anything...')}
              value={formData.freeWrite || ''}
              onChange={e => handleChange('freeWrite', e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-64"
            />
          </section>

          {/* Evening Section */}
          <section className="space-y-4 pt-8 border-t border-[var(--color-surface-border)]">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{t('journal.eveningReflection', 'Evening Reflection')}</h2>
            <textarea
              placeholder={t('journal.winsPlaceholder', '3 Wins for today... (one per line)')}
              value={formData.eveningWins || ''}
              onChange={e => handleChange('eveningWins', e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-32"
            />
            <textarea
              placeholder={t('journal.reflectionPlaceholder', 'How did today go? What could be better?')}
              value={formData.eveningReflection || ''}
              onChange={e => handleChange('eveningReflection', e.target.value)}
              className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-32"
            />
          </section>
        </div>

        {/* Sidebar: Mood */}
        <div className="space-y-8">
          <MoodPicker date={today} period="MORNING" />
          <MoodPicker date={today} period="EVENING" />
        </div>
      </div>
    </div>
  )
}
