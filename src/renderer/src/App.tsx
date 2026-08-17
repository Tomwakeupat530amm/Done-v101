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
const IdentityPage = lazy(() => import('./pages/IdentityPage'))
const JournalPage = lazy(() => import('./pages/JournalPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

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

  // Check PIN and settings on startup
  useEffect(() => {
    window.api.pin.isEnabled().then(enabled => {
      if (enabled) lock()
    }).catch(() => {})

    window.api.settings.get().then(settings => {
      if (settings?.language) {
        i18n.changeLanguage(settings.language)
      }
    }).catch(() => {})
  }, [])

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
              path="/identity"
              element={
                <Suspense fallback={<PageLoader />}>
                  <IdentityPage />
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
