// Financial calculation utilities

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

/**
 * Calculate gain/loss amount
 */
export function calculateGain(
  currentValue: number,
  investedAmount: number
): number {
  return currentValue - investedAmount;
}

/**
 * Calculate return on investment (ROI)
 */
export function calculateROI(
  currentValue: number,
  investedAmount: number
): number {
  if (investedAmount === 0) return 0;
  return ((currentValue - investedAmount) / investedAmount) * 100;
}

/**
 * Calculate portfolio value
 */
export function calculatePortfolioValue(
  positions: Array<{ quantity: number; currentPrice: number }>
): number {
  return positions.reduce(
    (sum, pos) => sum + pos.quantity * pos.currentPrice,
    0
  );
}

/**
 * Calculate weighted average price
 */
export function calculateWeightedAveragePrice(
  positions: Array<{ quantity: number; price: number }>
): number {
  const totalCost = positions.reduce((sum, pos) => sum + pos.quantity * pos.price, 0);
  const totalQuantity = positions.reduce((sum, pos) => sum + pos.quantity, 0);
  return totalQuantity === 0 ? 0 : totalCost / totalQuantity;
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimalPlaces = 2): string {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(decimalPlaces)}%`;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number, decimalPlaces = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  values: number[],
  period: number
): number[] {
  const averages: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    averages.push(sum / period);
  }
  
  return averages;
}

/**
 * Calculate volatility (standard deviation)
 */
export function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate compound annual growth rate (CAGR)
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Calculate Sharpe ratio
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate = 0.02
): number {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = calculateVolatility(returns);
  
  if (volatility === 0) return 0;
  return (mean - riskFreeRate) / volatility;
}

/**
 * Calculate maximum drawdown
 */
export function calculateMaxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;
  
  let maxValue = values[0];
  let maxDrawdown = 0;
  
  for (const value of values) {
    if (value > maxValue) {
      maxValue = value;
    }
    const drawdown = (maxValue - value) / maxValue;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}

/**
 * Calculate simple moving average (SMA)
 */
export function calculateSMA(values: number[], period: number): number[] {
  return calculateMovingAverage(values, period);
}

/**
 * Calculate exponential moving average (EMA)
 */
export function calculateEMA(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First SMA as initial EMA
  const sma = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(sma);
  
  // Calculate EMA for remaining values
  for (let i = period; i < values.length; i++) {
    const currentEMA = (values[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(currentEMA);
  }
  
  return ema;
}

/**
 * Calculate asset allocation percentages
 */
export function calculateAllocation(
  positions: Array<{ value: number }>
): number[] {
  const total = positions.reduce((sum, pos) => sum + pos.value, 0);
  return positions.map((pos) => (pos.value / total) * 100);
}

/**
 * Calculate beta (correlation with market)
 */
export function calculateBeta(
  returns: number[],
  marketReturns: number[]
): number {
  if (returns.length !== marketReturns.length || returns.length < 2) {
    return 0;
  }
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const avgMarketReturn = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < returns.length; i++) {
    const returnDiff = returns[i] - avgReturn;
    const marketDiff = marketReturns[i] - avgMarketReturn;
    covariance += returnDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }
  
  covariance /= returns.length;
  marketVariance /= returns.length;
  
  return marketVariance === 0 ? 0 : covariance / marketVariance;
}

/**
 * Round to decimal places
 */
export function roundToDecimal(value: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

/**
 * Convert percentage to decimal
 */
export function percentageToDecimal(percentage: number): number {
  return percentage / 100;
}

/**
 * Convert decimal to percentage
 */
export function decimalToPercentage(decimal: number): number {
  return decimal * 100;
}

/**
 * Calculate compound interest
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  frequency = 12
): number {
  return principal * Math.pow(1 + rate / frequency, frequency * time);
}

/**
 * Calculate simple interest
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): number {
  return principal + principal * rate * time;
}
