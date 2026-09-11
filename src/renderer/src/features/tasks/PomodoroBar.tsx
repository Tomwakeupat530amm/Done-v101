import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  X, 
  Timer, 
  Sliders, 
  Check, 
  Flame, 
  Coffee, 
  Volume2
} from 'lucide-react'
import { usePomodoroStore, PomodoroPreset } from '../../stores/usePomodoroStore'
import { playTingSound } from '../../lib/sound'

export function PomodoroBar() {
  const {
    activeTaskTitle,
    mode,
    preset,
    timeLeft,
    totalDuration,
    isRunning,
    isBarVisible,
    customWorkMinutes,
    customBreakMinutes,
    toggleTimer,
    resetTimer,
    skipPhase,
    setPreset,
    setCustomTime,
    closeBar,
    openBar,
    tick
  } = usePomodoroStore()

  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [tempWork, setTempWork] = useState(customWorkMinutes)
  const [tempBreak, setTempBreak] = useState(customBreakMinutes)

  // Master timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, tick])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Synchronize Pomodoro countdown with macOS Menu Bar / System Tray and Taskbar Progress
  useEffect(() => {
    if (window.api?.tray?.updatePomodoro) {
      const timeStr = isRunning ? formatTime(timeLeft) : null
      window.api.tray.updatePomodoro(timeStr, isRunning).catch(() => {})
    }
    if (window.api?.badge?.updateProgress) {
      const progress = isRunning && totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : -1
      window.api.badge.updateProgress(progress).catch(() => {})
    }
  }, [isRunning, timeLeft, totalDuration])

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault()
    setCustomTime(tempWork, tempBreak)
    setIsCustomOpen(false)
  }

  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0

  if (!isBarVisible) {
    // If hidden but running, show a mini floating pill in bottom corner
    if (isRunning) {
      return (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={openBar}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-brand)]/40 shadow-xl shadow-black/40 text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-brand)] transition-all cursor-pointer glow-brand"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Timer className="w-4 h-4 text-[var(--color-brand)]" />
          <span className="font-mono text-emerald-400">{formatTime(timeLeft)}</span>
          <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[120px]">
            {activeTaskTitle || 'Pomodoro'}
          </span>
        </motion.button>
      )
    }
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-raised,#18181b)]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 p-4">
          {/* Progress bar background line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <motion.div
              className={`h-full ${mode === 'WORK' ? 'bg-[var(--color-brand,#6366f1)]' : 'bg-emerald-500'}`}
              style={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 0.5 }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Task Info & Mode Indicator */}
            <div className="flex items-center gap-3 min-w-[200px] flex-1">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  mode === 'WORK'
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {mode === 'WORK' ? <Flame className="w-5 h-5 animate-pulse" /> : <Coffee className="w-5 h-5" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      mode === 'WORK'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {mode === 'WORK' ? 'Làm Việc' : 'Nghỉ Ngơi'}
                  </span>
                  <button 
                    onClick={() => playTingSound(0.8)} 
                    title="Nghe thử chuông Ting"
                    className="text-white/40 hover:text-white/80 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-white truncate max-w-[220px] sm:max-w-xs mt-0.5">
                  {activeTaskTitle || 'Tập trung theo chu kỳ Pomodoro'}
                </h4>
              </div>
            </div>

            {/* Middle: Digital Clock Display & Play/Pause Controls */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-bold tracking-tight text-white select-none px-3 py-1 rounded-lg bg-black/30 border border-white/5">
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={toggleTimer}
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                    : 'bg-[var(--color-brand,#6366f1)] hover:bg-[var(--color-brand-dim,#4f46e5)] shadow-indigo-500/30'
                }`}
                title={isRunning ? 'Tạm dừng' : 'Bắt đầu'}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={resetTimer}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đặt lại phiên"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={skipPhase}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={mode === 'WORK' ? 'Bỏ qua sang nghỉ ngơi' : 'Bỏ qua sang làm việc'}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Presets & Close */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
                {(['CLASSIC', 'DEEP', 'SPRINT'] as PomodoroPreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      preset === p
                        ? 'bg-[var(--color-brand,#6366f1)] text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p === 'CLASSIC' && '25/5'}
                    {p === 'DEEP' && '50/10'}
                    {p === 'SPRINT' && '15/3'}
                  </button>
                ))}

                <button
                  onClick={() => setIsCustomOpen(!isCustomOpen)}
                  className={`px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition-all ${
                    preset === 'CUSTOM'
                      ? 'bg-[var(--color-brand,#6366f1)] text-white shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  title="Tùy chỉnh thời gian"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {preset === 'CUSTOM' ? `${customWorkMinutes}/${customBreakMinutes}` : 'Tùy chỉnh'}
                </button>
              </div>

              <button
                onClick={closeBar}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
                title="Thu nhỏ thanh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Custom Time Popover / Dialog */}
          <AnimatePresence>
            {isCustomOpen && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveCustom}
                className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-white/80">Cài đặt thời gian tùy chỉnh (phút):</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-white/70">
                    Làm việc:
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={tempWork}
                      onChange={(e) => setTempWork(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded bg-black/50 border border-white/15 text-white text-center font-mono focus:border-[var(--color-brand)] outline-none"
                    />
                  </label>

                  <label className="flex items-center gap-1.5 text-white/70">
                    Nghỉ:
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={tempBreak}
                      onChange={(e) => setTempBreak(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded bg-black/50 border border-white/15 text-white text-center font-mono focus:border-[var(--color-brand)] outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Áp dụng
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomOpen(false)}
                    className="px-2 py-1 bg-white/10 hover:bg-white/15 text-white/70 rounded transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
