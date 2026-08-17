// src/renderer/src/pages/SettingsPage.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Shield, ChevronRight, Check, Eye, EyeOff, Database
} from 'lucide-react'
import { toast } from 'sonner'

type SettingsData = {
  theme: string
  accentColor: string
  language: string
  pinEnabled: boolean
  notificationsOn: boolean
  morningReminderAt: string | null
  eveningReminderAt: string | null
  emergencyButtonVisible: boolean
  compactMode: boolean
}

const ACCENT_COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Amber', value: '#f59e0b' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] px-1 mb-3">
        {title}
      </h2>
      <div className="bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-surface-border)]">
        {children}
      </div>
    </div>
  )
}

function Row({ label, sub, children }: { label: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        {sub && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-surface-border)]'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()
  const [pinMode, setPinMode] = useState<'idle' | 'enter' | 'confirm'>('idle')
  const [pinInput, setPinInput] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [showPin, setShowPin] = useState(false)

  const { data: settings } = useQuery<SettingsData>({
    queryKey: ['settings'],
    queryFn: () => window.api.settings.get() as Promise<SettingsData>
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SettingsData>) => window.api.settings.update(data),
    onSuccess: (updatedSettings) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      if (updatedSettings?.language) i18n.changeLanguage(updatedSettings.language)
      toast.success(t('common.save', 'Đã lưu'))
    }
  })

  const handleToggle = (key: keyof SettingsData, value: boolean) => {
    updateMutation.mutate({ [key]: value })
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    updateMutation.mutate({ language: lang })
  }

  const handlePinSave = () => {
    if (pinMode === 'enter') {
      if (pinInput.length < 4) { toast.error(t('settings.pinLengthError', 'PIN phải có ít nhất 4 chữ số')); return }
      setPinMode('confirm')
      return
    }
    if (pinMode === 'confirm') {
      if (pinInput !== pinConfirm) { toast.error(t('settings.pinMatchError', 'PIN không khớp')); return }
      updateMutation.mutate({ pinEnabled: true })
      setPinMode('idle')
      setPinInput('')
      setPinConfirm('')
      toast.success(t('settings.pinSetSuccess', 'PIN đã được thiết lập'))
    }
  }

  if (!settings) return (
    <div className="flex items-center justify-center h-64 text-[var(--color-text-muted)]">
      <div className="w-5 h-5 rounded-full border-2 border-t-[var(--color-brand)] animate-spin" />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-8 pb-24"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">{t('nav.settings', 'Settings')}</h1>
        <p className="text-[var(--color-text-tertiary)]">{t('settings.description', 'Tuỳ chỉnh Atomic Recovery theo ý muốn của bạn.')}</p>
      </div>

      {/* Appearance */}
      <Section title={t('settings.appearance', 'Giao diện')}>
        <Row label={t('settings.accentColor', 'Màu nhấn')} sub={t('settings.accentColorSub', 'Màu chủ đạo của app')}>
          <div className="flex gap-2">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => updateMutation.mutate({ accentColor: c.value })}
                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundColor: c.value,
                  borderColor: settings.accentColor === c.value ? 'white' : 'transparent'
                }}
              >
                {settings.accentColor === c.value && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </Row>
        <Row label={t('settings.language', 'Ngôn ngữ')} sub={t('settings.languageSub', 'Chọn ngôn ngữ giao diện')}>
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[var(--color-surface-base)] text-[var(--color-text-primary)] text-sm rounded-md border border-[var(--color-surface-border)] px-3 py-1.5 focus:outline-none focus:border-[var(--color-brand)]"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </Row>

        <Row label={t('settings.compactMode', 'Compact mode')} sub={t('settings.compactModeSub', 'Giao diện thu gọn hơn')}>
          <Toggle value={settings.compactMode} onChange={v => handleToggle('compactMode', v)} />
        </Row>
      </Section>

      {/* Privacy */}
      <Section title={t('settings.privacy', 'Bảo mật & Quyền riêng tư')}>
        <Row label={t('settings.emergencyButton', 'Emergency button')} sub={t('settings.emergencyButtonSub', 'Luôn hiển thị nút khẩn cấp trong sidebar')}>
          <Toggle value={settings.emergencyButtonVisible} onChange={v => handleToggle('emergencyButtonVisible', v)} />
        </Row>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('settings.pinLock', 'PIN Lock')}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {settings.pinEnabled ? t('settings.pinLockSubOn', 'PIN đã được bật') : t('settings.pinLockSubOff', 'Bảo vệ app bằng mã PIN 4-6 chữ số')}
              </p>
            </div>
            {!pinMode || pinMode === 'idle' ? (
              <button
                onClick={() => setPinMode('enter')}
                className="text-xs px-3 py-1.5 bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] text-[var(--color-text-primary)] rounded-lg hover:border-[var(--color-brand)] transition-colors"
              >
                {settings.pinEnabled ? t('settings.changePin', 'Đổi PIN') : t('settings.setPin', 'Thiết lập PIN')}
              </button>
            ) : null}
          </div>
          {(pinMode === 'enter' || pinMode === 'confirm') && (
            <div className="space-y-3 pt-2 border-t border-[var(--color-surface-border)]">
              <p className="text-xs text-[var(--color-text-secondary)]">
                {pinMode === 'enter' ? t('settings.enterNewPin', 'Nhập PIN mới (4-6 chữ số):') : t('settings.confirmPin', 'Nhập lại PIN để xác nhận:')}
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={pinMode === 'enter' ? pinInput : pinConfirm}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '')
                      if (pinMode === 'enter') setPinInput(v)
                      else setPinConfirm(v)
                    }}
                    placeholder="••••"
                    className="w-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={handlePinSave}
                  className="px-4 py-2.5 bg-[var(--color-brand)] text-white text-sm rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors"
                >
                  {pinMode === 'enter' ? t('settings.next', 'Tiếp') : t('settings.save', 'Lưu')}
                </button>
                <button
                  onClick={() => { setPinMode('idle'); setPinInput(''); setPinConfirm('') }}
                  className="px-3 py-2.5 text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {t('settings.cancel', 'Huỷ')}
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Notifications */}
      <Section title={t('settings.notifications', 'Thông báo')}>
        <Row label={t('settings.enableNotifications', 'Bật thông báo')} sub={t('settings.dailyReminders', 'Nhắc nhở hàng ngày')}>
          <Toggle value={settings.notificationsOn} onChange={v => handleToggle('notificationsOn', v)} />
        </Row>
        {settings.notificationsOn && (
          <>
            <Row label={t('settings.morningReminder', 'Nhắc buổi sáng')} sub={t('settings.morningReminderSub', 'Giờ check-in đầu ngày')}>
              <input
                type="time"
                defaultValue={settings.morningReminderAt ?? '07:00'}
                onBlur={e => updateMutation.mutate({ morningReminderAt: e.target.value })}
                className="bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-2 py-1 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </Row>
            <Row label={t('settings.eveningReminder', 'Nhắc buổi tối')} sub={t('settings.eveningReminderSub', 'Giờ reflection cuối ngày')}>
              <input
                type="time"
                defaultValue={settings.eveningReminderAt ?? '21:00'}
                onBlur={e => updateMutation.mutate({ eveningReminderAt: e.target.value })}
                className="bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] rounded-lg px-2 py-1 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </Row>
          </>
        )}
      </Section>

      {/* Data */}
      <Section title={t('settings.data', 'Dữ liệu')}>
        <Row label={t('settings.exportData', 'Backup dữ liệu')} sub={t('settings.exportDataSub', 'Xuất toàn bộ dữ liệu ra file')}>
          <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <Database className="w-4 h-4" />
            {t('settings.exportDataBtn', 'Xuất backup')}
            <ChevronRight className="w-3 h-3" />
          </button>
        </Row>
      </Section>

      {/* About */}
      <Section title={t('settings.info', 'Thông tin')}>
        <Row label={t('settings.version', 'Phiên bản')} sub="Atomic Recovery">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">v0.1.0</span>
        </Row>
        <Row label={t('settings.storage', 'Lưu trữ')} sub={t('settings.storageSub', 'SQLite local — dữ liệu 100% trên máy bạn')}>
          <Shield className="w-4 h-4 text-emerald-500" />
        </Row>
      </Section>
    </motion.div>
  )
}
