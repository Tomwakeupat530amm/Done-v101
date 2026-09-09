import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../../../../shared/types/task.types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  defaultStatus?: TaskStatus
  onSave: (task: CreateTaskDto | UpdateTaskDto) => Promise<void>
}

export function TaskModal({ isOpen, onClose, task, defaultStatus = 'TODO', onSave }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setTitle(task?.title ?? '')
    setDescription(task?.description ?? '')
    setStatus(task?.status ?? defaultStatus)
    setPriority(task?.priority ?? 'MEDIUM')
  }, [isOpen, task, defaultStatus])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority
      })
      onClose()
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-surface-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-overlay)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors resize-none h-24"
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors appearance-none"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {task && (
            <div className="p-3 rounded-xl bg-surface-overlay border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍅</span>
                <div>
                  <p className="text-xs font-semibold text-white">Pomodoro Tracker</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Đã hoàn thành <span className="font-bold text-rose-400">{task.pomodoroSessions || 0}</span> phiên
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

