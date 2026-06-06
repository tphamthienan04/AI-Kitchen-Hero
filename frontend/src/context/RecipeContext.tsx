import { createContext, useContext, useState, ReactNode, useEffect } from 'react' // Thêm useEffect
import { useAuth } from './AuthContext'
import { getSavedRecipes, saveRecipe, deleteRecipe } from '../lib/supabase'
import type { Recipe } from '../types'
import { DEMO_RECIPES } from '../lib/ai'

interface RecipeContextValue {
  saved: Recipe[]
  generated: Recipe[]
  loadSaved: () => Promise<void>
  saveToCollection: (recipe: Recipe) => Promise<void>
  removeFromCollection: (id: string) => Promise<void>
  setGenerated: (recipes: Recipe[]) => void
  isSaved: (id: string) => boolean
}

const RecipeContext = createContext<RecipeContextValue | null>(null)
const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState<Recipe[]>(IS_DEMO ? [DEMO_RECIPES[0]] : [])
  const [generated, setGenerated] = useState<Recipe[]>(IS_DEMO ? DEMO_RECIPES : [])

  useEffect(() => {
    if (user && !IS_DEMO) {
      loadSaved();
    }
  }, [user]); 

  const loadSaved = async () => {
    if (!user || IS_DEMO) return
    const { data } = await getSavedRecipes(user.id)
    if (data) setSaved(data as Recipe[])
  }

  const saveToCollection = async (recipe: Recipe) => {
    if (!user) return
    const toSave = { ...recipe, user_id: user.id, saved: true }
    if (!IS_DEMO) {
      const { data } = await saveRecipe(toSave)
      if (data) { setSaved(prev => [data as Recipe, ...prev]); return }
    }
    setSaved(prev => [toSave, ...prev])
  }

  const removeFromCollection = async (id: string) => {
    if (!IS_DEMO) await deleteRecipe(id)
    setSaved(prev => prev.filter(r => r.id !== id))
  }

  const isSaved = (id: string) => saved.some(r => r.id === id)

  return (
    <RecipeContext.Provider value={{ saved, generated, loadSaved, saveToCollection, removeFromCollection, setGenerated, isSaved }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipes must be used within RecipeProvider')
  return ctx
}
