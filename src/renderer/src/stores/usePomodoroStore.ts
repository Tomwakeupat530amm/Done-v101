import { create } from 'zustand'
import { playTingSound } from '../lib/sound'

export type PomodoroPreset = 'CLASSIC' | 'DEEP' | 'SPRINT' | 'CUSTOM'
export type PomodoroMode = 'WORK' | 'BREAK'

export const PRESET_TIMES: Record<Exclude<PomodoroPreset, 'CUSTOM'>, { work: number; break: number }> = {
  CLASSIC: { work: 25, break: 5 },
  DEEP: { work: 50, break: 10 },
  SPRINT: { work: 15, break: 3 }
}

interface PomodoroState {
  activeTaskId: string | null
  activeTaskTitle: string | null
  mode: PomodoroMode
  preset: PomodoroPreset
  timeLeft: number // in seconds
  totalDuration: number // in seconds
  isRunning: boolean
  isBarVisible: boolean
  customWorkMinutes: number
  customBreakMinutes: number
  completedSessions: number

  // Actions
  startForTask: (taskId: string, taskTitle: string) => void
  toggleTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipPhase: () => void
  setPreset: (preset: PomodoroPreset) => void
  setCustomTime: (work: number, breakTime: number) => void
  closeBar: () => void
  openBar: () => void
  tick: () => void
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  activeTaskId: null,
  activeTaskTitle: null,
  mode: 'WORK',
  preset: 'CLASSIC',
  timeLeft: 25 * 60,
  totalDuration: 25 * 60,
  isRunning: false,
  isBarVisible: false,
  customWorkMinutes: 25,
  customBreakMinutes: 5,
  completedSessions: 0,

  startForTask: (taskId, taskTitle) => {
    const { preset, customWorkMinutes } = get()
    const workMinutes = preset === 'CUSTOM' ? customWorkMinutes : PRESET_TIMES[preset].work
    const seconds = workMinutes * 60

    set({
      activeTaskId: taskId,
      activeTaskTitle: taskTitle,
      mode: 'WORK',
      timeLeft: seconds,
      totalDuration: seconds,
      isRunning: true,
      isBarVisible: true
    })
  },

  toggleTimer: () => {
    set((state) => ({ isRunning: !state.isRunning }))
  },

  pauseTimer: () => {
    set({ isRunning: false })
  },

  resetTimer: () => {
    const { mode, preset, customWorkMinutes, customBreakMinutes } = get()
    let minutes: number
    if (preset === 'CUSTOM') {
      minutes = mode === 'WORK' ? customWorkMinutes : customBreakMinutes
    } else {
      minutes = mode === 'WORK' ? PRESET_TIMES[preset].work : PRESET_TIMES[preset].break
    }
    const seconds = minutes * 60
    set({
      timeLeft: seconds,
      totalDuration: seconds,
      isRunning: false
    })
  },

  skipPhase: () => {
    const { mode, preset, customWorkMinutes, customBreakMinutes } = get()
    const nextMode: PomodoroMode = mode === 'WORK' ? 'BREAK' : 'WORK'
    let minutes: number
    if (preset === 'CUSTOM') {
      minutes = nextMode === 'WORK' ? customWorkMinutes : customBreakMinutes
    } else {
      minutes = nextMode === 'WORK' ? PRESET_TIMES[preset].work : PRESET_TIMES[preset].break
    }
    const seconds = minutes * 60
    set({
      mode: nextMode,
      timeLeft: seconds,
      totalDuration: seconds,
      isRunning: false
    })
  },

  setPreset: (preset) => {
    const { mode, customWorkMinutes, customBreakMinutes } = get()
    let minutes: number
    if (preset === 'CUSTOM') {
      minutes = mode === 'WORK' ? customWorkMinutes : customBreakMinutes
    } else {
      minutes = mode === 'WORK' ? PRESET_TIMES[preset].work : PRESET_TIMES[preset].break
    }
    const seconds = minutes * 60
    set({
      preset,
      timeLeft: seconds,
      totalDuration: seconds,
      isRunning: false
    })
  },

  setCustomTime: (work, breakTime) => {
    const validWork = Math.max(1, Math.min(180, work))
    const validBreak = Math.max(1, Math.min(60, breakTime))
    const { mode } = get()
    const minutes = mode === 'WORK' ? validWork : validBreak
    const seconds = minutes * 60

    set({
      preset: 'CUSTOM',
      customWorkMinutes: validWork,
      customBreakMinutes: validBreak,
      timeLeft: seconds,
      totalDuration: seconds,
      isRunning: false
    })
  },

  closeBar: () => {
    set({ isBarVisible: false })
  },

  openBar: () => {
    set({ isBarVisible: true })
  },

  tick: () => {
    const state = get()
    if (!state.isRunning) return

    if (state.timeLeft > 1) {
      set({ timeLeft: state.timeLeft - 1 })
    } else {
      // Reached 00:00!
      playTingSound(1.0)

      if (state.mode === 'WORK') {
        // Increment pomodoro count in DB for task if active
        if (state.activeTaskId) {
          window.api.task.incrementPomodoro(state.activeTaskId).catch((err) => {
            console.error('Failed to increment pomodoro on task:', err)
          })
        }

        const nextMode: PomodoroMode = 'BREAK'
        const breakMinutes = state.preset === 'CUSTOM'
          ? state.customBreakMinutes
          : PRESET_TIMES[state.preset].break
        const breakSeconds = breakMinutes * 60

        set({
          mode: nextMode,
          timeLeft: breakSeconds,
          totalDuration: breakSeconds,
          completedSessions: state.completedSessions + 1,
          isRunning: true // Auto start break
        })
      } else {
        // Break is over
        const nextMode: PomodoroMode = 'WORK'
        const workMinutes = state.preset === 'CUSTOM'
          ? state.customWorkMinutes
          : PRESET_TIMES[state.preset].work
        const workSeconds = workMinutes * 60

        set({
          mode: nextMode,
          timeLeft: workSeconds,
          totalDuration: workSeconds,
          isRunning: false // Wait for user to start work
        })
      }
    }
  }
}))
