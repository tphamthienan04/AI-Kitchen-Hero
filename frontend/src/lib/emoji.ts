
import type { FridgeCategory } from '../types';

const EMOJI_RULES = [
  { keywords: ['chicken', 'breast', 'thigh', 'wing'], emoji: '🍗' },
  { keywords: ['yogurt', 'yoghurt','yoghur'], emoji: '🥛' },
  { keywords: ['potato', 'chip', 'pringles'], emoji: '🥔' },
  { keywords: ['tomato'], emoji: '🍅' },
  { keywords: ['salmon', 'fish', 'tuna'], emoji: '🐟' },
  { keywords: ['beef', 'steak', 'pork'], emoji: '🥩' },
  { keywords: ['apple'], emoji: '🍎' },
  { keywords: ['broccoli', 'spinach', 'veg'], emoji: '🥦' },
  { keywords: ['bread', 'grain', 'pasta', 'rice'], emoji: '🌾' },
  { keywords: ['milk', 'cheese', 'butter'], emoji: '🧀' },
  { keywords: ['oil', 'salt', 'pepper', 'sauce', 'condiment'], emoji: '🧂' },
];

export const getEmoji = (name: string, category: FridgeCategory | 'other'): string => {
  const n = name.toLowerCase();
  
 
  for (const rule of EMOJI_RULES) {
    if (rule.keywords.some(k => n.includes(k))) return rule.emoji;
  }

  
  const categoryMap: Record<string, string> = {
    protein: '🥩', vegetable: '🥦', fruit: '🍎',
    dairy: '🧀', grain: '🌾', condiment: '🧂', other: '📦'
  };
  
  return categoryMap[category] || '📦';
};