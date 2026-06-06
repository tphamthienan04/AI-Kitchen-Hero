import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertTriangle, ChevronRight, Refrigerator, Clock, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFridge } from '../context/FridgeContext'
import { useRecipes } from '../context/RecipeContext'

function daysUntilExpiry(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0)
  return Math.ceil(diff / 86400000)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { items, getExpiringItems } = useFridge()
  const { saved } = useRecipes()
  const navigate = useNavigate()

  const expiring = getExpiringItems(3)
  const firstName = (user?.full_name || user?.email || 'Chef').split(' ')[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Hero greeting */}
      <div>
        <p className="text-ink-400 text-sm">{greeting}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {firstName} 👋
        </h1>
      </div>

      {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-semibold text-ink-900">{items.length}</div>
          <div className="text-xs text-ink-400 mt-0.5">In fridge</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-600">{expiring.length}</div>
          <div className="text-xs text-ink-400 mt-0.5">Expiring soon</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-semibold text-ink-900">{saved.length}</div>
          <div className="text-xs text-ink-400 mt-0.5">Saved recipes</div>
        </div>
      </div>

      {/* Expiring alert */}
      {expiring.length > 0 && (
        <div className="card p-4 border-emerald-100 bg-emerald-50">
          <div className="flex items-center gap-4 mt-3 text-xs text-ink-500">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Use these soon</span>
            </div>
            <button
              className="text-xs text-emerald-700 font-medium flex items-center gap-1"
              onClick={() => navigate('/ai-chef')}
            >
              Cook now <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {expiring.map(item => {
              const days = daysUntilExpiry(item.expiry_date!)
              return (
                <div key={item.id} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 border border-emerald-100">
                  <span>{item.emoji}</span>
                  <span className="text-xs text-ink-700 font-medium">{item.name}</span>
                  <span className={`text-xs ${days <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {days <= 0 ? 'Expired' : days === 1 ? '1 day' : `${days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/ai-chef')}
            className="card p-4 text-left hover:border-emerald-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
              <Sparkles size={20} className="text-emerald-500" />
            </div>
            <div className="text-sm font-medium text-ink-900">AI Chef</div>
            <div className="text-xs text-ink-400 mt-0.5">Generate recipes from your fridge</div>
          </button>
          <button
            onClick={() => navigate('/fridge')}
            className="card p-4 text-left hover:border-emerald-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
              <Refrigerator size={20} className="text-emerald-600" />
            </div>
            <div className="text-sm font-medium text-ink-900">My Fridge</div>
            <div className="text-xs text-ink-400 mt-0.5">Manage ingredients</div>
          </button>
        </div>
      </div>

      {/* Saved recipes preview */}
      {saved.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-ink-400 uppercase tracking-wide">Saved recipes</h2>
            <button className="text-xs text-emerald-500 font-medium flex items-center gap-1" onClick={() => navigate('/recipes')}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {saved.slice(0, 3).map(recipe => (
              <div
                key={recipe.id}
                className="card p-3 flex items-center gap-3 cursor-pointer hover:border-emerald-200 transition-all"
                onClick={() => navigate('/recipes')}
              >
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  🍳
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink-900 truncate">{recipe.title}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-ink-400 flex items-center gap-1">
                      <Clock size={11} /> {recipe.prep_time_min + recipe.cook_time_min}m
                    </span>
                    <span className="text-xs text-ink-400">{recipe.servings} servings</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {saved.length === 0 && (
        <div className="card p-8 text-center">
          <BookOpen size={32} className="text-ink-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-ink-600">No saved recipes yet</p>
          <p className="text-xs text-ink-400 mt-1">Generate some recipes with AI Chef</p>
          <button className="btn-primary mt-4 text-xs" onClick={() => navigate('/ai-chef')}>
            <Sparkles size={14} /> Try AI Chef
          </button>
        </div>
      )}
    </div>
  )
}
