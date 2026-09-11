// src/renderer/src/components/layout/Sidebar.tsx
// Arc Browser + Linear-inspired sidebar navigation

import { useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Shield,
  CheckSquare,
  ListTodo,
  BookOpen,
  Activity,
  Settings,
  Zap,
  ChevronLeft,
  Target
} from 'lucide-react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../stores/appStore'
import logoImg from '../../assets/logo.png'

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, openEmergency } = useAppStore()
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => window.api.settings.get()
  })
  const { data: profile } = useQuery({
    queryKey: ['identityProfile'],
    queryFn: () => window.api.identity.getProfile()
  })
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const NAV_ITEMS = [
    { path: '/', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard, shortcut: '1' },
    { path: '/recovery', label: t('nav.recovery', 'Recovery'), icon: Shield, shortcut: '2' },
    { path: '/habits', label: t('nav.habits', 'Habits'), icon: CheckSquare, shortcut: '3' },
    { path: '/tasks', label: t('nav.tasks', 'Tasks'), icon: ListTodo, shortcut: '4' },
    { path: '/goals', label: t('nav.goals', 'Goals'), icon: Target, shortcut: '5' },
    { path: '/journal', label: t('nav.journal', 'Journal'), icon: BookOpen, shortcut: '6' },
    { path: '/analytics', label: t('nav.analytics', 'Analytics'), icon: Activity, shortcut: '7' },
    { path: '/settings', label: t('nav.settings', 'Settings'), icon: Settings, shortcut: '8' }
  ]

  const handleLanguageChange = (value: string) => {
    if (value && value !== i18n.language) {
      i18n.changeLanguage(value)
      window.api.settings.update({ language: value })
    }
  }

  // Keyboard shortcuts: Cmd/Ctrl + 1-7, Cmd+\
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod) return

      if (e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
        return
      }

      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        openEmergency()
        return
      }

      const num = parseInt(e.key)
      if (num >= 1 && num <= NAV_ITEMS.length) {
        e.preventDefault()
        navigate(NAV_ITEMS[num - 1].path)
      }
    },
    [navigate, toggleSidebar, openEmergency]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 56 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-base)',
        borderRight: '1px solid var(--color-surface-border)',
        height: '100%'
      }}
    >
      {/* Toggle collapse button & Brand */}
      <div
        className="flex items-center px-3 py-2"
        style={{ height: 44, borderBottom: '1px solid var(--color-surface-border)' }}
      >
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 ml-1 flex-1"
            >
              <img src={logoImg} alt="Done" className="w-5 h-5 rounded-md object-contain" />
              <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Done
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-150 ml-auto"
          style={{ color: 'var(--color-text-muted)' }}
          title={isSidebarCollapsed ? `${t('nav.expand', 'Expand')} (Ctrl+\\)` : `${t('nav.collapse', 'Collapse')} (Ctrl+\\)`}
        >
          <motion.div animate={{ rotate: isSidebarCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ path, label, icon: Icon, shortcut }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-md transition-all duration-150 ${
                isActive ? 'nav-active' : 'nav-item'
              }`
            }
            style={({ isActive }) => ({
              height: 36,
              padding: isSidebarCollapsed ? '0 10px' : '0 10px',
              backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: isActive ? '#a5b4fc' : 'var(--color-text-secondary)'
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active left border */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                    style={{ backgroundColor: '#6366f1' }}
                  />
                )}

                <Icon
                  className="flex-shrink-0 transition-colors duration-150"
                  style={{
                    width: 16,
                    height: 16,
                    color: isActive ? '#818cf8' : 'var(--color-text-secondary)'
                  }}
                />

                <AnimatePresence mode="wait">
                  {!isSidebarCollapsed && (
                    <motion.div
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                      <span
                        className="text-xs opacity-0 group-hover:opacity-60 transition-opacity"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
                      >
                        ⌘{shortcut}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {isSidebarCollapsed && (
                  <div
                    className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{
                      backgroundColor: 'var(--color-surface-overlay)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-surface-border)'
                    }}
                  >
                    {label}
                    <span className="ml-2 opacity-50">⌘{shortcut}</span>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Emergency button — visible according to settings */}
      {settings?.emergencyButtonVisible !== false && (
        <div className="p-2" style={{ borderTop: '1px solid var(--color-surface-border)' }}>
          <motion.button
            onClick={openEmergency}
            className="w-full flex items-center gap-3 rounded-md font-medium text-sm transition-all"
            animate={{
              backgroundColor: ['rgba(239,68,68,0.08)', 'rgba(239,68,68,0.14)', 'rgba(239,68,68,0.08)']
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(239,68,68,0.22)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 36,
              padding: isSidebarCollapsed ? '0 10px' : '0 10px',
              color: '#f87171',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
            }}
            title={isSidebarCollapsed ? `${t('nav.emergencyMode', 'Emergency Mode')} (Ctrl+E)` : undefined}
          >
            <Zap className="flex-shrink-0" style={{ width: 16, height: 16 }} />
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  {t('nav.emergency', 'Emergency')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}

      {/* User profile & Language */}
      <AnimatePresence mode="wait">
        {!isSidebarCollapsed && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--color-surface-border)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}
              >
                {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'D'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {profile?.displayName || t('nav.userProfile', 'Doer')}
                </span>
                <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                  Level {profile?.level || 1}
                </span>
              </div>
            </div>

            {!isSidebarCollapsed && (
              <ToggleGroup.Root
                type="single"
                value={i18n.language}
                onValueChange={handleLanguageChange}
                className="flex items-center bg-[var(--color-surface-overlay)] rounded-md border border-[var(--color-surface-border)] overflow-hidden"
              >
                <ToggleGroup.Item
                  value="en"
                  className={`w-8 h-7 flex items-center justify-center text-xs font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-[var(--color-brand)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  EN
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="vi"
                  className={`w-8 h-7 flex items-center justify-center text-xs font-medium transition-colors ${
                    i18n.language === 'vi'
                      ? 'bg-[var(--color-brand)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  VI
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
