import { Draggable } from '@hello-pangea/dnd'
import { Trash2, Edit2, ChevronsUp, Equal, ChevronDown } from 'lucide-react'
import type { Task, TaskPriority } from '../../../../shared/types/task.types'
import { useTranslation } from 'react-i18next'

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const PriorityColors: Record<TaskPriority, string> = {
  LOW: 'text-blue-500',
  MEDIUM: 'text-amber-500',
  HIGH: 'text-rose-500'
}

const PriorityIcon = ({ priority, className }: { priority: TaskPriority, className?: string }) => {
  switch (priority) {
    case 'HIGH': return <ChevronsUp className={className} size={14} />
    case 'LOW': return <ChevronDown className={className} size={14} />
    default: return <Equal className={className} size={14} />
  }
}

export function TaskCard({ task, index, onDelete, onEdit }: TaskCardProps) {
  const { t } = useTranslation()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative bg-[var(--color-surface-raised)] border rounded-xl p-4
            transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing
            ${snapshot.isDragging ? 'border-[var(--color-brand)] shadow-lg scale-[1.02] z-50' : 'border-[var(--color-surface-border)]'}
          `}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={`flex items-center justify-center p-1 rounded-md bg-surface-overlay ${PriorityColors[task.priority]}`} title={t(`task.priority.${task.priority.toLowerCase()}`, task.priority)}>
              <PriorityIcon priority={task.priority} />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors rounded hover:bg-[var(--color-surface-overlay)]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (window.confirm(t('task.deleteConfirm', 'Bạn có chắc chắn muốn xóa task này?'))) {
                    onDelete(task.id); 
                  }
                }}
                className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors rounded hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <h4 className={`text-sm font-medium ${task.status === 'DONE' ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'}`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  )
}
