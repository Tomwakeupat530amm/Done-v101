import './i18n'
import './assets/main.css'

import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// The floating task widget is the same bundle, routed by hash (#/widget)
const isWidget = window.location.hash.startsWith('#/widget')
const WidgetApp = lazy(() => import('./features/widget/WidgetApp'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWidget ? (
      <Suspense fallback={null}>
        <WidgetApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
)
