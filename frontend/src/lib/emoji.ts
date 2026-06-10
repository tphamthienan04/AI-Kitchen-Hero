import type { FridgeCategory } from '../types';

const EMOJI_RULES = [
  { keywords: ['chicken', 'breast', 'thigh', 'wing'], emoji: '🍗' },
  { keywords: ['yogurt', 'yoghurt', 'yoghur'], emoji: '🥛' },
  { keywords: ['potato', 'chip', 'pringles'], emoji: '🥔' },
  { keywords: ['tomato'], emoji: '🍅' },
  { keywords: ['salmon', 'fish', 'tuna', 'oyster', 'shrimp', 'crab', 'squid'], emoji: '🐟' },
  { keywords: ['beef', 'steak', 'pork', 'meat', 'bacon'], emoji: '🥩' },
  { keywords: ['apple', 'kiwi', 'orange', 'grape'], emoji: '🍎' },
  { keywords: ['broccoli', 'spinach', 'veg', 'bokchoy', 'cabbage'], emoji: '🥦' },
  { keywords: ['bread', 'grain', 'pasta', 'rice', 'noodle'], emoji: '🌾' },
  { keywords: ['milk', 'cheese', 'butter', 'cream'], emoji: '🧀' },
  { keywords: ['oil', 'salt', 'pepper', 'sauce', 'condiment'], emoji: '🧂' },
  { keywords: ['coke', 'water', 'juice', 'drink', 'beverage', 'matcha', 'tea'], emoji: '🥤' },
];

export const getEmoji = (name: string, category: FridgeCategory | 'other'): string => {
  const n = name.toLowerCase();
  
  for (const rule of EMOJI_RULES) {
    if (rule.keywords.some(k => n.includes(k))) return rule.emoji;
  }

  const categoryMap: Record<string, string> = {
    meat: '🥩', 
    poultry: '🍗',
    seafood: '🐟', 
    vegetable: '🥦', 
    fruit: '🍎',
    dairy: '🧀', 
    grain: '🌾', 
    condiment: '🧂',
    beverage: '🥤',
    other: '📦'
  };
  
  return categoryMap[category] || '📦';
};