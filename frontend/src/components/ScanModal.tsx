import { useState, useRef, useCallback } from 'react'
import { 
  X, Camera, Upload, RefreshCw, Check, Loader2, 
  Refrigerator, Receipt, Package, Apple, Milk, 
  Beef, Carrot, Wine, Fish, Wheat 
} from 'lucide-react'
import { parseScannedImage } from '../lib/ai'
import { useFridge } from '../context/FridgeContext'
import type { FridgeItem, ScanResult, FridgeCategory } from '../types'
import { getExpirySuggestion } from '../lib/expiry'
import { getEmoji } from '../lib/emoji'

interface ScanModalProps {
  onClose: () => void
}

type ScanType = 'fridge' | 'receipt'
type Step = 'select-type' | 'capture' | 'reviewing' | 'done'

// 1. Map the string icons from Gemini to professional Lucide React components
const ICON_MAP: Record<string, React.ElementType> = {
  apple: Apple,
  milk: Milk,
  steak: Beef,
  carrot: Carrot,
  box: Package,
  bottle: Wine,
  fish: Fish,
  grain: Wheat,
  protein: Beef,
  dairy: Milk,
  vegetable: Carrot,
  fruit: Apple,
  beverage: Wine,
  condiment: Package,
  other: Package
}

// 2. Updated Demo Data to use 'icon' instead of 'emoji'
const DEMO_FRIDGE_RESULT: ScanResult = {
  confidence: 0.91,
  items: [
    { name: 'Greek yogurt', category: 'dairy', quantity: '500', unit: 'g', emoji: 'milk' },
    { name: 'Broccoli', category: 'vegetable', quantity: '1', unit: 'head', emoji: 'carrot' },
    { name: 'Salmon fillet', category: 'seafood', quantity: '2', unit: 'pieces', emoji: 'fish' },
    { name: 'Bell peppers', category: 'vegetable', quantity: '3', unit: '', emoji: 'carrot' },
    { name: 'Sour cream', category: 'dairy', quantity: '200', unit: 'ml', emoji: 'milk' },
  ],
}

const DEMO_RECEIPT_RESULT: ScanResult = {
  confidence: 0.96,
  items: [
    { name: 'Pasta', category: 'grain', quantity: '500', unit: 'g', emoji: 'grain' },
    { name: 'Canned tomatoes', category: 'condiment', quantity: '2', unit: 'cans', emoji: 'box' },
    { name: 'Mozzarella', category: 'dairy', quantity: '250', unit: 'g', emoji: 'milk' },
    { name: 'Basil', category: 'vegetable', quantity: '1', unit: 'bunch', emoji: 'carrot' },
    { name: 'Olive oil', category: 'condiment', quantity: '500', unit: 'ml', emoji: 'bottle' },
  ],
}

