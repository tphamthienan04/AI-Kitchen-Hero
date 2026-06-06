import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Trash2, Sparkles, ChevronDown, ChevronUp, Info, ChefHat } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import type { Recipe } from '../types'

const DIFFICULTY_COLOR = {
  easy: 'text-emerald-600 bg-emerald-50',
  medium: 'text-amber-600 bg-amber-50',
  hard: 'text-red-600 bg-red-50',
}

function SavedRecipeCard({ recipe }: { recipe: Recipe }) {
  const { removeFromCollection } = useRecipes()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🍳
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
                    {recipe.difficulty}
                  </span>
                  {recipe.cuisine && (
                    <span className="text-xs text-ink-400">{recipe.cuisine}</span>
                  )}
                </div>
                <h3 className="font-display text-sm font-semibold text-ink-900">{recipe.title}</h3>
                <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{recipe.description}</p>
              </div>
              <button
                onClick={() => removeFromCollection(recipe.id)}
                className="p-1.5 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-ink-400">
              <span className="flex items-center gap-1"><Clock size={11} /> {recipe.prep_time_min + recipe.cook_time_min}m</span>
              <span className="flex items-center gap-1"><Users size={11} /> {recipe.servings}</span>
              <span>{recipe.ingredients.length} ingredients</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-ink-500 hover:bg-surface-50 transition-colors"
        >
          <span className="flex items-center gap-1"><ChefHat size={12} /> Instructions</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 border-t border-surface-100 pt-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">Ingredients</p>
              <div className="grid grid-cols-2 gap-1">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="text-xs text-ink-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                    {ing.amount}{ing.unit ? ` ${ing.unit}` : ''} {ing.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-2">Steps</p>
              <div className="space-y-2">
                {recipe.steps.map(step => (
                  <div key={step.step} className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium" style={{fontSize:'10px'}}>
                      {step.step}
                    </div>
                    <div>
                      <p className="text-xs text-ink-700 leading-relaxed">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                          <Info size={10} /> {step.tip}
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

export default function RecipesPage() {
  const { saved } = useRecipes()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = saved.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900 flex items-center gap-2">
          <BookOpen size={20} className="text-ink-600" /> Saved Recipes
        </h1>
        <p className="text-xs text-ink-400 mt-0.5">{saved.length} recipe{saved.length !== 1 ? 's' : ''} saved</p>
      </div>

      {saved.length > 0 && (
        <input
          className="input"
          placeholder="Search recipes or tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      )}

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(recipe => (
            <SavedRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-sm font-medium text-ink-600">
            {search ? 'No recipes match your search' : 'No saved recipes yet'}
          </p>
          <p className="text-xs text-ink-400 mt-1">
            {search ? 'Try a different keyword' : 'Generate recipes with AI Chef and save your favourites'}
          </p>
          {!search && (
            <button className="btn-primary mt-4 text-xs" onClick={() => navigate('/ai-chef')}>
              <Sparkles size={13} /> Go to AI Chef
            </button>
          )}
        </div>
      )}
    </div>
  )
}
