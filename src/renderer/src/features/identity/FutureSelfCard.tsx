import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FutureSelf } from '../../../../shared/types/identity.types'
import type { UpdateFutureSelfDto } from '../../../../shared/types/ipc.types'
import { useTranslation } from 'react-i18next'

export function FutureSelfCard() {
  const queryClient = useQueryClient()
  const [vision, setVision] = useState('')
  const [traits, setTraits] = useState('')
  const { t } = useTranslation()

  const { data: futureSelf } = useQuery({
    queryKey: ['identity', 'futureSelf'],
    queryFn: () => window.api.identity.getFutureSelf() as Promise<FutureSelf | null>
  })

  useEffect(() => {
    if (futureSelf) {
      setVision(futureSelf.visionText)
      try {
        setTraits(JSON.parse(futureSelf.keyTraits).join(', '))
      } catch {
        // ignore
      }
    }
  }, [futureSelf])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateFutureSelfDto) => window.api.identity.updateFutureSelf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity', 'futureSelf'] })
    }
  })

  const handleBlur = () => {
    const traitsArray = traits.split(',').map(t => t.trim()).filter(Boolean)
    updateMutation.mutate({
      visionText: vision,
      keyTraits: traitsArray
    })
  }

  return (
    <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl p-6 space-y-6">
      <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
        {t('identity.futureSelfTitle', 'Future Self Vision')}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">{t('identity.visionLabel', 'Vision')}</label>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('identity.visionPlaceholder', 'Describe the person you want to become...')}
            className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-xl p-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none h-32"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">{t('identity.traitsLabel', 'Key Traits (Comma separated)')}</label>
          <input
            type="text"
            value={traits}
            onChange={(e) => setTraits(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('identity.traitsPlaceholder', 'e.g. Disciplined, Calm, Focused')}
            className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-xl px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
          />
        </div>
      </div>
    </div>
  )
}
