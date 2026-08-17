import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, X, Activity, CheckCircle2, RotateCcw } from 'lucide-react'
import { useEmergencyStore } from '../../store/useEmergencyStore'
import { useMutation } from '@tanstack/react-query'
import type { LogUrgeDto } from '../../../../shared/dtos/emergency.dto'
import { useTranslation } from 'react-i18next'

export function EmergencyOverlay() {
  const { isEmergencyActive, closeEmergency } = useEmergencyStore()
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [timerActive, setTimerActive] = useState(false)
  const { t } = useTranslation()
  
  const DISTRACTIONS = [
    t('emergency.action1', 'Hít thở sâu 10 lần (4-7-8)'),
    t('emergency.action2', 'Đứng lên uống 1 cốc nước đầy'),
    t('emergency.action3', 'Chống đẩy 15 cái'),
    t('emergency.action4', 'Đi bộ quanh nhà 3 vòng'),
    t('emergency.action5', 'Rửa mặt bằng nước lạnh'),
    t('emergency.action6', 'Nhắn tin cho accountability partner')
  ]
  
  const logUrge = useMutation({
    mutationFn: (data: LogUrgeDto) => window.api.recovery.logUrge(data),
    onSuccess: () => {
      closeEmergency()
    }
  })

  // Start timer automatically when emergency opens
  useEffect(() => {
    if (isEmergencyActive) {
      setTimeLeft(15 * 60)
      setTimerActive(true)
    } else {
      setTimerActive(false)
    }
  }, [isEmergencyActive])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  // IPC listener for global shortcut
  useEffect(() => {
    window.api.onEmergencyActivated(() => {
      useEmergencyStore.getState().triggerEmergency()
    })
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const handleResist = () => {
    logUrge.mutate({
      intensity: 8, // assumed high
      outcome: 'RESISTED',
      emergencyUsed: true,
      durationMinutes: 15 - Math.floor(timeLeft / 60)
    })
  }

  const handleRelapse = () => {
    // We log it as RELAPSED
    logUrge.mutate({
      intensity: 10,
      outcome: 'RELAPSED',
      emergencyUsed: true,
      durationMinutes: 15 - Math.floor(timeLeft / 60)
    })
    // Ideally this would also trigger the LogRelapse modal, but for now we close emergency
  }

  return (
    <AnimatePresence>
      {isEmergencyActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6"
        >
          <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
          
          <div className="relative w-full max-w-2xl bg-[#111116] border border-red-900/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
                <h2 className="text-2xl font-bold tracking-tight">{t('emergency.title', 'Emergency Mode')}</h2>
              </div>
              <button 
                onClick={closeEmergency}
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column: Timer */}
              <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5">
                <div className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">
                  {t('emergency.timerTitle', 'Urge Timer')}
                </div>
                <div className="text-6xl font-black text-white tabular-nums tracking-tight mb-6">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setTimerActive(!timerActive)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
                  >
                    {timerActive ? t('emergency.pause', 'Pause') : t('emergency.resume', 'Resume')}
                  </button>
                  <button 
                    onClick={() => { setTimeLeft(15 * 60); setTimerActive(true) }}
                    className="flex-none p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-6 leading-relaxed">
                  {t('emergency.advice', 'Urges typically last 15-20 minutes. Just ride the wave. It will pass.')}
                </p>
              </div>

              {/* Right Column: Distractions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300 font-medium px-2">
                  <Activity className="w-5 h-5" />
                  <h3>{t('emergency.toolkit', 'Action Toolkit')}</h3>
                </div>
                <div className="grid gap-2">
                  {DISTRACTIONS.map((action, idx) => (
                    <button 
                      key={idx}
                      className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white leading-tight">
                        {action}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-white/5">
              <button 
                onClick={handleRelapse}
                className="flex-1 py-4 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
              >
                {t('emergency.relapsedBtn', 'I Relapsed (Log it)')}
              </button>
              <button 
                onClick={handleResist}
                className="flex-[2] py-4 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {t('emergency.survivedBtn', 'I Survived The Urge!')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