export default function ScanModal({ onClose }: ScanModalProps) {
  const { addItems } = useFridge()
  const [scanType, setScanType] = useState<ScanType | null>(null)
  const [step, setStep] = useState<Step>('select-type')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const processImage = useCallback(async (file: File) => {
    setProcessing(true)
    setError('')

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      setStep('reviewing')

      try {
        const base64 = dataUrl.split(',')[1]
        const mime = file.type as 'image/jpeg' | 'image/png' | 'image/webp'
        
        const scanResult = await parseScannedImage(base64, mime, scanType!)
        
        if (scanResult && scanResult.items && scanResult.items.length > 0) {
          setResult(scanResult)
          setSelected(new Set(scanResult.items.map((_, i) => i)))
        } else {
          throw new Error("No items found")
        }
      } catch (err) {
        console.error("Scan error:", err)
        setError('Failed to analyze image. Please try again.')
        
        const demo = scanType === 'receipt' ? DEMO_RECEIPT_RESULT : DEMO_FRIDGE_RESULT
        setResult(demo)
        setSelected(new Set(demo.items.map((_, i) => i)))
      }
      setProcessing(false)
    }
    reader.readAsDataURL(file)
  }, [scanType])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const toggleItem = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const handleAddItems = async () => {
    if (!result) return;
    
    const toAdd = result.items
      .filter((_, i) => selected.has(i))
      .map(item => {
        const category = (item.category || 'other') as FridgeCategory;
        
        return {
          id: crypto.randomUUID(), 
          name: item.name!,
          category: category,
          quantity: String(item.quantity) || '1',
          unit: item.unit || '',
          
          
          emoji: item.emoji || getEmoji(item.name!, category), 
          
          added_via: (scanType === 'receipt' ? 'scan_receipt' : 'scan_fridge') as 'scan_receipt' | 'scan_fridge',
          expiry_date: getExpirySuggestion(category) 
        };
      });

    await addItems(toAdd);
    setStep('done');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <h2 className="font-display font-semibold text-ink-900">
            {step === 'select-type' && 'Scan to add items'}
            {step === 'capture' && (scanType === 'fridge' ? '📷 Scan fridge' : '🧾 Scan receipt')}
            {step === 'reviewing' && 'Review items found'}
            {step === 'done' && 'Items added!'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        <div className="p-5">
          {/* Step 1: Choose type */}
          {step === 'select-type' && (
            <div className="space-y-3">
              <p className="text-sm text-ink-500">What would you like to scan?</p>
              <button
                onClick={() => { setScanType('fridge'); setStep('capture') }}
                className="w-full p-4 rounded-2xl border-2 border-surface-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Refrigerator size={22} className="text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-ink-900">Fridge / pantry</div>
                  <div className="text-xs text-ink-400 mt-0.5">AI identifies food items from a photo</div>
                </div>
              </button>
              <button
                onClick={() => { setScanType('receipt'); setStep('capture') }}
                className="w-full p-4 rounded-2xl border-2 border-surface-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Receipt size={22} className="text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-ink-900">Grocery receipt / bill</div>
                  <div className="text-xs text-ink-400 mt-0.5">Extract all items from a photo of your receipt</div>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === 'capture' && (
            <div className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-surface-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center">
                  <Camera size={24} className="text-ink-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-ink-700">Take a photo or upload</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {scanType === 'fridge'
                      ? 'Open fridge door and take a clear photo'
                      : 'Take a photo of your grocery receipt'}
                  </p>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Step 3: Review results */}
          {step === 'reviewing' && (
            <div className="space-y-4">
              {preview && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-100">
                  <img src={preview} alt="Scanned" className="w-full h-full object-cover" />
                  {processing && (
                    <div className="absolute inset-0 bg-ink-900/60 flex flex-col items-center justify-center gap-3">
                      <Loader2 size={28} className="text-white animate-spin" />
                      <p className="text-white text-sm font-medium">AI is analysing your {scanType}...</p>
                    </div>
                  )}
                </div>
              )}

              {result && !processing && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink-900">
                        Found {result.items.length} items
                      </p>
                      <p className="text-xs text-ink-400">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const allSelected = selected.size === result.items.length
                        setSelected(allSelected ? new Set() : new Set(result.items.map((_, i) => i)))
                      }}
                      className="text-xs text-emerald-500 font-medium"
                    >
                      {selected.size === result.items.length ? 'Deselect all' : 'Select all'}
                    </button>
                  </div>
                  
                  {error && <p className="text-xs text-emerald-500 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>}
                  
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {result.items.map((item, i) => {
                      // 4. Resolve the correct icon component, fallback to Package (box)
                      const IconComponent = ICON_MAP[item.emoji || item.category || 'box'] || Package;

                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            selected.has(i) ? 'border-emerald-200 bg-emerald-50' : 'border-surface-200 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(i)}
                            onChange={() => toggleItem(i)}
                            className="w-4 h-4 accent-emerald-500"
                          />
                          
                          {/* Render the professional icon here */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected.has(i) ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-100 text-ink-500'}`}>
                            <IconComponent size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-900 capitalize">{item.name}</p>
                            <p className="text-xs text-ink-400">{item.quantity} {item.unit}</p>
                          </div>
                          
                          {/* Show the dynamic expiry calculation directly in the UI as a preview */}
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-ink-400 font-medium bg-surface-100 px-2 py-0.5 rounded-full capitalize">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">
                              {getExpirySuggestion(item.category as FridgeCategory)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleAddItems}
                    disabled={selected.size === 0}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    Add {selected.size} item{selected.size !== 1 ? 's' : ''} to fridge
                  </button>
                  <button
                    onClick={() => { setStep('capture'); setResult(null); setPreview(null) }}
                    className="btn-ghost w-full text-xs"
                  >
                    <RefreshCw size={13} /> Scan again
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 4: Done */}
          {step === 'done' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <Check size={28} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-ink-900">Items added to your fridge!</p>
                <p className="text-sm text-ink-400 mt-1">
                  {selected.size} item{selected.size !== 1 ? 's were' : ' was'} successfully added.
                </p>
              </div>
              <button onClick={onClose} className="btn-primary w-full">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}