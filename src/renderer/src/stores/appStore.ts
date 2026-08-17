// src/renderer/src/stores/appStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  isEmergencyOpen: boolean
  openEmergency: () => void
  closeEmergency: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
      isEmergencyOpen: false,
      openEmergency: () => set({ isEmergencyOpen: true }),
      closeEmergency: () => set({ isEmergencyOpen: false })
    }),
    { name: 'app-store', partialize: (s) => ({ isSidebarCollapsed: s.isSidebarCollapsed }) }
  )
)
