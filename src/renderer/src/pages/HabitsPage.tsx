// src/renderer/src/pages/HabitsPage.tsx
// Atomic Recovery — Habits list and daily tracking

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { HabitCard } from '../features/habits/HabitCard'
import { HabitForm } from '../features/habits/HabitForm'
import type { TodayHabitStatus } from '../../../shared/types/habit.types'

export default function HabitsPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ['habits', 'today'],
    queryFn: () => window.api.habits.getTodayStatus() as Promise<TodayHabitStatus[]>
  })

  const uncompleted = statuses.filter(s => !s.isCompletedToday)
  const completed = statuses.filter(s => s.isCompletedToday)

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {t('habits.title', 'Daily Habits')}
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            {t('habits.subtitle', 'Tiny changes, remarkable results.')}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('habits.newHabit', 'New Habit')}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-[var(--color-surface-raised)] rounded-xl" />
          <div className="h-20 bg-[var(--color-surface-raised)] rounded-xl" />
        </div>
      ) : statuses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--color-surface-border)] rounded-2xl">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">{t('habits.emptyTitle', 'No habits yet')}</h3>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-2 mb-6">
            {t('habits.emptySub', 'Start building your new identity by adding a habit.')}
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--color-surface-overlay)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('habits.createHabit', 'Create Habit')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Uncompleted Habits */}
          {uncompleted.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                {t('habits.todo', 'To Do')}
              </h2>
              <div className="grid gap-3">
                <AnimatePresence>
                  {uncompleted.map(status => (
                    <motion.div
                      key={status.habit.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HabitCard 
                        habit={status.habit as any} 
                        todayLog={status.todayLog} 
                        isCompletedToday={false} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Habits */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {t('habits.completed', 'Completed')}
              </h2>
              <div className="grid gap-3">
                <AnimatePresence>
                  {completed.map(status => (
                    <motion.div
                      key={status.habit.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HabitCard 
                        habit={status.habit as any} 
                        todayLog={status.todayLog} 
                        isCompletedToday={true} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <HabitForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}
