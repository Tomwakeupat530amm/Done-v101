// src/renderer/src/components/MilestoneCelebration.tsx
// Animated celebration overlay shown when milestone is reached

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface MilestoneCelebrationProps {
  days: number
  name: string
  xp: number
  onDismiss: () => void
}

// Simple confetti particle
function Particle({ delay }: { delay: number }) {
  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const x = (Math.random() - 0.5) * 400
  const rotate = Math.random() * 720 - 360

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color, top: '40%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{ x, y: Math.random() * 300 + 100, opacity: 0, rotate }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
    />
  )
}

export function MilestoneCelebration({ days, name, xp, onDismiss }: MilestoneCelebrationProps) {
  const [particles] = useState(() => Array.from({ length: 30 }, (_, i) => i))

  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(i => <Particle key={i} delay={i * 0.05} />)}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-3xl p-10 text-center max-w-sm mx-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Trophy icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="w-10 h-10 text-amber-400" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2"
        >
          Milestone đạt được!
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-[var(--color-text-primary)] mb-1"
        >
          {days} ngày tự do
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[var(--color-text-secondary)] mb-6"
        >
          {name}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6"
        >
          ✨ +{xp} XP
        </motion.div>

        <motion.p className="text-xs text-[var(--color-text-muted)]">
          Nhấn bất kỳ đâu để đóng
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
