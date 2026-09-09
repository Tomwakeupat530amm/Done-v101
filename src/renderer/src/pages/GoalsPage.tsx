import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Target, Plus, Trophy, Clock, Sparkles } from 'lucide-react'
import { GoalCard } from '../features/goals/GoalCard'
import { GoalModal } from '../features/goals/GoalModal'
import { DueGoalModal } from '../features/goals/DueGoalModal'
import type { Goal, CreateGoalDto, UpdateGoalDto } from '../../../shared/types/goal.types'
import { isToday, differenceInDays } from 'date-fns'


export function GoalsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Due modal state for manual extension
  const [dueModalGoal, setDueModalGoal] = useState<Goal | null>(null)

  // Load goals
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => window.api.goal.getAll()
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (dto: CreateGoalDto) => window.api.goal.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGoalDto }) => window.api.goal.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => window.api.goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => window.api.goal.markCompleted(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  const extendMutation = useMutation({
    mutationFn: ({ id, newTargetDate }: { id: string; newTargetDate: string }) =>
      window.api.goal.extendTargetDate(id, newTargetDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  })

  // Handle Save
  const handleSaveGoal = async (data: CreateGoalDto | UpdateGoalDto) => {
    if (editingGoal) {
      await updateMutation.mutateAsync({ id: editingGoal.id, dto: data as UpdateGoalDto })
    } else {
      await createMutation.mutateAsync(data as CreateGoalDto)
    }
  }

  // Quick stats
  const inProgressCount = goals.filter(g => g.status === 'IN_PROGRESS' || g.status === 'EXTENDED').length
  const completedCount = goals.filter(g => g.status === 'COMPLETED').length
  const upcomingDueCount = goals.filter(g => {
    if (g.status === 'COMPLETED') return false
    const d = new Date(g.targetDate)
    const diff = differenceInDays(d, new Date())
    return (isToday(d) || (diff >= 0 && diff <= 7))
  }).length

  // Filtered goals
  const filteredGoals = goals.filter(g => {
    if (filter === 'IN_PROGRESS' && (g.status !== 'IN_PROGRESS' && g.status !== 'EXTENDED')) return false
    if (filter === 'COMPLETED' && g.status !== 'COMPLETED') return false
    if (selectedCategory !== 'ALL' && g.category !== selectedCategory) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary flex items-center gap-3">
            <Target className="w-8 h-8 text-brand" />
            <span>Mục Tiêu Dài Hạn</span>
          </h1>
          <p className="text-text-secondary mt-1">
            Thiết lập cột mốc cụ thể để định hướng cho những thói quen nhỏ mỗi ngày.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGoal(null)
            setIsModalOpen(true)
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dim text-white font-semibold rounded-xl shadow-lg shadow-brand/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mục Tiêu Mới</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Đang Thực Hiện</p>
            <p className="text-2xl font-bold text-text-primary">{inProgressCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Đến Hạn Trong 7 Ngày</p>
            <p className="text-2xl font-bold text-amber-400">{upcomingDueCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Đã Chinh Phục</p>
            <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-xl border border-surface-border text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'ALL' ? 'bg-brand text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Tất cả ({goals.length})
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'IN_PROGRESS' ? 'bg-brand text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Đang thực hiện ({inProgressCount})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'COMPLETED' ? 'bg-brand text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Đã đạt ({completedCount})
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted font-medium">Lĩnh vực:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-raised border border-surface-border text-text-primary rounded-lg px-2.5 py-1.5 focus:border-brand outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả lĩnh vực</option>
            <option value="RECOVERY">Phục hồi</option>
            <option value="HEALTH">Sức khỏe</option>
            <option value="CAREER">Sự nghiệp</option>
            <option value="PERSONAL">Bản thân</option>
            <option value="GENERAL">Chung</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-text-muted">Đang tải danh sách mục tiêu...</div>
      ) : filteredGoals.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-surface-raised border border-brand/20 flex items-center justify-center mx-auto mb-4 text-brand">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Chưa có mục tiêu nào</h3>
          <p className="text-sm text-text-secondary mb-6">
            Mục tiêu dài hạn là đích đến để thói quen hàng ngày hướng tới. Hãy tạo mục tiêu đầu tiên của bạn nhé.
          </p>
          <button
            onClick={() => {
              setEditingGoal(null)
              setIsModalOpen(true)
            }}
            className="px-5 py-2.5 bg-brand hover:bg-brand-dim text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            Tạo mục tiêu ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => {
                setEditingGoal(g)
                setIsModalOpen(true)
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
              onComplete={(id) => completeMutation.mutate(id)}
              onExtend={(g) => setDueModalGoal(g)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      {/* Due / Extend Modal */}
      <DueGoalModal
        isOpen={!!dueModalGoal}
        goal={dueModalGoal}
        onClose={() => setDueModalGoal(null)}
        onComplete={async (id) => {
          await completeMutation.mutateAsync(id)
        }}
        onExtend={async (id, newDate) => {
          await extendMutation.mutateAsync({ id, newTargetDate: newDate })
        }}
      />
    </div>
  )
}

export default GoalsPage
