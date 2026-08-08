export interface CalculationInput {
  productName: string;
  costPrice: number | '';
  sellingPrice: number | '';
  quantity: number | '';
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  productName: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  totalCost: number;
  totalSales: number;
  totalProfit: number;
  profitPerPiece: number;
  profitPercentage: number; // Profit / Total Cost * 100
  profitMarginOnSales: number; // Profit / Total Sales * 100
  isProfit: boolean;
  isLoss: boolean;
  isBreakEven: boolean;
}

export interface ValidationErrors {
  productName?: string;
  costPrice?: string;
  sellingPrice?: string;
  quantity?: string;
}
