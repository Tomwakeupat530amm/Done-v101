// src/renderer/src/App.tsx
// Atomic Recovery — Root App component
// Block 2: React Router + AppShell + Global Providers

import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { QueryProvider } from './providers/QueryProvider'
import { AppShell } from './components/layout/AppShell'
import { EmergencyOverlay } from './features/emergency/EmergencyOverlay'
import { LockScreen } from './components/LockScreen'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { useLockStore } from './stores/lockStore'

// Lazy-loaded pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const RecoveryPage = lazy(() => import('./pages/RecoveryPage'))
const HabitsPage = lazy(() => import('./pages/HabitsPage'))
const JournalPage = lazy(() => import('./pages/JournalPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const TasksPage = lazy(() => import('./pages/TasksPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

import { PomodoroBar } from './features/tasks/PomodoroBar'
import { DueGoalModal } from './features/goals/DueGoalModal'
import { QuickAddModal } from './components/QuickAddModal'
import { useState } from 'react'
import type { Goal } from '../../shared/types/goal.types'

// Loading fallback — minimal to avoid flash
function PageLoader() {
  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ color: 'var(--color-text-muted)' }}
    >
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}
      />
    </div>
  )
}

export default function App() {
  const { isLocked, lock } = useLockStore()
  const { i18n } = useTranslation()

  const [activeDueGoal, setActiveDueGoal] = useState<Goal | null>(null)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

  // Listen for quick-add global shortcut & in-app shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    window.api.onQuickAdd(() => {
      setIsQuickAddOpen(true)
    })

    const handleInAppShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsQuickAddOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleInAppShortcut)
    return () => window.removeEventListener('keydown', handleInAppShortcut)
  }, [])

  // Check PIN, settings and due goals on startup
  useEffect(() => {
    window.api.pin.isEnabled().then(enabled => {
      if (enabled) lock()
    }).catch(() => {})

    window.api.settings.get().then(settings => {
      if (settings?.language) {
        i18n.changeLanguage(settings.language)
      }
      if (settings?.accentColor) {
        document.documentElement.style.setProperty('--color-brand', settings.accentColor)
        document.documentElement.style.setProperty('--color-primary', settings.accentColor)
        document.documentElement.style.setProperty('--color-ring', settings.accentColor)
        document.documentElement.style.setProperty('--color-brand-glow', `${settings.accentColor}26`)
      }
      if (settings?.compactMode !== undefined) {
        document.documentElement.classList.toggle('compact-mode', !!settings.compactMode)
      }
    }).catch(() => {})

    // Check for goals that reached their target date
    window.api.goal.getDueGoals().then(dueGoals => {
      if (dueGoals && dueGoals.length > 0) {
        // Show the first due goal that hasn't been completed
        setActiveDueGoal(dueGoals[0])
      }
    }).catch(err => {
      console.error('Failed to check due goals:', err)
    })
  }, [])

  const handleCompleteDueGoal = async (id: string) => {
    await window.api.goal.markCompleted(id)
    setActiveDueGoal(null)
  }

  const handleExtendDueGoal = async (id: string, newTargetDate: string) => {
    await window.api.goal.extendTargetDate(id, newTargetDate)
    setActiveDueGoal(null)
  }

  return (
    <QueryProvider>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {isLocked && <LockScreen key="lock" />}
        </AnimatePresence>
        <HashRouter>
        <Routes>
          {/* All app routes wrapped in AppShell */}
          <Route element={<AppShell />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/recovery"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RecoveryPage />
                </Suspense>
              }
            />
            <Route
              path="/habits"
              element={
                <Suspense fallback={<PageLoader />}>
                  <HabitsPage />
                </Suspense>
              }
            />
            <Route
              path="/tasks"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="/goals"
              element={
                <Suspense fallback={<PageLoader />}>
                  <GoalsPage />
                </Suspense>
              }
            />
            <Route
              path="/journal"
              element={
                <Suspense fallback={<PageLoader />}>
                  <JournalPage />
                </Suspense>
              }
            />
            <Route
              path="/analytics"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            {/* 404 → redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {/* Global Pomodoro Controller Bar */}
        <PomodoroBar />

        {/* Global Due Goal Notification Popup */}
        <DueGoalModal
          goal={activeDueGoal}
          isOpen={!!activeDueGoal}
          onClose={() => setActiveDueGoal(null)}
          onComplete={handleCompleteDueGoal}
          onExtend={handleExtendDueGoal}
        />

        {/* Global Quick-Add Spotlight HUD */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />

        {/* Global toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface-overlay)',
              border: '1px solid var(--color-surface-border)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)'
            }
          }}
        />
        <EmergencyOverlay />
      </HashRouter>
      </ErrorBoundary>
    </QueryProvider>
  )
}

