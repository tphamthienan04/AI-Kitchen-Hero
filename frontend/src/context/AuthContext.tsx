import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User, AuthState } from '../types'

interface AuthContextValue extends AuthState {
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isDemoMode: boolean
  enableDemoMode: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@kitchenhero.app',
  full_name: 'Alex Chen',
  created_at: new Date().toISOString(),
}

const IS_SUPABASE_CONFIGURED = !!import.meta.env.VITE_SUPABASE_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  // Thay đổi: user mặc định là null, chỉ có khi đã đăng nhập hoặc demo
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(IS_SUPABASE_CONFIGURED)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const enableDemoMode = () => {
    setIsDemoMode(true)
    setUser(DEMO_USER)
    setLoading(false) // Tắt loading để vào thẳng dashboard
  }

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          full_name: data.session.user.user_metadata?.full_name,
          avatar_url: data.session.user.user_metadata?.avatar_url,
          created_at: data.session.user.created_at,
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      if (sess?.user) {
        setUser({
          id: sess.user.id,
          email: sess.user.email!,
          full_name: sess.user.user_metadata?.full_name,
          avatar_url: sess.user.user_metadata?.avatar_url,
          created_at: sess.user.created_at,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error: error as Error | null }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsDemoMode(false)
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      isDemoMode: isDemoMode, // Chỉ phụ thuộc vào state của nút bấm
      enableDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}