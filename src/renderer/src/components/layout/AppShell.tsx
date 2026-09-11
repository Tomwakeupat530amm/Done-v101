// src/renderer/src/components/layout/AppShell.tsx
// Main app shell: TitleBar + Sidebar + MainContent + Global providers mount point

import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { EveningBanner } from '../../features/journal/EveningBanner'
import { MorningFocusModal } from '../../features/journal/MorningFocusModal'
import { EveningReviewModal } from '../../features/journal/EveningReviewModal'
import type { DailyAccomplishmentSummary } from '../../../../shared/types/daily-log.types'

export function AppShell() {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => window.api.settings.get()
  })

  const { data: summary } = useQuery<DailyAccomplishmentSummary>({
    queryKey: ['dailySummary', todayStr],
    queryFn: () => window.api.dailyLog.getSummary(todayStr)
  })

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => window.api.task.getAll()
  })

  // Synchronize active tasks count with macOS Dock badge
  useEffect(() => {
    if (tasks && window.api?.badge?.updateDock) {
      const activeCount = tasks.filter((t) => t.status !== 'DONE').length
      window.api.badge.updateDock(activeCount).catch(() => {})
    }
  }, [tasks])

  const [isMorningOpen, setIsMorningOpen] = useState(false)
  const [isEveningOpen, setIsEveningOpen] = useState(false)

  // Check on app launch: if morning/daytime and morningIntention not set, prompt once
  useEffect(() => {
    if (!summary) return undefined
    const hour = new Date().getHours()
    const dismissedKey = `done_morning_prompt_${todayStr}`
    const alreadyDismissed = sessionStorage.getItem(dismissedKey) === 'true'

    if (hour < 20 && !summary.log?.morningIntention && !alreadyDismissed) {
      // Small timeout for smooth initial load
      const timer = setTimeout(() => {
        setIsMorningOpen(true)
      }, 600)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [summary, todayStr])

  // Listen for global custom events from JournalPage or other components
  useEffect(() => {
    const handleOpenMorning = () => setIsMorningOpen(true)
    const handleOpenEvening = () => setIsEveningOpen(true)

    window.addEventListener('done:open-morning-focus', handleOpenMorning)
    window.addEventListener('done:open-evening-review', handleOpenEvening)

    return () => {
      window.removeEventListener('done:open-morning-focus', handleOpenMorning)
      window.removeEventListener('done:open-evening-review', handleOpenEvening)
    }
  }, [])

  useEffect(() => {
    if (settings?.accentColor) {
      document.documentElement.style.setProperty('--color-brand', settings.accentColor)
      document.documentElement.style.setProperty('--color-primary', settings.accentColor)
      document.documentElement.style.setProperty('--color-ring', settings.accentColor)
      document.documentElement.style.setProperty('--color-brand-glow', `${settings.accentColor}26`)
    }
    if (settings?.compactMode !== undefined) {
      document.documentElement.classList.toggle('compact-mode', !!settings.compactMode)
    }
  }, [settings?.accentColor, settings?.compactMode])

  const handleCloseMorning = () => {
    sessionStorage.setItem(`done_morning_prompt_${todayStr}`, 'true')
    setIsMorningOpen(false)
  }

  return (
    <div
      className="flex flex-col"
      style={{
        height: '100vh',
        backgroundColor: 'var(--color-surface-base)',
        overflow: 'hidden'
      }}
    >
      {/* Custom title bar */}
      <TitleBar />

      {/* Evening Reminder Banner (active 20:00 - 23:59) */}
      <EveningBanner onOpenReview={() => setIsEveningOpen(true)} />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ backgroundColor: 'var(--color-surface-base)' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Global Morning Focus Modal */}
      <MorningFocusModal
        isOpen={isMorningOpen}
        onClose={handleCloseMorning}
        initialValue={summary?.log?.morningIntention}
        targetDate={todayStr}
      />

      {/* Global Evening Review Modal */}
      <EveningReviewModal
        isOpen={isEveningOpen}
        onClose={() => setIsEveningOpen(false)}
        targetDate={todayStr}
      />
    </div>
  )
}
