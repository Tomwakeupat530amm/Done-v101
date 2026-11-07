// src/renderer/src/features/widget/WidgetApp.tsx
// Floating task widget: overdue + today's open Kanban tasks, quick add, tick-to-complete.

import { useEffect, useState, type FormEvent } from 'react'
import { QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { differenceInCalendarDays, format } from 'date-fns'
import { Check, ExternalLink, Pin, PinOff, Plus, X, AlertTriangle, CalendarCheck } from 'lucide-react'
import { queryClient } from '../../providers/QueryProvider'
import type { Task, TaskPriority } from '../../../../shared/types/task.types'
import type { WidgetTasks } from '../../../../shared/types/ipc.types'

const PRIORITY_DOT: Record<TaskPriority, string> = {
  HIGH: '#f43f5e',
  MEDIUM: '#f59e0b',
  LOW: '#3b82f6'
}

function applyAccent(color: string): void {
  const root = document.documentElement.style
  root.setProperty('--color-brand', color)
  root.setProperty('--color-primary', color)
  root.setProperty('--color-ring', color)
  root.setProperty('--color-brand-glow', `${color}26`)
}

function TaskRow({ task, overdue, onDone }: { task: Task; overdue?: boolean; onDone: (id: string) => void }) {
  const { t } = useTranslation()
  const [leaving, setLeaving] = useState(false)
  const daysLate = overdue ? Math.max(1, differenceInCalendarDays(new Date(), new Date(task.createdAt))) : 0

  return (
    <li
      className="group flex items-start gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-surface-border)',
        opacity: leaving ? 0.35 : 1
      }}
    >
      <button
        aria-label={t('widget.complete', 'Hoàn thành')}
        onClick={() => {
          setLeaving(true)
          onDone(task.id)
        }}
        className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors hover:bg-[var(--color-brand)]"
        style={{ borderColor: leaving ? 'var(--color-brand)' : 'var(--color-text-muted)' }}
      >
        {leaving && <Check size={10} color="#fff" />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className="text-[13px] leading-snug break-words"
          style={{
            color: 'var(--color-text-primary)',
            textDecoration: leaving ? 'line-through' : 'none'
          }}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_DOT[task.priority] }} />
          {task.status === 'IN_PROGRESS' && <span>{t('widget.inProgress', 'Đang làm')}</span>}
          {(task.pomodoroSessions || 0) > 0 && <span>🍅 {task.pomodoroSessions}</span>}
          {overdue && (
            <span style={{ color: '#f59e0b' }}>
              {t('widget.daysLate', '{{count}} ngày trước', { count: daysLate })}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

function Section({
  title,
  icon,
  accent,
  tasks,
  overdue,
  onDone
}: {
  title: string
  icon: React.ReactNode
  accent?: string
  tasks: Task[]
  overdue?: boolean
  onDone: (id: string) => void
}) {
  if (tasks.length === 0) return null
  return (
    <section className="mb-3">
      <h2
        className="flex items-center gap-1.5 px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: accent ?? 'var(--color-text-muted)' }}
      >
        {icon}
        {title}
        <span className="ml-auto font-medium">{tasks.length}</span>
      </h2>
      <ul className="flex flex-col gap-1.5">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} overdue={overdue} onDone={onDone} />
        ))}
      </ul>
    </section>
  )
}

