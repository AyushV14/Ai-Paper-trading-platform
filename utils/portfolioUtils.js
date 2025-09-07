
export const calculateHoldingMetrics = (holding, stockPrice) => {
  if (!stockPrice) return null;

  const invested = holding.qty * holding.avgCost;
  const current = holding.qty * stockPrice.currentPrice;
  const returns = current - invested;
  const returnsPerc = invested > 0 ? (returns / invested) * 100 : 0;

  // Calculate day change for individual holdings
  const previousDayPrice = stockPrice.currentPrice - stockPrice.dayChange;
  const previousDayValue = holding.qty * previousDayPrice;
  const dayChange = current - previousDayValue;

  return {
    ...holding,
    invested,
    current,
    returns,
    returnsPerc,
    totalDayChange: dayChange,
    currentPrice: stockPrice.currentPrice,
    dayChangePerc: stockPrice.dayChangePerc
  };
};

/**
 * Calculate portfolio metrics
 */
export const calculatePortfolioMetrics = (holdings = [], stockPrices = {}) => {
  if (!holdings || holdings.length === 0) {
    return {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalReturns: 0,
      totalReturnsPerc: 0,
      totalDayChange: 0,
      dayChangePerc: 0
    };
  }

  console.log('Calculating metrics with:', { holdings, stockPrices });

  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalDayChange = 0;
  let totalPreviousDayValue = 0;

  holdings.forEach(holding => {
    const stockPrice = stockPrices[holding.symbol];
    console.log(`Processing ${holding.symbol}:`, { holding, stockPrice });

    if (!stockPrice) {
      console.warn(`No stock price found for ${holding.symbol}`);
      return;
    }

    const invested = holding.qty * holding.avgCost;
    const currentValue = holding.qty * stockPrice.currentPrice;

    // Calculate previous day value correctly
    const previousDayPrice = stockPrice.currentPrice - stockPrice.dayChange;
    const previousDayValue = holding.qty * previousDayPrice;
    const dayChange = currentValue - previousDayValue;

    console.log(`${holding.symbol} calculations:`, {
      qty: holding.qty,
      avgCost: holding.avgCost,
      currentPrice: stockPrice.currentPrice,
      previousDayPrice: previousDayPrice,
      invested,
      currentValue,
      previousDayValue,
      dayChange
    });

    totalInvested += invested;
    totalCurrentValue += currentValue;
    totalDayChange += dayChange;
    totalPreviousDayValue += previousDayValue;
  });

  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnsPerc = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  // Day change percentage calculation
  const dayChangePerc = totalPreviousDayValue > 0 ? (totalDayChange / totalPreviousDayValue) * 100 : 0;

  const metrics = {
    totalInvested,
    totalCurrentValue,
    totalReturns,
    totalReturnsPerc,
    totalDayChange,
    dayChangePerc
  };

  console.log('Final metrics:', metrics);
  return metrics;
};

/**
 * Get enriched holdings with calculated metrics
 */
export const getEnrichedHoldings = (holdings = [], stockPrices = {}) => {
  return holdings
    .map(holding => calculateHoldingMetrics(holding, stockPrices[holding.symbol]))
    .filter(Boolean);
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount, options = {}) => {
  const { maximumFractionDigits = 0, showSign = false } = options;
  
  const formatted = Math.abs(amount).toLocaleString('en-IN', { 
    maximumFractionDigits 
  });
  
  const sign = showSign && amount > 0 ? '+' : '';
  return `${sign}₹${formatted}`;
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage, options = {}) => {
  const { decimals = 2, showSign = false } = options;
  
  const sign = showSign && percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
};

/**
 * Get color class based on value (positive/negative)
 */
export const getColorClass = (value) => {
  return value >= 0 ? 'text-green-600' : 'text-red-600';
};