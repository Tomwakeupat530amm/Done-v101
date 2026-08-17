// src/renderer/src/components/ui/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">Đã xảy ra lỗi</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-5 max-w-xs">
            {this.state.error?.message ?? 'Không xác định được lỗi'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] hover:border-indigo-500/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
