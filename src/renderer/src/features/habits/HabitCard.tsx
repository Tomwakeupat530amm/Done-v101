import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DynamicIcon } from '../../components/ui/DynamicIcon'
import { Check, Trash2 } from 'lucide-react'
import type { HabitWithStreak, HabitLog } from '../../../../shared/types/habit.types'
import { useTranslation } from 'react-i18next'

interface HabitCardProps {
  habit: HabitWithStreak
  todayLog: HabitLog | null
  isCompletedToday: boolean
  onClick?: () => void
}

export function HabitCard({ habit, isCompletedToday, onClick }: HabitCardProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const { mutate: checkIn } = useMutation({
    mutationFn: () => {
      const todayStr = new Date().toISOString().split('T')[0]
      return window.api.habits.checkIn(habit.id, todayStr)
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['habits', 'today'] })
      const previous = queryClient.getQueryData(['habits', 'today'])
      
      queryClient.setQueryData(['habits', 'today'], (old: any) => {
        if (!old) return old
        return old.map((status: any) => {
          if (status.habit.id === habit.id) {
            const willComplete = !status.isCompletedToday
            return {
              ...status,
              isCompletedToday: willComplete,
              streak: {
                ...status.streak,
                currentStreak: willComplete 
                  ? (status.streak?.currentStreak || 0) + 1 
                  : Math.max(0, (status.streak?.currentStreak || 0) - 1)
              }
            }
          }
          return status
        })
      })
      
      return { previous }
    },
    onError: (_err, _newVal, context) => {
      queryClient.setQueryData(['habits', 'today'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    }
  })

  const { mutate: deleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: () => window.api.habits.delete(habit.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    }
  })

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    checkIn()
  }

  const streakCount = habit.streak?.currentStreak || 0

  return (
    <motion.div
      onClick={() => {
        // Prevent click if confirming delete
        if (isConfirmingDelete) return
        onClick?.()
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsConfirmingDelete(false)
      }}
      className="relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-surface-border)',
        opacity: isCompletedToday ? 0.6 : 1
      }}
      whileHover={{ scale: 0.995, backgroundColor: 'var(--color-surface-overlay)' }}
      whileTap={!isConfirmingDelete ? { scale: 0.98 } : {}}
    >
      {/* Accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: habit.color || 'var(--color-brand)' }}
      />

      <div className="flex items-center gap-4 pl-2">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${habit.color}15`, color: habit.color || 'var(--color-brand)' }}
        >
          <DynamicIcon name={habit.icon || 'circle'} className="w-5 h-5" />
        </div>
        
        <div>
          <h3 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)' }}>
              {t(`habits.category${habit.category}`, habit.category)}
            </span>
            {streakCount > 0 && (
              <span className="font-mono text-[11px] font-bold" style={{ color: '#f59e0b' }}>
                {streakCount}d 🔥
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {isHovered && !isConfirmingDelete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsConfirmingDelete(true)
              }}
              className="p-1.5 rounded-full text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}

          {isConfirmingDelete && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteHabit()
                }}
                disabled={isDeleting}
                className="px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors"
              >
                {t('habits.deleteConfirmYes', 'Xóa')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsConfirmingDelete(false)
                }}
                className="px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)] rounded hover:text-[var(--color-text-primary)] transition-colors"
              >
                {t('habits.deleteConfirmNo', 'Hủy')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkbox */}
        {!isConfirmingDelete && (
          <button
            onClick={handleCheck}
            className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all focus:outline-none"
            style={{
              border: `2px solid ${isCompletedToday ? (habit.color || 'var(--color-surface-border)') : 'var(--color-surface-border)'}`,
              backgroundColor: isCompletedToday ? (habit.color || 'transparent') : 'transparent'
            }}
          >
            <motion.div
              initial={false}
              animate={{ scale: isCompletedToday ? 1 : 0, opacity: isCompletedToday ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
            
            {/* Hover state outline */}
            {!isCompletedToday && isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: habit.color || undefined }}
              />
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
