import { useState, FormEvent } from 'react'
import { X } from 'lucide-react'
import { useFridge } from '../context/FridgeContext'
import type { FridgeCategory } from '../types'

interface Props { onClose: () => void }

const CATEGORIES: { value: FridgeCategory; label: string; emoji: string }[] = [
  { value: 'protein',   label: 'Protein',    emoji: '🍗' },
  { value: 'vegetable', label: 'Vegetable',  emoji: '🥦' },
  { value: 'fruit',     label: 'Fruit',      emoji: '🍎' },
  { value: 'dairy',     label: 'Dairy',      emoji: '🧀' },
  { value: 'grain',     label: 'Grain',      emoji: '🌾' },
  { value: 'condiment', label: 'Condiment',  emoji: '🧂' },
  { value: 'beverage',  label: 'Beverage',   emoji: '🥤' },
  { value: 'other',     label: 'Other',      emoji: '📦' },
]

const EMOJI_MAP: Record<FridgeCategory, string> = {
  protein: '🍗', vegetable: '🥦', fruit: '🍎',
  dairy: '🧀', grain: '🌾', condiment: '🧂',
  beverage: '🥤', other: '📦',
}

export default function AddItemModal({ onClose }: Props) {
  const { addItem } = useFridge()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<FridgeCategory>('vegetable')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await addItem({
      name: name.trim(),
      category,
      quantity,
      unit: unit || undefined,
      expiry_date: expiryDate || undefined,
      emoji: EMOJI_MAP[category],
      added_via: 'manual',
    })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <h2 className="font-display font-semibold text-ink-900">Add ingredient</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Name *</label>
            <input className="input" placeholder="e.g. Chicken breast" value={name} onChange={e => setName(e.target.value)} required autoFocus />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    category === cat.value
                  ? 'border-orange-300 bg-orange-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <div className="text-xl">{cat.emoji}</div>
                  <div className="text-xs text-ink-600 mt-0.5">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Quantity</label>
              <input className="input" type="text" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Unit <span className="text-ink-300">(optional)</span></label>
              <input className="input" placeholder="g, ml, pcs…" value={unit} onChange={e => setUnit(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Expiry date <span className="text-ink-300">(optional)</span></label>
            <input className="input" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'Adding…' : 'Add to fridge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
