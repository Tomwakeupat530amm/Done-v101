import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { IdentityStatements } from '../features/identity/IdentityStatements'
import { FutureSelfCard } from '../features/identity/FutureSelfCard'
import type { IdentityProfile } from '../../../shared/types/identity.types'
import type { UpdateProfileDto } from '../../../shared/types/ipc.types'

export default function IdentityPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [statement, setStatement] = useState('')

  const { data: profile } = useQuery({
    queryKey: ['identity', 'profile'],
    queryFn: () => window.api.identity.getProfile() as Promise<IdentityProfile | null>
  })

  useEffect(() => {
    if (profile) {
      setStatement(profile.identityStatement)
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => window.api.identity.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity', 'profile'] })
    }
  })

  const handleBlur = () => {
    if (statement !== profile?.identityStatement) {
      updateMutation.mutate({ identityStatement: statement })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
          {t('identity.title', 'Identity Shift')}
        </h1>
        <p className="text-[var(--color-text-tertiary)]">
          {t('identity.subtitle', "True behavior change is identity change. You are not a person trying to quit. You are a person who doesn't do it.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Main Identity Statement */}
          <div className="bg-gradient-to-br from-[var(--color-brand)] to-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/10">
            <h2 className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-4">{t('identity.iAm', 'I AM')}</h2>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              onBlur={handleBlur}
              placeholder={t('identity.statementPlaceholder', 'vd: Tôi là người luôn hoàn thành những gì đã bắt đầu.')}
              className="w-full bg-transparent text-2xl font-bold placeholder-white/50 focus:outline-none resize-none overflow-hidden"
              style={{ minHeight: '100px' }}
            />
          </div>

          {/* Future Self Vision */}
          <FutureSelfCard />
        </div>

        <div className="space-y-8">
          {/* Affirmations List */}
          <IdentityStatements />
        </div>
      </div>
    </div>
  )
}
