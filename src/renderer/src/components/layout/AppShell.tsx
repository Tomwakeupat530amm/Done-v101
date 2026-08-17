// src/renderer/src/components/layout/AppShell.tsx
// Main app shell: TitleBar + Sidebar + MainContent + Global providers mount point

import { Outlet } from 'react-router-dom'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div
      className="flex flex-col"
      style={{
        height: '100vh',
        backgroundColor: 'var(--color-surface-base)',
        overflow: 'hidden'
      }}
    >
      {/* Custom title bar */}
      <TitleBar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ backgroundColor: 'var(--color-surface-base)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
