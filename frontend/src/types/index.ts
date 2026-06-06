export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface FridgeItem {
  id: string
  user_id: string
  name: string
  category: FridgeCategory
  quantity: string
  unit?: string
  expiry_date?: string
  emoji?: string
  added_via: 'manual' | 'scan_fridge' | 'scan_receipt'
  created_at: string
}

export type FridgeCategory = 
  | 'meat' 
  | 'poultry' 
  | 'seafood' 
  | 'vegetable' 
  | 'dairy' 
  | 'fruit' 
  | 'grain' 
  | 'condiment' 
  | 'beverage' 
  | 'other';

export interface Recipe {
  id: string
  user_id?: string
  title: string
  description: string
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  cuisine?: string
  prep_time_min: number
  cook_time_min: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  image_url?: string
  ai_generated: boolean
  created_at: string
  saved?: boolean
}

export interface RecipeIngredient {
  name: string
  amount: string
  unit?: string
  available?: boolean   // matched to fridge
}

export interface RecipeStep {
  step: number
  instruction: string
  duration_min?: number
  tip?: string
}

export interface ScanResult {
  items: Partial<FridgeItem>[]
  raw_text?: string
  confidence: number
}

export interface MealPlan {
  id: string
  user_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipe_id?: string
  recipe_title: string
  notes?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}
