// src/main/ipc/index.ts
// Atomic Recovery — IPC handler registry

import { registerRecoveryHandlers } from './recovery.handler'
import { registerHabitHandlers } from './habit.handler'
import { registerEmergencyHandlers } from './emergency.handler'
import { registerJournalHandlers } from './journal.handler'
import { registerMoodHandlers } from './mood.handler'
import { registerIdentityHandlers } from './identity.handler'
import { registerSettingsHandlers } from './settings.handler'
import { registerAnalyticsHandlers } from './analytics.handler'
import { registerPinHandlers } from './pin.handler'

export function registerAllIpcHandlers(): void {
  registerRecoveryHandlers()
  registerHabitHandlers()
  registerEmergencyHandlers()
  registerJournalHandlers()
  registerMoodHandlers()
  registerIdentityHandlers()
  registerSettingsHandlers()
  registerAnalyticsHandlers()
  registerPinHandlers()
  console.log('[IPC] All handlers registered')
}
