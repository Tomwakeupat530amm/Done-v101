import { create } from 'zustand'

interface HabitState {
  habits: any[]
  setHabits: (habits: any[]) => void
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  setHabits: (habits) => set({ habits })
}))
