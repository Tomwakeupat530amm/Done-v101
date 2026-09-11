// src/renderer/src/components/QuickAddModal.tsx
// Quick-Add HUD / Spotlight-style companion (Cmd/Ctrl + Shift + Space)

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, ShieldAlert, X, CornerDownLeft, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../stores/appStore'
import type { TaskPriority } from '../../../shared/types/task.types'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRIORITY_OPTIONS: { id: TaskPriority; label: string; activeClass: string }[] = [
  { id: 'LOW', label: 'Thấp', activeClass: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'MEDIUM', label: 'Vừa', activeClass: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'HIGH', label: 'Cao', activeClass: 'border-rose-500/40 text-rose-400 bg-rose-500/10' }
]

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const queryClient = useQueryClient()
  const { openEmergency } = useAppStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isMac = window.api?.platform === 'darwin'
  const shortcutDisplay = isMac ? '⌘ ⇧ Space' : 'Ctrl + Shift + Space'

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await window.api.task.create({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status: 'TODO'
      })

      toast.success(isMac ? 'Đã thêm công việc mới (Mac)' : 'Đã thêm công việc mới')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] })
      onClose()
    } catch (err) {
      toast.error('Không thể tạo công việc')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTriggerSOS = () => {
    onClose()
    openEmergency()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Spotlight Floating HUD Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl z-10 border"
            style={{
              backgroundColor: 'rgba(18, 18, 23, 0.94)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Header / Brand & Shortcut badge */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Quick Action
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                  {shortcutDisplay}
                </span>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Hôm nay bạn cần hoàn thành điều gì?..."
                  className="w-full bg-transparent text-base font-medium text-white placeholder-slate-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi chú chi tiết (không bắt buộc)..."
                  className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Priority & Quick Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 mr-1">Mức độ:</span>
                  {PRIORITY_OPTIONS.map((opt) => {
                    const active = priority === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriority(opt.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                          active
                            ? opt.activeClass
                            : 'border-white/5 bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerSOS}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>SOS Cứu trợ</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!title.trim() || isSubmitting}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tạo</span>
                    <CornerDownLeft className="w-3 h-3 ml-0.5 opacity-60" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
