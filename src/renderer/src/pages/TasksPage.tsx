import { useState, useEffect } from 'react'
import { KanbanBoard } from '../features/tasks/KanbanBoard'
import { TaskModal } from '../features/tasks/TaskModal'
import { ListTodo } from 'lucide-react'
import type { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../../shared/types/task.types'

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  
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

  return (
    <div className="h-full flex flex-col pt-8">
      <div className="flex-none mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Tasks</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your tasks using Kanban</p>
      </div>

      <div className="flex-1 min-h-0 pt-6 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center mt-[-100px]">
            <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mb-6 border border-brand border-opacity-20 glow-brand">
              <ListTodo size={40} className="text-brand" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Chưa có công việc nào</h2>
            <p className="text-text-secondary mb-8">Kanban giúp bạn tổ chức công việc hàng ngày một cách trực quan và dễ dàng. Hãy bắt đầu bằng một mục tiêu nhỏ nhé.</p>
            <button 
              onClick={() => handleInlineAddTask('Lên kế hoạch hôm nay', 'TODO')}
              className="bg-brand hover:bg-brand-dim text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Bắt đầu lên kế hoạch
            </button>
          </div>
        ) : (
          <KanbanBoard 
            tasks={tasks}
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

