// src/renderer/src/features/habits/HabitForm.tsx
// Atomic Recovery — Form to create/edit habits

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import type { CreateHabitDto } from '../../../../shared/types/ipc.types'
import { useTranslation } from 'react-i18next'

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
}

export function HabitForm({ isOpen, onClose }: HabitFormProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('BODY')
  const [color, setColor] = useState('#6366f1') // Default indigo
  const { t } = useTranslation()
  
  const { mutate, isPending } = useMutation({
    mutationFn: (dto: CreateHabitDto) => window.api.habits.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setName('')
      onClose()
    },
    onError: (err) => {
      console.error(err)
      window.api.ping().then(() => console.log('ping ok')).catch(console.error)
      alert(err.message)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    mutate({
      name,
      category,
      color,
      icon: 'star', // Hardcoded icon for MVP, can be expanded later
      frequency: 'DAILY'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)'
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
                {t('habits.createHabitTitle', 'Create Habit')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    {t('habits.habitNameLabel', 'Habit Name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('habits.habitNamePlaceholder', 'e.g. Read 10 pages')}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-surface-border)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      {t('habits.categoryLabel', 'Category')}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-[var(--color-text-primary)] outline-none transition-all"
                      style={{
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-surface-border)'
                      }}
                    >
                      <option value="BODY">{t('habits.categoryBody', 'Body (Health)')}</option>
                      <option value="MIND">{t('habits.categoryMind', 'Mind (Learning)')}</option>
                      <option value="SPIRIT">{t('habits.categorySpirit', 'Spirit (Mindfulness)')}</option>
                      <option value="WEALTH">{t('habits.categoryWealth', 'Wealth (Work/Finance)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      {t('habits.colorLabel', 'Color')}
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!name.trim() || isPending}
                    className="w-full py-2.5 rounded-xl font-medium text-white transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: color }}
                  >
                    {isPending ? t('habits.creatingBtn', 'Creating...') : t('habits.createBtn', 'Create Habit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
