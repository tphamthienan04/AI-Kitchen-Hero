import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase env vars missing. Using demo mode.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ─── Auth helpers ──────────────────────────────────────────────
export const signUp = (email: string, password: string, fullName: string) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ─── Fridge helpers ────────────────────────────────────────────
export const getFridgeItems = (userId: string) =>
  supabase
    .from('fridge_items')
    .select('*')
    .eq('user_id', userId)
    .order('expiry_date', { ascending: true, nullsFirst: false })

export const addFridgeItem = (item: Omit<import('../types').FridgeItem, 'id' | 'created_at'>) =>
  supabase.from('fridge_items').insert(item).select().single()

export const updateFridgeItem = (id: string, updates: Partial<import('../types').FridgeItem>) =>
  supabase.from('fridge_items').update(updates).eq('id', id)

export const deleteFridgeItem = (id: string) =>
  supabase.from('fridge_items').delete().eq('id', id)

// ─── Recipe helpers ────────────────────────────────────────────
export const getSavedRecipes = (userId: string) =>
  supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)

export const saveRecipe = async (recipe: any) => {
  const dataToInsert = {
    user_id: recipe.user_id,
    title: recipe.title,
    description: recipe.description || null,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    cuisine: recipe.cuisine || null,
    prep_time_min: recipe.prep_time_min || 0,
    cook_time_min: recipe.cook_time_min || 0,
    servings: recipe.servings || 2,
    
    difficulty: recipe.difficulty ? recipe.difficulty.toLowerCase() : 'easy',
    
    tags: recipe.tags || [],
    image_url: recipe.image_url || null,
    ai_generated: recipe.ai_generated !== undefined ? recipe.ai_generated : true
    
    
  };

  try {
    const response = await supabase
      .from('recipes')
      .insert([dataToInsert])
      .select()
      .single();

    if (response.error) {
      console.error("Fail from Supabase (Detail):", response.error.message);
    }
    return response;
  } catch (err) {
    console.error("Fail from Internet:", err);
    return { data: null, error: err };
  }
}

export const deleteRecipe = (id: string) =>
  supabase.from('recipes').delete().eq('id', id)

// ─── Meal plan helpers ─────────────────────────────────────────
export const getMealPlans = (userId: string, weekStart: string) =>
  supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .gte('date', weekStart)
    .order('date', { ascending: true })

export const upsertMealPlan = (plan: Omit<import('../types').MealPlan, 'id'>) =>
  supabase.from('meal_plans').upsert(plan).select().single()
