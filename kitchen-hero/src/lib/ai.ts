import type { FridgeItem, Recipe, ScanResult } from '../types'

// New backend integration (FastAPI) — calls moved to backend at port 8000
const BACKEND_BASE = 'http://localhost:8000'

// ─── 1. Generate recipes from fridge items via backend ────────────────────
export async function generateRecipesFromIngredients(
  items: FridgeItem[],
  preferences?: string
): Promise<Recipe[]> {
  try {
    const resp = await fetch(`${BACKEND_BASE}/api/ai-chef/generate-recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, preferences }),
    });

    if (!resp.ok) {
      throw new Error(`Backend returned ${resp.status}`);
    }

    const data = await resp.json();
    console.log("Dữ liệu nhận từ Backend:", data); 
    
    
    return data.recipes || []; 
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    return []; 
  }
}

export async function parseScannedImage(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  scanType: 'fridge' | 'receipt'
): Promise<ScanResult> {
  try {
    const resp = await fetch(`${BACKEND_BASE}/api/vision/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: base64Image, mime_type: mimeType, scan_type: scanType }),
    })
    if (resp.ok) {
      const data = await resp.json()
      return { items: data.items || [], confidence: data.confidence ?? 0 }
    }
  } catch {
    // fall back to demo
  }
  // Demo fallback
  return {
    items: [{ name: 'Demo Item', category: 'other', quantity: '1', unit: '', emoji: '📦' }],
    confidence: 0.9,
  }
}

export const DEMO_RECIPES: Recipe[] = [

  {
    id: '1',
    title: 'Garlic Butter Steak Stir-fry',
    description: 'A quick, flavour-packed stir-fry that comes together in under 20 minutes. Bold garlic notes balance the rich butter sauce.',
    cuisine: 'Fusion',
    prep_time_min: 10,
    cook_time_min: 12,
    servings: 2,
    difficulty: 'easy',
    tags: ['beef', 'quick', 'weeknight'],
    ai_generated: true,
    ingredients: [
      { name: 'Beef sirloin', amount: '300', unit: 'g', available: true },
      { name: 'Garlic', amount: '4', unit: 'cloves', available: true },
      { name: 'Butter', amount: '2', unit: 'tbsp', available: true },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp', available: false },
      { name: 'Spring onion', amount: '2', unit: 'stalks', available: true },
    ],
    steps: [
      { step: 1, instruction: 'Slice beef thinly against the grain. Pat dry with paper towels.', duration_min: 3 },
      { step: 2, instruction: 'Mince garlic finely. Heat a wok or large skillet over high heat.', duration_min: 2 },
      { step: 3, instruction: 'Add butter and let it foam. Add garlic and stir for 30 seconds until fragrant.', duration_min: 1, tip: 'Dont burn the garlic or it turns bitter.' },
      { step: 4, instruction: 'Add beef in a single layer. Sear undisturbed for 90 seconds, then toss.', duration_min: 3 },
      { step: 5, instruction: 'Splash in soy sauce, toss to coat. Remove from heat and garnish with spring onion.', duration_min: 1 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Tomato Egg Drop Soup',
    description: 'A comforting Chinese-style soup ready in 15 minutes. Silky egg ribbons float in a sweet-savoury tomato broth.',
    cuisine: 'Chinese',
    prep_time_min: 5,
    cook_time_min: 10,
    servings: 3,
    difficulty: 'easy',
    tags: ['soup', 'vegetarian', 'quick'],
    ai_generated: true,
    ingredients: [
      { name: 'Tomatoes', amount: '3', unit: 'medium', available: true },
      { name: 'Eggs', amount: '3', unit: '', available: true },
      { name: 'Chicken stock', amount: '500', unit: 'ml', available: false },
      { name: 'Sesame oil', amount: '1', unit: 'tsp', available: false },
      { name: 'Salt & pepper', amount: 'to taste', unit: '', available: true },
    ],
    steps: [
      { step: 1, instruction: 'Dice tomatoes into rough chunks. Beat eggs with a pinch of salt.', duration_min: 3 },
      { step: 2, instruction: 'Sauté tomatoes in 1 tbsp oil until they break down, about 3 minutes.', duration_min: 3 },
      { step: 3, instruction: 'Pour in stock, bring to a gentle boil.', duration_min: 3 },
      { step: 4, instruction: 'Slowly stream in beaten eggs while stirring gently to form ribbons.', duration_min: 1, tip: 'Stir in one direction only for silky strands.' },
      { step: 5, instruction: 'Season with salt, pepper, and a drizzle of sesame oil. Serve hot.', duration_min: 1 },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Caramelised Onion Omelette',
    description: 'Deeply savoury caramelised onions folded into a golden French omelette. Elegant simplicity at its best.',
    cuisine: 'French',
    prep_time_min: 5,
    cook_time_min: 20,
    servings: 1,
    difficulty: 'medium',
    tags: ['eggs', 'breakfast', 'vegetarian'],
    ai_generated: true,
    ingredients: [
      { name: 'Eggs', amount: '3', unit: '', available: true },
      { name: 'Onion', amount: '1', unit: 'large', available: true },
      { name: 'Butter', amount: '2', unit: 'tbsp', available: true },
      { name: 'Fresh thyme', amount: '2', unit: 'sprigs', available: false },
      { name: 'Gruyère cheese', amount: '30', unit: 'g', available: false },
    ],
    steps: [
      { step: 1, instruction: 'Slice onion thinly. Melt 1 tbsp butter in a pan over low heat.', duration_min: 2 },
      { step: 2, instruction: 'Cook onion over low heat for 15 minutes, stirring occasionally, until golden and sweet.', duration_min: 15, tip: 'Low and slow is key — don\'t rush caramelisation.' },
      { step: 3, instruction: 'Beat eggs with salt and pepper. Melt remaining butter in a non-stick pan over medium-high.', duration_min: 1 },
      { step: 4, instruction: 'Pour in eggs. As edges set, gently drag them toward the centre.', duration_min: 2 },
      { step: 5, instruction: 'Add caramelised onion along the centre. Fold and slide onto a plate.', duration_min: 1 },
    ],
    created_at: new Date().toISOString(),
  },
]
