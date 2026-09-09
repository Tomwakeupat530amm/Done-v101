import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Calendar, CheckCircle2, Clock, X, Sparkles, ArrowRight } from 'lucide-react'
import type { Goal } from '../../../../shared/types/goal.types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { playTingSound } from '../../lib/sound'

interface DueGoalModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onComplete: (id: string) => Promise<void>
  onExtend: (id: string, newTargetDate: string) => Promise<void>
}

export function DueGoalModal({ goal, isOpen, onClose, onComplete, onExtend }: DueGoalModalProps) {
  const [isExtending, setIsExtending] = useState(false)
  const [newDate, setNewDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14) // default +14 days
    return d.toISOString().split('T')[0]
  })
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !goal) return null

  const targetFormatted = format(new Date(goal.targetDate), 'dd/MM/yyyy', { locale: vi })

  const handleComplete = async () => {
    setIsProcessing(true)
    playTingSound(1.0)
    try {
      await onComplete(goal.id)
      onClose()
    } catch (err) {
      console.error('Failed to complete goal:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate) return
    setIsProcessing(true)
    try {
      await onExtend(goal.id, newDate)
      onClose()
    } catch (err) {
      console.error('Failed to extend goal:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--color-surface-base,#121214)] border border-amber-500/30 shadow-2xl shadow-amber-500/10 p-6 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface-overlay transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Celebration Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mốc Thời Gian Quan Trọng</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">
            Đã Đến Hạn Hoàn Thành Mục Tiêu!
          </h2>

          <div className="p-4 rounded-2xl bg-surface-raised border border-white/5 my-4 text-left">
            <h3 className="text-lg font-bold text-white mb-1">{goal.title}</h3>
            {goal.description && (
              <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-amber-300/80">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hạn chót đã định: {targetFormatted}</span>
            </div>
          </div>

          <p className="text-sm text-text-secondary mb-6">
            Hôm nay là ngày bạn đã đặt mục tiêu đạt được cột mốc này. Hãy tự hào về hành trình đã qua và đưa ra quyết định của bạn nhé!
          </p>

          {!isExtending ? (
            <div className="space-y-3">
              <button
                onClick={handleComplete}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer transform active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Tôi Đã Hoàn Thành Mục Tiêu Này! 🎉</span>
              </button>

              <button
                onClick={() => setIsExtending(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-overlay hover:bg-surface-raised text-text-primary font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer text-sm"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Cần thêm thời gian (Gia hạn ngày mới)</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-text-muted hover:text-text-secondary pt-1 cursor-pointer"
              >
                Nhắc nhở tôi vào lần sau
              </button>
            </div>
          ) : (
            <form onSubmit={handleExtend} className="space-y-4 text-left">
              <div className="p-4 rounded-xl bg-surface-overlay border border-white/5 space-y-2">
                <label className="block text-xs font-semibold text-text-primary">
                  Chọn ngày hoàn thành mới:
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-brand hover:bg-brand-dim text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-brand/20 transition-all cursor-pointer"
                >
                  <span>Lưu Hạn Mới</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExtending(false)}
                  className="py-2.5 px-4 rounded-xl bg-surface-overlay text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Quay lại
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
