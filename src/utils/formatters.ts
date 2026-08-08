/**
 * Formats a number as Indian Rupee (₹) with proper Indian numbering system (e.g., ₹1,00,000)
 */
export function formatINR(amount: number, showSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formattedNumber = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: absAmount % 1 === 0 ? 0 : 2,
  });

  if (isNegative) {
    return `-₹${formattedNumber}`;
  }
  if (showSign && amount > 0) {
    return `+₹${formattedNumber}`;
  }
  return `₹${formattedNumber}`;
}

/**
 * Formats percentage value with % sign
 */
export function formatPercent(value: number, showSign: boolean = false): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = absValue.toFixed(2);

  if (isNegative) {
    return `-${formatted}%`;
  }
  if (showSign && value > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

/**
 * Calculates profit metrics from raw inputs
 */
export function calculateProfitMetrics(
  costPriceNum: number,
  sellingPriceNum: number,
  quantityNum: number
) {
  const totalCost = costPriceNum * quantityNum;
  const totalSales = sellingPriceNum * quantityNum;
  const totalProfit = totalSales - totalCost;
  const profitPerPiece = sellingPriceNum - costPriceNum;
  
  const profitPercentage =
    totalCost > 0
      ? (totalProfit / totalCost) * 100
      : totalProfit > 0
      ? 100
      : 0;

  const profitMarginOnSales =
    totalSales > 0
      ? (totalProfit / totalSales) * 100
      : 0;

  const isProfit = totalProfit > 0;
  const isLoss = totalProfit < 0;
  const isBreakEven = totalProfit === 0;

  return {
    totalCost,
    totalSales,
    totalProfit,
    profitPerPiece,
    profitPercentage,
    profitMarginOnSales,
    isProfit,
    isLoss,
    isBreakEven,
  };
}
