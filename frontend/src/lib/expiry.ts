import { FridgeCategory } from '../types'; 

export const getExpirySuggestion = (category: FridgeCategory | 'other'): string => {
  const expiryMap: Record<string, number> = {
    seafood: 2,      
    poultry: 3,      
    meat: 5,         
    vegetable: 5, 
    dairy: 7, 
    fruit: 7, 
    grain: 30,       
    condiment: 90,   
    beverage: 30,   
    other: 14,
  };

  const days = expiryMap[category] || 14;
  
  const scanDate = new Date(); 
  scanDate.setDate(scanDate.getDate() + days);
  
  return scanDate.toISOString().split('T')[0];
};