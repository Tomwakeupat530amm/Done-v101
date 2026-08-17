// src/preload/index.d.ts
// Atomic Recovery — Window API type augmentation for renderer

import type { ElectronAPI } from '@electron-toolkit/preload'
import type { WindowApi } from '../shared/types/ipc.types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowApi
  }
}
