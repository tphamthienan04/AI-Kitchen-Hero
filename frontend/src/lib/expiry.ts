import { FridgeCategory } from '../types'; 

export const getExpirySuggestion = (category: FridgeCategory | 'other'): string => {
  const expiryMap: Record<string, number> = {
    protein: 7, 
    vegetable: 3, 
    dairy: 5, 
    fruit: 7, 
    grain: 20, 
    condiment: 20,
    beverage: 20,
    other: 25,
  };

  const days = expiryMap[category] || 20;
  
  const scanDate = new Date(); 
  scanDate.setDate(scanDate.getDate() + days);
  
  return scanDate.toISOString().split('T')[0];
};