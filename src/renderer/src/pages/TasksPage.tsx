import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { KanbanBoard } from '../features/tasks/KanbanBoard'
import { TaskModal } from '../features/tasks/TaskModal'
import { ListTodo, Search, X } from 'lucide-react'
import type { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../../shared/types/task.types'

export function TasksPage() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus] = useState<TaskStatus>('TODO')

  const loadTasks = async () => {
    try {
      const data = await window.api.task.getAll()
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleUpdateOrder = async (taskId: string, newStatus: TaskStatus, newOrder: number, localTasks: Task[]) => {
    // Optimistic UI update already handled in KanbanBoard
    setTasks(localTasks)
    try {
      await window.api.task.updateOrder(taskId, newStatus, newOrder)
    } catch (error) {
      console.error('Failed to update task order:', error)
      // Revert on error
      loadTasks()
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await window.api.task.delete(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleInlineAddTask = async (title: string, status: TaskStatus) => {
    try {
      const created = await window.api.task.create({
        title,
        status,
        priority: 'MEDIUM',
        order: Date.now()
      })
      setTasks(prev => [...prev, created])
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleSaveTask = async (dto: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      const updated = await window.api.task.update(editingTask.id, dto as UpdateTaskDto)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    } else {
      const created = await window.api.task.create({
        ...dto,
        order: Date.now() // default order
      } as CreateTaskDto)
      setTasks(prev => [...prev, created])
    }
  }

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  return (
    <div className="h-full flex flex-col pt-8">
      {/* Header with Search and Priority Filters */}
      <div className="flex-none mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t('tasks.title', 'Công việc')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            {t('tasks.subtitle', 'Bảng Kanban trực quan & tập trung theo phiên Pomodoro')}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tasks.searchPlaceholder', 'Tìm kiếm việc...')}
              className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] w-44 sm:w-52 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority filter pills */}
          <div className="flex items-center bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] p-1 rounded-xl gap-0.5">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => {
              const labelMap: Record<string, string> = {
                ALL: t('tasks.all', 'Tất cả'),
                HIGH: t('tasks.high', 'Cao'),
                MEDIUM: t('tasks.med', 'TB'),
                LOW: t('tasks.low', 'Thấp')
              }
              const isActive = priorityFilter === p
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {labelMap[p]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 pt-2 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted">{t('common.loading', 'Loading tasks...')}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center mt-[-60px]">
            <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mb-6 border border-brand border-opacity-20 glow-brand">
              <ListTodo size={40} className="text-brand" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">{t('tasks.noTasks', 'Chưa có công việc nào')}</h2>
            <p className="text-text-secondary mb-8 text-sm">{t('tasks.noTasksSub', 'Kanban giúp bạn tổ chức công việc hàng ngày một cách trực quan và dễ dàng. Hãy bắt đầu bằng một mục tiêu nhỏ nhé.')}</p>
            <button 
              onClick={() => handleInlineAddTask('Lên kế hoạch hôm nay', 'TODO')}
              className="bg-brand hover:bg-brand-dim text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
            >
              {t('tasks.startPlanning', 'Bắt đầu lên kế hoạch')}
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">{t('tasks.noMatch', 'Không tìm thấy công việc nào phù hợp với bộ lọc')}</p>
            <button
              onClick={() => { setSearchQuery(''); setPriorityFilter('ALL') }}
              className="mt-2 text-xs text-[var(--color-brand)] hover:underline font-medium"
            >
              {t('tasks.clearFilter', 'Xóa bộ lọc')}
            </button>
          </div>
        ) : (
          <KanbanBoard 
            tasks={filteredTasks}
            onUpdateOrder={handleUpdateOrder}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onAddTask={handleInlineAddTask}
          />
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSaveTask}
      />
    </div>
  )
}

export default TasksPage

