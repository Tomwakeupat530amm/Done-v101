// src/renderer/src/components/LockScreen.tsx
// PIN lock screen — shown on app start if PIN is enabled

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useLockStore } from '../stores/lockStore'
import { useTranslation } from 'react-i18next'
import logoImg from '../assets/logo.png'

export function LockScreen() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [shake, setShake] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { unlock } = useLockStore()
  const { t } = useTranslation()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async () => {
    if (!pin.trim()) return
    const ok = await window.api.pin.verify(pin)
    if (ok) {
      unlock()
    } else {
      setAttempts(a => a + 1)
      setShake(true)
      const attemptsText = t('lockScreen.attempts', 'lần thử')
      setError(`${t('lockScreen.wrongPin', 'PIN không đúng')}${attempts >= 2 ? ` (${attempts + 1} ${attemptsText})` : ''}`)
      setPin('')
      setTimeout(() => setShake(false), 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm mx-auto px-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/10 flex items-center justify-center mb-4">
            <img src={logoImg} alt="Done" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('lockScreen.title', 'Done')}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('lockScreen.prompt', 'Nhập PIN để mở khoá')}</p>
        </div>

        {/* PIN display dots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: Math.max(pin.length, 4) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: i < pin.length ? 1.1 : 1 }}
              transition={{ duration: 0.1 }}
              className={`w-3 h-3 rounded-full transition-colors ${i < pin.length ? 'bg-indigo-500' : 'bg-[var(--color-surface-border)]'}`}
            />
          ))}
        </div>

        {/* PIN input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type={showPin ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, '')
              setPin(v)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="••••"
            className="w-full text-center text-xl tracking-[0.5em] bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl px-4 py-4 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-rose-400 mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Unlock button */}
        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="w-full py-3.5 rounded-2xl text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          {t('lockScreen.unlock', 'Mở khoá')}
        </button>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          {t('lockScreen.dataLocal', 'Dữ liệu được lưu trữ 100% trên máy của bạn')}
        </p>
      </motion.div>
    </motion.div>
  )
}
