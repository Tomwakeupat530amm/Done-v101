import React, { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { TaskStatus } from '../../../../shared/types/task.types'

interface InlineTaskInputProps {
  status: TaskStatus
  onSave: (title: string, status: TaskStatus) => void
}

export function InlineTaskInput({ status, onSave }: InlineTaskInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title.trim(), status)
      setTitle('')
      setIsEditing(false) // Stay inline or close? Closing is usually better to prevent empty tasks
    } else {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
      setTitle('')
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="mt-2 p-2 bg-surface-raised rounded-md border border-brand border-opacity-50">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!title.trim()) setIsEditing(false)
          }}
          placeholder="Nhập tên việc..."
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
        />
      </form>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="mt-2 w-full flex items-center justify-start gap-2 p-2 text-sm text-text-muted hover:text-text-primary hover:bg-surface-raised rounded-md transition-colors"
    >
      <Plus size={16} />
      <span>Thêm thẻ</span>
    </button>
  )
}
