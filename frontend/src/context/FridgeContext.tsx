import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { getFridgeItems, addFridgeItem, deleteFridgeItem, updateFridgeItem } from '../lib/supabase'
import type { FridgeItem, FridgeCategory } from '../types'

interface FridgeContextValue {
  items: FridgeItem[]
  loading: boolean
  addItem: (item: Omit<FridgeItem, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateItem: (id: string, updates: Partial<FridgeItem>) => Promise<void>
  addItems: (items: Omit<FridgeItem, 'id' | 'user_id' | 'created_at'>[]) => Promise<void>
  getExpiringItems: (days?: number) => FridgeItem[]
}

const FridgeContext = createContext<FridgeContextValue | null>(null)

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL

const DEMO_ITEMS: FridgeItem[] = [
  { id: '1', user_id: 'demo', name: 'Chicken breast',  category: 'poultry',   quantity: '400', unit: 'g',    expiry_date: daysFromNow(1),  emoji: '🍗', added_via: 'manual',       created_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', name: 'Eggs',            category: 'other',     quantity: '6',   unit: '',     expiry_date: daysFromNow(7),  emoji: '🥚', added_via: 'manual',       created_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', name: 'Milk',            category: 'dairy',      quantity: '500', unit: 'ml',  expiry_date: daysFromNow(3),  emoji: '🥛', added_via: 'scan_receipt', created_at: new Date().toISOString() },
  { id: '4', user_id: 'demo', name: 'Cheddar cheese',  category: 'dairy',      quantity: '200', unit: 'g',    expiry_date: daysFromNow(14), emoji: '🧀', added_via: 'scan_fridge',  created_at: new Date().toISOString() },
  { id: '5', user_id: 'demo', name: 'Tomatoes',        category: 'vegetable',  quantity: '4',   unit: '',     expiry_date: daysFromNow(4),  emoji: '🍅', added_via: 'scan_fridge',  created_at: new Date().toISOString() },
  { id: '6', user_id: 'demo', name: 'Spinach',         category: 'vegetable',  quantity: '150', unit: 'g',    expiry_date: daysFromNow(2),  emoji: '🥬', added_via: 'manual',       created_at: new Date().toISOString() },
  { id: '7', user_id: 'demo', name: 'Garlic',          category: 'vegetable',  quantity: '1',   unit: 'head', expiry_date: daysFromNow(30), emoji: '🧄', added_via: 'manual',       created_at: new Date().toISOString() },
  { id: '8', user_id: 'demo', name: 'Butter',          category: 'dairy',      quantity: '125', unit: 'g',    expiry_date: daysFromNow(21), emoji: '🧈', added_via: 'manual',       created_at: new Date().toISOString() },
  { id: '9', user_id: 'demo', name: 'Onion',           category: 'vegetable',  quantity: '3',   unit: '',     expiry_date: daysFromNow(20), emoji: '🧅', added_via: 'manual',       created_at: new Date().toISOString() },
  { id:'10', user_id: 'demo', name: 'Lemon',           category: 'fruit',      quantity: '2',   unit: '',     expiry_date: daysFromNow(10), emoji: '🍋', added_via: 'scan_receipt', created_at: new Date().toISOString() },
]

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function FridgeProvider({ children }: { children: ReactNode }) {
  const { user, isDemoMode } = useAuth(); 
  const [items, setItems] = useState<FridgeItem[]>(isDemoMode ? DEMO_ITEMS : [])
  const [loading, setLoading] = useState(!isDemoMode)

 useEffect(() => {
  if (isDemoMode) {
    setItems(DEMO_ITEMS);
    setLoading(false);
    return;
  }

  if (user) {
    setLoading(true);
    getFridgeItems(user.id).then(({ data }) => {
      setItems(data || []); 
      setLoading(false);
    });
  } else {
    setItems([]);
    setLoading(false);
  }
}, [user, isDemoMode]);

  const addItem = async (item: Omit<FridgeItem, 'id' | 'user_id' | 'created_at'>) => {
    
    const userId = user?.id || 'demo-user';
    
    const newItem: FridgeItem = {
      ...item,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    
    if (!isDemoMode && user) {
      const { data, error } = await addFridgeItem({ ...item, user_id: user.id })
      if (!error && data) { 
        setItems(prev => [data as FridgeItem, ...prev]); 
        return; 
      }
    }
    
    
    setItems(prev => [newItem, ...prev])
  }

  const addItems = async (newItems: Omit<FridgeItem, 'id' | 'user_id' | 'created_at'>[]) => {
    
    for (const item of newItems) await addItem(item)
  }

  const removeItem = async (id: string) => {
    
    if (!isDemoMode) await deleteFridgeItem(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateItem = async (id: string, updates: Partial<FridgeItem>) => {
    if (!isDemoMode) await updateFridgeItem(id, updates)
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  const getExpiringItems = (days = 3) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + days)
    return items.filter(i => {
      if (!i.expiry_date) return false
      return new Date(i.expiry_date) <= cutoff
    })
  }

  return (
    <FridgeContext.Provider value={{ items, loading, addItem, removeItem, updateItem, addItems, getExpiringItems }}>
      {children}
    </FridgeContext.Provider>
  )
}

export function useFridge() {
  const ctx = useContext(FridgeContext)
  if (!ctx) throw new Error('useFridge must be used within FridgeProvider')
  return ctx
}

export { FridgeCategory }
