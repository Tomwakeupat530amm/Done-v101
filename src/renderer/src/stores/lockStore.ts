// src/renderer/src/stores/lockStore.ts
import { create } from 'zustand'

interface LockState {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

export const useLockStore = create<LockState>((set) => ({
  isLocked: false,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false })
}))
