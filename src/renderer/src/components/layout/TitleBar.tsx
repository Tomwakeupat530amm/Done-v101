// src/renderer/src/components/layout/TitleBar.tsx
// Custom frameless window title bar with drag region + window controls

import { useEffect, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // Listen for maximize/restore state changes
    const checkMaximized = async () => {
      const maximized = await window.api.settings.get().then(() => false).catch(() => false)
      setIsMaximized(maximized)
    }
    checkMaximized()
  }, [])

  const handleMinimize = () => window.electron.ipcRenderer.invoke('window:minimize')
  const handleMaximize = async () => {
    await window.electron.ipcRenderer.invoke('window:maximize')
    setIsMaximized((prev) => !prev)
  }
  const handleClose = () => window.electron.ipcRenderer.invoke('window:close')

  return (
    <div
      className="titlebar-drag flex items-center justify-between w-full select-none"
      style={{
        height: 'var(--titlebar-height)',
        backgroundColor: 'var(--color-surface-base)',
        borderBottom: '1px solid var(--color-surface-border)',
        flexShrink: 0
      }}
    >
      {/* App name — left side */}
      <div className="titlebar-no-drag flex items-center gap-2 px-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}
        >
          Atomic Recovery
        </span>
      </div>

      {/* Window controls — right side (Windows style) */}
      <div className="titlebar-no-drag flex items-center">
        <motion.button
          onClick={handleMinimize}
          className="w-11 h-full flex items-center justify-center transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff' }}
        >
          <Minus className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          onClick={handleMaximize}
          className="w-11 h-full flex items-center justify-center transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff' }}
        >
          <Square className="w-3.5 h-3.5" style={{ transform: isMaximized ? 'none' : undefined }} />
        </motion.button>
        <motion.button
          onClick={handleClose}
          className="w-11 h-full flex items-center justify-center transition-colors duration-150"
          style={{ color: 'var(--color-text-muted)' }}
          whileHover={{ backgroundColor: '#ef4444', color: '#fff' }}
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  )
}
