// src/renderer/src/components/layout/TitleBar.tsx
// Custom frameless window title bar with drag region + window controls

import { useEffect, useState } from 'react'
import { Minus, Square, X } from 'lucide-react'
import { motion } from 'framer-motion'
import logoImg from '../../assets/logo.png'

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)
  const isMac = window.api?.platform === 'darwin'

  useEffect(() => {
    // Listen for maximize/restore state changes
    const checkMaximized = async () => {
      const maximized = await window.electron.ipcRenderer
        .invoke('window:isMaximized')
        .catch(() => false)
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
      {/* App name — left side (offset on macOS to accommodate traffic lights) */}
      <div className={`titlebar-no-drag flex items-center gap-2 ${isMac ? 'pl-20 pr-4' : 'px-4'}`}>
        <img
          src={logoImg}
          alt="Done"
          className="w-4 h-4 rounded-sm object-contain"
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--color-text-primary)', letterSpacing: '0.12em' }}
        >
          Done
        </span>
      </div>

      {/* Window controls — right side (Windows/Linux only) */}
      {!isMac && (
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
      )}
    </div>
  )
}