function WidgetContent() {
  const { t, i18n } = useTranslation()
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [pinned, setPinned] = useState(true)

  const { data } = useQuery<WidgetTasks>({
    queryKey: ['widgetTasks'],
    queryFn: () => window.api.task.getWidgetTasks(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    staleTime: 0
  })

  // Language + accent color from settings
  useEffect(() => {
    window.api.settings
      .get()
      .then((s) => {
        if (s?.language) i18n.changeLanguage(s.language)
        if (s?.accentColor) applyAccent(s.accentColor)
      })
      .catch(() => {})
    window.api.widget.getPinned().then(setPinned).catch(() => {})
  }, [i18n])

  // Sync with the main window / other mutations
  useEffect(() => {
    return window.api.onTasksChanged(() => {
      qc.invalidateQueries({ queryKey: ['widgetTasks'] })
    })
  }, [qc])

  // Roll "today" into "overdue" right after midnight
  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5)
    const timer = setTimeout(() => qc.invalidateQueries({ queryKey: ['widgetTasks'] }), nextMidnight.getTime() - now.getTime())
    return () => clearTimeout(timer)
  }, [qc, data])

  const refresh = (): void => {
    qc.invalidateQueries({ queryKey: ['widgetTasks'] })
    qc.invalidateQueries({ queryKey: ['tasks'] })
  }

  const handleDone = (id: string): void => {
    window.api.task
      .update(id, { status: 'DONE' })
      .then(() => setTimeout(refresh, 250))
      .catch(refresh)
  }

  const handleAdd = (e: FormEvent): void => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setTitle('')
    window.api.task.create({ title: value, status: 'TODO' }).then(refresh).catch(refresh)
  }

  const overdue = data?.overdue ?? []
  const today = data?.today ?? []
  const doneToday = data?.doneToday ?? 0
  const openCount = overdue.length + today.length
  const total = openCount + doneToday
  const progress = total > 0 ? Math.round((doneToday / total) * 100) : 0

  return (
    <div
      className="flex flex-col h-screen select-none"
      style={{ backgroundColor: 'var(--color-surface-base)', color: 'var(--color-text-primary)' }}
    >
      {/* Header (drag region) */}
      <header
        className="titlebar-drag flex items-center gap-2 pl-3 pr-1 flex-shrink-0"
        style={{ height: 40, borderBottom: '1px solid var(--color-surface-border)' }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-tight truncate">
            {t('widget.title', 'Task hôm nay')}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: 'var(--color-text-muted)' }}>
            {format(new Date(), 'dd/MM/yyyy')} · {t('widget.open', '{{count}} việc còn lại', { count: openCount })}
          </p>
        </div>
        <div className="titlebar-no-drag flex items-center">
          <HeaderButton
            title={pinned ? t('widget.unpin', 'Bỏ ghim') : t('widget.pin', 'Ghim lên trên cùng')}
            onClick={() => window.api.widget.togglePin().then(setPinned)}
          >
            {pinned ? <Pin size={14} /> : <PinOff size={14} />}
          </HeaderButton>
          <HeaderButton title={t('widget.openApp', 'Mở Done')} onClick={() => window.api.widget.openMain()}>
            <ExternalLink size={14} />
          </HeaderButton>
          <HeaderButton title={t('widget.hide', 'Ẩn widget')} onClick={() => window.api.widget.hide()}>
            <X size={14} />
          </HeaderButton>
        </div>
      </header>

      {/* Progress */}
      <div className="px-3 pt-2.5 pb-2 flex-shrink-0">
        <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--color-text-muted)' }}>
          <span>{t('widget.doneToday', 'Đã xong hôm nay')}</span>
          <span>
            {doneToday}/{total}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: 'var(--color-brand)' }}
          />
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <Section
          title={t('widget.overdue', 'Tồn đọng từ hôm qua')}
          icon={<AlertTriangle size={12} />}
          accent="#f59e0b"
          tasks={overdue}
          overdue
          onDone={handleDone}
        />
        <Section
          title={t('widget.today', 'Hôm nay')}
          icon={<CalendarCheck size={12} />}
          tasks={today}
          onDone={handleDone}
        />
        {openCount === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <span className="text-3xl">🎉</span>
            <p className="text-[13px]">{t('widget.empty', 'Không còn việc nào. Tuyệt vời!')}</p>
          </div>
        )}
      </div>

      {/* Quick add */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--color-surface-border)' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('widget.addPlaceholder', 'Thêm việc mới...')}
          className="flex-1 min-w-0 text-[13px] rounded-lg px-3 py-1.5 focus:outline-none"
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-surface-border)',
            color: 'var(--color-text-primary)'
          }}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          aria-label={t('widget.add', 'Thêm')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: 'var(--color-brand)' }}
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  )
}

function HeaderButton({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {children}
    </button>
  )
}

export default function WidgetApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetContent />
    </QueryClientProvider>
  )
}
