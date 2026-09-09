import React, { useState, useEffect } from 'react'
import { X, Target } from 'lucide-react'
import type { Goal, CreateGoalDto, UpdateGoalDto, GoalCategory } from '../../../../shared/types/goal.types'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onSave: (data: CreateGoalDto | UpdateGoalDto) => Promise<void>
}

export function GoalModal({ isOpen, onClose, goal, onSave }: GoalModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('GENERAL')
  const [targetDate, setTargetDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description || '')
      setCategory((goal.category as GoalCategory) || 'GENERAL')
      // Format to YYYY-MM-DD for input[type="date"]
      const d = new Date(goal.targetDate)
      const dateString = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : ''
      setTargetDate(dateString)
    } else {
      setTitle('')
      setDescription('')
      setCategory('GENERAL')
      // Default to 30 days from now
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 30)
      setTargetDate(defaultDate.toISOString().split('T')[0])
    }
  }, [isOpen, goal])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !targetDate) return

    setIsSubmitting(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        category,
        targetDate
      })
      onClose()
    } catch (err) {
      console.error('Failed to save goal:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface-base,#121214)] border border-surface-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--color-brand)]" />
            <h2 className="text-lg font-bold text-text-primary">
              {goal ? 'Chỉnh Sửa Mục Tiêu' : 'Thêm Mục Tiêu Dài Hạn Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-overlay transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Tên mục tiêu *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-overlay border border-surface-border rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors text-sm"
              placeholder="ví dụ: Đạt mốc 90 ngày kiên trì, Chạy bộ 21km..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Lý do & Động lực (Tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-overlay border border-surface-border rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors resize-none h-20 text-sm"
              placeholder="Tại sao mục tiêu này quan trọng với bạn?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full bg-surface-overlay border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand transition-colors text-sm cursor-pointer"
              >
                <option value="RECOVERY">Phục hồi</option>
                <option value="HEALTH">Sức khỏe</option>
                <option value="CAREER">Sự nghiệp</option>
                <option value="PERSONAL">Bản thân</option>
                <option value="GENERAL">Chung</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Ngày hoàn thành *
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-surface-overlay border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand transition-colors text-sm font-mono cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !targetDate}
              className="px-5 py-2 text-sm font-semibold bg-brand hover:bg-brand-dim text-white rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Đang lưu...' : goal ? 'Lưu Thay Đổi' : 'Tạo Mục Tiêu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
