// src/renderer/src/features/recovery/RelapseModal.tsx
// Non-judgmental 3-step relapse logging flow

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const getTriggerOptions = (t: any) => [
  { key: 'BOREDOM', label: t('recovery.trigger_boredom', 'Chán nản'), emoji: '😶' },
  { key: 'STRESS', label: t('recovery.trigger_stress', 'Áp lực'), emoji: '😤' },
  { key: 'LONELINESS', label: t('recovery.trigger_loneliness', 'Cô đơn'), emoji: '😔' },
  { key: 'ANXIETY', label: t('recovery.trigger_anxiety', 'Lo lắng'), emoji: '😰' },
  { key: 'ANGER', label: t('recovery.trigger_anger', 'Tức giận'), emoji: '😠' },
  { key: 'SADNESS', label: t('recovery.trigger_sadness', 'Buồn bã'), emoji: '😢' },
  { key: 'LATE_NIGHT', label: t('recovery.trigger_late_night', 'Đêm khuya'), emoji: '🌙' },
  { key: 'SOCIAL_MEDIA', label: t('recovery.trigger_social_media', 'Mạng xã hội'), emoji: '📱' },
  { key: 'OTHER', label: t('recovery.trigger_other', 'Khác'), emoji: '💭' }
]

interface RelapseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RelapseModal({ isOpen, onClose }: RelapseModalProps) {
  const [step, setStep] = useState(1)
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [recoveryNote, setRecoveryNote] = useState('')
  const [isDone, setIsDone] = useState(false)
  const { t } = useTranslation()
  const triggerOptions = getTriggerOptions(t)

  const queryClient = useQueryClient()

  const { mutate: logRelapse, isPending } = useMutation({
    mutationFn: (data: { triggerType?: string; recoveryNote?: string }) =>
      window.api.recovery.logRelapse({
        triggerType: data.triggerType ?? undefined,
        recoveryNote: data.recoveryNote || undefined
      }),
    onSuccess: () => {
      setIsDone(true)
      queryClient.invalidateQueries({ queryKey: ['recovery'] })
      setTimeout(() => {
        handleClose()
        toast.success(t('recovery.toast_success', 'Chương mới bắt đầu. Bạn mạnh hơn bạn nghĩ.'), {
          duration: 4000
        })
      }, 2200)
    }
  })

  function handleClose() {
    setStep(1)
    setSelectedTrigger(null)
    setRecoveryNote('')
    setIsDone(false)
    onClose()
  }

  function handleSubmit() {
    logRelapse({
      triggerType: selectedTrigger ?? undefined,
      recoveryNote
    })
  }

  function handleSkip() {
    logRelapse({})
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--color-surface-overlay)',
            border: '1px solid var(--color-surface-border)'
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-md transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {isDone ? (
              // Done state
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {t('recovery.modal_doneTitle', 'Chương mới bắt đầu.')}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('recovery.modal_doneSub', 'Mỗi thất bại là dữ liệu, không phải định nghĩa bạn.')}
                </p>
              </motion.div>
            ) : step === 1 ? (
              // Step 1: Acknowledge
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-3xl mb-4">💪</div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {t('recovery.modal_step1Title', 'Tiếp tục hành trình')}
                </h2>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('recovery.modal_step1Sub1', 'Điều này không định nghĩa bạn. Mỗi khoảnh khắc là cơ hội để bắt đầu lại.')}
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  {t('recovery.modal_step1Sub2', 'Người mạnh không phải là người không bao giờ ngã — mà là người đứng dậy mỗi lần.')}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-2.5 rounded-xl font-medium text-sm transition-all"
                    style={{ backgroundColor: '#6366f1', color: '#fff' }}
                  >
                    {t('recovery.modal_btnContinue', 'Tiếp tục (ghi lại trigger)')}
                  </button>
                  <button
                    onClick={handleSkip}
                    disabled={isPending}
                    className="w-full py-2 text-sm transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t('recovery.modal_btnSkip', 'Bỏ qua — chỉ reset counter')}
                  </button>
                </div>
              </motion.div>
            ) : step === 2 ? (
              // Step 2: Trigger select
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {t('recovery.modal_step2Title', 'Điều gì đã xảy ra?')}
                </h2>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  {t('recovery.modal_step2Sub', 'Tùy chọn — hiểu trigger giúp bạn phòng ngừa lần sau')}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {triggerOptions.map((tr) => (
                    <button
                      key={tr.key}
                      onClick={() => setSelectedTrigger(selectedTrigger === tr.key ? null : tr.key)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        backgroundColor: selectedTrigger === tr.key
                          ? 'rgba(99,102,241,0.2)'
                          : 'var(--color-surface-raised)',
                        border: `1px solid ${selectedTrigger === tr.key ? '#6366f1' : 'transparent'}`,
                        color: selectedTrigger === tr.key ? '#a5b4fc' : 'var(--color-text-secondary)'
                      }}
                    >
                      <span className="text-lg">{tr.emoji}</span>
                      <span>{tr.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 rounded-xl text-sm transition-colors"
                    style={{
                      backgroundColor: 'var(--color-surface-raised)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {t('recovery.modal_btnBack', 'Quay lại')}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#6366f1', color: '#fff' }}
                  >
                    {t('recovery.modal_btnNext', 'Tiếp theo')}
                  </button>
                </div>
              </motion.div>
            ) : (
              // Step 3: Recovery note + submit
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  {t('recovery.modal_step3Title', 'Bạn sẽ làm gì khác lần sau?')}
                </h2>
                <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  {t('recovery.modal_step3Sub', 'Tùy chọn — viết ra để não bộ học từ trải nghiệm này')}
                </p>
                <textarea
                  value={recoveryNote}
                  onChange={(e) => setRecoveryNote(e.target.value)}
                  placeholder={t('recovery.modal_placeholder', 'Lần sau tôi sẽ...')}
                  rows={3}
                  className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-colors mb-4"
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-surface-border)'
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-2 rounded-xl text-sm"
                    style={{
                      backgroundColor: 'var(--color-surface-raised)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {t('recovery.modal_btnBack', 'Quay lại')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: '#6366f1',
                      color: '#fff',
                      opacity: isPending ? 0.7 : 1
                    }}
                  >
                    {isPending ? t('recovery.modal_btnSaving', 'Đang lưu...') : t('recovery.modal_btnFinish', 'Bắt đầu lại 🌱')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step indicator */}
          {!isDone && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: step === s ? 16 : 6,
                    height: 6,
                    backgroundColor: step === s ? '#6366f1' : 'rgba(255,255,255,0.1)'
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
