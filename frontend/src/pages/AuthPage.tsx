import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, isDemoMode, enableDemoMode } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, fullName)

    if (result.error) {
      setError(result.error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const handleDemo = () => {
    setLoading(true);
    enableDemoMode(); 
    navigate('/dashboard', { replace: true });
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Đổi màu gradient sang tông xanh tươi mát */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-500 to-teal-700 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[32rem] h-[32rem] rounded-full bg-teal-900/30 blur-2xl" />
        <div className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col justify-center h-full max-w-xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
              <ChefHat size={28} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wide">Kitchen Hero</span>
          </div>
          
          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Cook smarter,<br />waste less.
          </h1>
          
          <p className="text-emerald-50 text-lg leading-relaxed mb-12 opacity-90 max-w-md">
            Scan your fridge, let AI suggest what to cook tonight. No more staring at the fridge wondering.
          </p>
          
          <div className="space-y-6">
            {[
              { icon: '📸', text: 'Scan your fridge or receipt instantly' },
              { icon: '🤖', text: 'AI-powered recipe suggestions from your ingredients' },
              { icon: '⏰', text: 'Smart expiry tracking — nothing goes to waste' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-5 text-base font-medium">
                <span className="text-2xl bg-white/10 p-3.5 rounded-2xl border border-white/10 shadow-sm">{f.icon}</span>
                <span className="text-white text-lg">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <ChefHat size={18} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold">Kitchen Hero</span>
          </div>

          {isDemoMode && (
            <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
              <strong>Demo mode</strong> — Supabase not configured. All features work locally.
            </div>
          )}

          <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-ink-500 text-base mb-8 font-medium">
            {mode === 'login' ? 'Sign in to your Kitchen Hero account' : 'Start your AI cooking journey'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-ink-700 mb-2">Full name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-11 py-3 focus:ring-emerald-500/20 focus:border-emerald-500"
                    type="text"
                    placeholder="Alex Chen"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  className="input pl-11 py-3 focus:ring-emerald-500/20 focus:border-emerald-500"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  className="input pl-11 pr-11 py-3 focus:ring-emerald-500/20 focus:border-emerald-500"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3.5 text-base mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="btn-ghost w-full gap-2 py-3.5 text-base border-2 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Sparkles size={18} className="text-emerald-500" />
            Continue with demo mode
          </button>

          <p className="text-center text-sm text-ink-500 mt-8 font-medium">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}