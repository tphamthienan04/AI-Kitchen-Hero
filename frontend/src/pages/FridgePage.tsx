import { useState } from 'react'
import { Plus, Scan, Trash2, Search, SlidersHorizontal } from 'lucide-react'
import { useFridge } from '../context/FridgeContext'
import ScanModal from '../components/ScanModal'
import AddItemModal from '../components/AddItemModal'
import type { FridgeCategory } from '../types'

function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0)
  return Math.ceil(diff / 86400000)
}

const CATEGORIES = [
  { value: 'all', label: 'All', emoji: '🍽️' }, 
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'poultry', label: 'Poultry', emoji: '🍗' },
  { value: 'seafood', label: 'Seafood', emoji: '🐟' },
  { value: 'vegetable', label: 'Vegetables', emoji: '🥦' },
  { value: 'fruit', label: 'Fruits', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy', emoji: '🧀' },
  { value: 'grain', label: 'Grains', emoji: '🌾' },
  { value: 'condiment', label: 'Condiments', emoji: '🧂' },
  { value: 'beverage', label: 'Beverages', emoji: '🥤' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

export default function FridgePage() {
  const { items, removeItem } = useFridge()
  const [showScan, setShowScan] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FridgeCategory | 'all'>('all')

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || item.category === category
    return matchSearch && matchCat
  })

  const expiringCount = items.filter(i => {
    const d = daysUntilExpiry(i.expiry_date)
    return d !== null && d <= 3 && d >= 0
  }).length

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">My Fridge</h1>
          <p className="text-xs text-ink-400 mt-0.5">{items.length} items · {expiringCount} expiring soon</p>
        </div>
        <div className="flex items-center gap-2">
        <button
          onClick={() => setShowScan(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition"
        >
          <Scan size={16} /> Scan
        </button>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition"
        >
          <Plus size={16} /> Add
        </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          className="input pl-9"
          placeholder="Search ingredients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value as FridgeCategory | 'all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              category === cat.value
            ? 'bg-emerald-400 text-white'
            : 'bg-white border border-surface-200 text-ink-600 hover:border-emerald-200'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-2xl mb-2">🥺</p>
          <p className="text-sm font-medium text-ink-600">No items found</p>
          <p className="text-xs text-ink-400 mt-1">Try scanning your fridge or adding items manually</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setShowScan(true)} className="btn-primary text-xs">
              <Scan size={13} /> Scan fridge
            </button>
            <button onClick={() => setShowAdd(true)} className="btn-ghost text-xs">
              <Plus size={13} /> Add manual
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => {
            const days = daysUntilExpiry(item.expiry_date)
            const isExpired = days !== null && days < 0
            const isExpiring = days !== null && days >= 0 && days <= 3
            const isFresh = days === null || days > 3

            return (
              <div
                key={item.id}
                className={`card p-3.5 flex items-center gap-3 transition-all ${
                  isExpired ? 'border-red-100 bg-red-50/50' : isExpiring ? 'border-amber-100 bg-amber-50/30' : ''
                }`}
              >
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-900">{item.name}</span>
                    {item.added_via !== 'manual' && (
                      <span className="text-xs text-ink-300 bg-surface-100 px-1.5 py-0.5 rounded-full">
                        {item.added_via === 'scan_fridge' ? '📷' : '🧾'} scanned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-ink-400">{item.quantity}{item.unit ? ` ${item.unit}` : ''}</span>
                    {days !== null && (
                      <span className={`badge-${isExpired ? 'expired' : isExpiring ? 'expiring' : 'fresh'}`}>
                        {isExpired ? 'Expired' : days === 0 ? 'Today' : `${days}d left`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showScan && <ScanModal onClose={() => setShowScan(false)} />}
      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
