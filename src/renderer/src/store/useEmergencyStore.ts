import { create } from 'zustand'

interface EmergencyState {
  isEmergencyActive: boolean
  triggerEmergency: () => void
  closeEmergency: () => void
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  isEmergencyActive: false,
  triggerEmergency: () => set({ isEmergencyActive: true }),
  closeEmergency: () => set({ isEmergencyActive: false })
}))
