import { useState, useCallback, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '../../../../shared/types/task.types'
import { useTranslation } from 'react-i18next'
import { InlineTaskInput } from './InlineTaskInput'

interface KanbanBoardProps {
  tasks: Task[]
  onUpdateOrder: (taskId: string, newStatus: TaskStatus, newOrder: number, localTasks: Task[]) => void
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
  onAddTask: (title: string, status: TaskStatus) => void
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Done' }
]

export function KanbanBoard({ tasks: initialTasks, onUpdateOrder, onDeleteTask, onEditTask, onAddTask }: KanbanBoardProps) {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // Sync state when external tasks change (e.g. refetched)
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result

    // Dropped outside the list
    if (!destination) return

    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const destStatus = destination.droppableId as TaskStatus

    const newTasks = Array.from(tasks)
    
    // Find moving task
    const taskIndex = newTasks.findIndex(t => t.id === draggableId)
    if (taskIndex === -1) return
    const [movedTask] = newTasks.splice(taskIndex, 1)

    // Calculate new order
    const destTasks = newTasks.filter(t => t.status === destStatus).sort((a, b) => a.order - b.order)
    
    let newOrder = 0
    if (destTasks.length === 0) {
      newOrder = Date.now()
    } else if (destination.index === 0) {
      newOrder = destTasks[0].order - 1000
    } else if (destination.index >= destTasks.length) {
      newOrder = destTasks[destTasks.length - 1].order + 1000
    } else {
      const prevOrder = destTasks[destination.index - 1].order
      const nextOrder = destTasks[destination.index].order
      newOrder = (prevOrder + nextOrder) / 2
    }

    const updatedTask = { ...movedTask, status: destStatus, order: newOrder }
    newTasks.push(updatedTask)

    // Optimistic UI update
    setTasks(newTasks)
    
    // Trigger parent callback to save
    onUpdateOrder(draggableId, destStatus, newOrder, newTasks)
  }, [tasks, onUpdateOrder])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[600px] items-start">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id).sort((a, b) => a.order - b.order)
          
          return (
            <div key={column.id} className={`flex-1 min-w-[280px] flex flex-col bg-surface-base rounded-2xl border border-surface-border overflow-hidden transition-opacity ${column.id === 'DONE' ? 'opacity-70 hover:opacity-100' : ''} ${column.id === 'IN_PROGRESS' ? 'border-t-2 border-t-brand' : ''}`}>
              <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-raised">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">
                  {t(`task.status.${column.id.toLowerCase()}`, column.label)}
                  <span className="ml-2 text-xs font-normal text-text-muted bg-surface-overlay px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </h3>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 p-3 space-y-3 min-h-[150px] transition-colors
                      ${snapshot.isDraggingOver ? 'bg-[var(--color-surface-overlay)]' : ''}
                    `}
                  >
                    {columnTasks.map((task, index) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        index={index}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                      />
                    ))}
                    {provided.placeholder}
                    
                    <InlineTaskInput status={column.id} onSave={onAddTask} />
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
