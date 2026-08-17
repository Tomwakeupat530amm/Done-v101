// src/renderer/src/features/habits/StreakCalendar.tsx
// Atomic Recovery — GitHub style contribution graph for habits

import { useMemo } from 'react'
import { startOfYear, endOfYear, eachDayOfInterval, format } from 'date-fns'
import type { HabitLog } from '../../../../shared/types/habit.types'
import { useTranslation } from 'react-i18next'

interface StreakCalendarProps {
  logs: HabitLog[]
  year: number
  color?: string
}

export function StreakCalendar({ logs, year, color = 'var(--color-brand)' }: StreakCalendarProps) {
  const { t } = useTranslation()
  
  // Generate all days for the year
  const daysInYear = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 0, 1))
    return eachDayOfInterval({ start, end })
  }, [year])

  // Map dates to completion status
  const logMap = useMemo(() => {
    const map = new Map<string, boolean>()
    logs.forEach(log => {
      if (log.completed) {
        map.set(log.date, true)
      }
    })
    return map
  }, [logs])

  // Group days into weeks (starting Sunday or Monday depending on locale, we'll just slice into chunks of 7 for MVP or properly pad them)
  const weeks = useMemo(() => {
    const paddedWeeks: Date[][] = []
    let currentWeek: Date[] = []
    
    // Pad start of year
    const startDay = daysInYear[0].getDay() // 0 = Sunday
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(new Date(0)) // dummy date for padding
    }

    daysInYear.forEach(date => {
      currentWeek.push(date)
      if (currentWeek.length === 7) {
        paddedWeeks.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      // Pad end of year
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0))
      }
      paddedWeeks.push(currentWeek)
    }
    
    return paddedWeeks
  }, [daysInYear])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((date, dIdx) => {
              // Padding dates
              if (date.getTime() === 0) {
                return <div key={`pad-${dIdx}`} className="w-3 h-3 rounded-sm bg-transparent" />
              }
              
              const dateStr = format(date, 'yyyy-MM-dd')
              const isCompleted = logMap.has(dateStr)
              
              return (
                <div
                  key={dateStr}
                  title={`${dateStr}: ${isCompleted ? t('habits.completed', 'Completed') : t('habits.missed', 'Missed')}`}
                  className="w-3 h-3 rounded-sm transition-colors"
                  style={{
                    backgroundColor: isCompleted ? color : 'var(--color-surface-overlay)',
                    opacity: isCompleted ? 1 : 0.4
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-[var(--color-text-tertiary)] uppercase font-mono">
        <span>{t('habits.jan', 'Jan')}</span>
        <span>{t('habits.dec', 'Dec')}</span>
      </div>
    </div>
  )
}
