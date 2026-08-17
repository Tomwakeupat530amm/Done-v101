import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { IdentityStatement } from '../../../../shared/types/identity.types'
import type { AddStatementDto } from '../../../../shared/types/ipc.types'
import { useTranslation } from 'react-i18next'

export function IdentityStatements() {
  const queryClient = useQueryClient()
  const [newStatement, setNewStatement] = useState('')
  const { t } = useTranslation()

  const { data: statements = [] } = useQuery({
    queryKey: ['identity', 'statements'],
    queryFn: () => window.api.identity.getStatements() as Promise<IdentityStatement[]>
  })

  const addMutation = useMutation({
    mutationFn: (data: AddStatementDto) => window.api.identity.addStatement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity', 'statements'] })
      setNewStatement('')
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => window.api.identity.removeStatement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity', 'statements'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStatement.trim()) return
    addMutation.mutate({ text: newStatement.trim(), category: 'RECOVERY' })
  }

  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6">
      <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        {t('identity.statementsTitle', 'Core Beliefs / Affirmations')}
      </h2>
      
      <div className="space-y-3 mb-6">
        {statements.map(stmt => (
          <div key={stmt.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl group border border-transparent hover:border-white/10 transition-all">
            <span className="flex-1 text-sm text-[var(--color-text-primary)]">{stmt.text}</span>
            <button
              onClick={() => removeMutation.mutate(stmt.id)}
              className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newStatement}
          onChange={(e) => setNewStatement(e.target.value)}
          placeholder={t('identity.addStatementPlaceholder', 'e.g. I am a person who finishes what they start.')}
          className="flex-1 bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-xl px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
        />
        <button
          type="submit"
          disabled={!newStatement.trim() || addMutation.isPending}
          className="p-2 bg-[var(--color-brand)] text-white rounded-xl disabled:opacity-50 hover:bg-[var(--color-brand-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
