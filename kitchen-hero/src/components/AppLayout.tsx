import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Refrigerator, Sparkles, BookOpen, LogOut, ChefHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/fridge',    icon: Refrigerator,    label: 'Fridge' },
  { to: '/ai-chef',   icon: Sparkles,        label: 'AI Chef' },
  { to: '/recipes',   icon: BookOpen,        label: 'Recipes' },
]

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
              <ChefHat size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-ink-900">Kitchen Hero</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-semibold">
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-ink-600 hidden sm:block">
                {user?.full_name || user?.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-surface-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-surface-200">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
