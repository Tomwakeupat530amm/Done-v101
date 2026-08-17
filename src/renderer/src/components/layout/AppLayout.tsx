import { Link } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Book, Settings as SettingsIcon } from 'lucide-react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">Atomic Recovery</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/habits" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <CheckSquare className="w-5 h-5" />
            Habits
          </Link>
          <Link to="/journal" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <Book className="w-5 h-5" />
            Journal
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  )
}
