import { useState } from 'react'
import { Sparkles, ChefHat, Clock, Users, CheckCircle, Info, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react'
import { useFridge } from '../context/FridgeContext'
import { useRecipes } from '../context/RecipeContext'
import { generateRecipesFromIngredients } from '../lib/ai'
import type { Recipe } from '../types'
import confetti from 'canvas-confetti'

const DIFFICULTY_COLOR = {
  easy: 'text-emerald-600 bg-emerald-50',
  medium: 'text-amber-600 bg-amber-50',
  hard: 'text-red-600 bg-red-50',
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { saveToCollection, removeFromCollection, isSaved } = useRecipes()
  const [expanded, setExpanded] = useState(false)
  const saved = isSaved(recipe.id)

  const totalTime = recipe.prep_time_min + recipe.cook_time_min

  const handleSave = async () => {
    if (saved) {
      await removeFromCollection(recipe.id)
    } else {
      await saveToCollection(recipe)
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 }, colors: ['#E85D24', '#FFB347', '#fff'] })
      alert("🎉 Awesome! You just saved a recipe, helping to reduce food waste and protect the environment!")
    }
  }

  const missingIngredients = recipe.ingredients.filter(i => i.available === false).map(i => i.name)

  return (
    <div className="card overflow-hidden transition-all duration-200 hover:shadow-md relative">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
                {recipe.difficulty}
              </span>
              {recipe.cuisine && (
                <span className="text-xs text-ink-500 bg-surface-100 px-2 py-0.5 rounded-full font-medium">
                  {recipe.cuisine}
                </span>
              )}
              {recipe.ai_generated && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Sparkles size={10} /> AI
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900 leading-tight">{recipe.title}</h3>
            <p className="text-sm text-ink-500 mt-1.5 leading-relaxed pr-2">{recipe.description}</p>
          </div>
          
          <button 
            onClick={handleSave} 
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold shadow-sm transform transition-all duration-200 hover:scale-105 active:scale-95 text-xs
              ${saved 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
              }`}
          >
            <CheckCircle size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save Recipe'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-ink-600 bg-surface-50 p-2.5 rounded-xl">
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-500" /> {totalTime} min</span>
          <span className="flex items-center gap-1.5"><Users size={14} className="text-brand-500" /> {recipe.servings} servings</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {recipe.ingredients.filter(i => i.available !== false).length}/{recipe.ingredients.length} items
          </span>
        </div>

        {missingIngredients.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold text-red-500 flex items-center mr-1">Missing:</span>
            {missingIngredients.map(ing => (
              <span key={ing} className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                {ing}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-surface-100 bg-white">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-ink-700 hover:bg-surface-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ChefHat size={16} className="text-brand-500" /> View recipe steps
          </span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expanded && (
          <div className="px-4 pb-5 space-y-4 border-t border-surface-100 pt-4">
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">Ingredients</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className={`text-sm flex items-center gap-2 p-2 rounded-xl border ${ing.available === false ? 'border-red-100 bg-red-50/50 text-ink-500' : 'border-surface-200 bg-white text-ink-800'}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ing.available === false ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    <span className="font-semibold">{ing.amount}{ing.unit ? ` ${ing.unit}` : ''}</span> 
                    <span>{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">Instructions</p>
              <div className="space-y-3">
                {recipe.steps.map((step) => (
                    <div key={step.step} className="flex gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                    <div className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
                      {step.step}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm text-ink-800 leading-relaxed font-medium">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-xs text-amber-700 mt-2 flex items-start gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100">
                          <Info size={14} className="flex-shrink-0 mt-0.5 text-amber-500" /> 
                          <span className="font-medium">{step.tip}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIChefPage() {
  const { items } = useFridge()
  const { generated, setGenerated } = useRecipes()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.id)))
  const [preferences, setPreferences] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleGenerate = async () => {
    const chosen = items.filter(i => selectedItems.has(i.id))
    if (chosen.length === 0) return
    setLoading(true)
    setError('')

    try {
      const recipes = await generateRecipesFromIngredients(chosen, preferences)
      if (recipes && recipes.length > 0) {
        setGenerated(recipes)
      } else {
        setError('No recipes found. Please try different ingredients.')
      }
    } catch (e) {
      console.error("Error:", e)
      setError('AI generation failed. Please check your backend connection.')
    }
    setLoading(false)
  }

  return (
    
    <div className="space-y-6 animate-fade-up">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-10 rounded-3xl text-white shadow-lg"> 
      <h1 className="font-display text-4xl font-bold flex items-center gap-3">
        <Sparkles size={30} className="text-emerald-200" /> AI Chef
      </h1>
      <p className="text-lg text-emerald-50 mt-3 font-medium">
        Select ingredients and get personalised recipes instantly
      </p>
    </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink-800">Select ingredients to use</p>
          <button
            className="text-xs text-teal-600 font-bold hover:text-teal-700 transition-colors px-2 py-1 bg-brand-50 rounded-lg"
            onClick={() => {
              selectedItems.size === items.length
                ? setSelectedItems(new Set())
                : setSelectedItems(new Set(items.map(i => i.id)))
            }}
          >
            {selectedItems.size === items.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all transform hover:scale-105 active:scale-95 ${
                selectedItems.has(item.id)
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-400 shadow-sm'
                  : 'bg-white text-ink-600 border-surface-200 hover:border-emerald-200'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-ink-600 mb-2 uppercase tracking-wider">Dietary preferences <span className="text-ink-400 font-medium capitalize">(optional)</span></label>
          <input
            className="input text-sm py-3"
            placeholder="e.g. low-carb, spicy, Asian-inspired, quick meal…"
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-2"><Info size={16}/> {error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || selectedItems.size === 0}
          className="btn-magic mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              AI is cooking up ideas…
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate recipes ({selectedItems.size} items)
            </>
          )}
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-ink-800 flex items-center gap-2">
              <ChefHat size={18} className="text-emerald-500" /> 
              {generated.length} recipes suggested
            </h2>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-sm text-ink-500 font-bold flex items-center gap-1.5 hover:text-emerald-600 transition-colors bg-white px-3 py-1.5 rounded-full border shadow-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Regenerate
            </button>
          </div>
          <div className="grid gap-4">
            {generated.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

 
      {generated.length === 0 && !loading && (
        <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-surface-200 bg-surface-50/50 transition-all hover:border-emerald-200">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p className="text-lg font-bold text-ink-900 tracking-tight">
            Ready to cook something amazing?
          </p>
          <p className="text-base text-ink-500 mt-1.5 font-medium max-w-sm leading-relaxed">
            Select your ingredients above and let AI generate the perfect recipe for your next meal.
          </p>
        </div>
      )}
    </div>
  )
}
