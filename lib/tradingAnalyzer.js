/**
 * Local Trading Analyzer
 * Analyzes user's trades from MongoDB to generate comprehensive metrics
 * Replaces external API: trading-analyzer-3pi8.onrender.com
 */

/**
 * Calculate comprehensive trading metrics from user's trade history
 * @param {Array} trades - User's trade history from MongoDB
 * @param {Array} holdings - User's current holdings
 * @param {Number} virtualBalance - User's current balance
 * @returns {Object} Comprehensive trading analysis
 */
export function analyzeTrading(trades = [], holdings = [], virtualBalance = 100000) {
  if (!trades || trades.length === 0) {
    return getEmptyAnalysis();
  }

  // Sort trades by timestamp
  const sortedTrades = [...trades].sort((a, b) => new Date(a.ts) - new Date(b.ts));
  
  // Calculate basic metrics
  const totalTrades = sortedTrades.length;
  const buyTrades = sortedTrades.filter(t => t.side === 'BUY');
  const sellTrades = sortedTrades.filter(t => t.side === 'SELL');
  
  // Calculate win rate and profits
  const { winRate, avgProfit, profitableTrades, lossTrades, totalProfit } = 
    calculateProfitMetrics(sortedTrades);
  
  // Calculate holding times
  const avgHoldingTime = calculateAverageHoldingTime(sortedTrades);
  
  // Calculate trading frequency
  const tradingFrequency = calculateTradingFrequency(sortedTrades);
  
  // Get most traded stocks
  const mostTradedStocks = getMostTradedStocks(sortedTrades);
  
  // Calculate sector distribution
  const sectorDistribution = calculateSectorDistribution(holdings, sortedTrades);
  
  // Calculate volatility preference
  const volatilityMetrics = calculateVolatilityMetrics(sortedTrades);
  
  // Calculate position sizing patterns
  const positionSizing = analyzePositionSizing(sortedTrades, virtualBalance);
  
  // Calculate time-based patterns
  const timePatterns = analyzeTimePatterns(sortedTrades);
  
  // Calculate streak data
  const streaks = calculateStreaks(sortedTrades);
  
  // Calculate risk metrics
  const riskMetrics = calculateRiskMetrics(sortedTrades, holdings, virtualBalance);

  return {
    user_summary: {
      total_trades: totalTrades,
      buy_trades: buyTrades.length,
      sell_trades: sellTrades.length,
      win_rate: winRate,
      avg_profit: avgProfit,
      avg_holding_time: avgHoldingTime,
      most_traded_stocks: mostTradedStocks,
      profitable_trades: profitableTrades,
      loss_trades: lossTrades,
      total_profit: totalProfit,
      trading_frequency: tradingFrequency,
      sector_distribution: sectorDistribution,
    },
    volatility_metrics: volatilityMetrics,
    position_sizing: positionSizing,
    time_patterns: timePatterns,
    streaks: streaks,
    risk_metrics: riskMetrics,
    portfolio_summary: {
      current_holdings: holdings.length,
      virtual_balance: virtualBalance,
      total_invested: holdings.reduce((sum, h) => sum + (h.qty * h.avgCost), 0),
    },
    analysis_timestamp: new Date().toISOString(),
    data_source: 'local_analyzer',
  };
}

/**
 * Get empty analysis for users with no trades
 */
function getEmptyAnalysis() {
  return {
    user_summary: {
      total_trades: 0,
      buy_trades: 0,
      sell_trades: 0,
      win_rate: 0,
      avg_profit: 0,
      avg_holding_time: 0,
      most_traded_stocks: {},
      profitable_trades: 0,
      loss_trades: 0,
      total_profit: 0,
      trading_frequency: { trades_per_day: 0, trades_per_week: 0 },
      sector_distribution: {},
    },
    volatility_metrics: { avg_price_range: 0, volatility_preference: 'unknown' },
    position_sizing: { avg_position_size: 0, max_position_size: 0, position_consistency: 0 },
    time_patterns: { preferred_hours: [], preferred_days: [], most_active_period: 'unknown' },
    streaks: { current_streak: 0, max_win_streak: 0, max_loss_streak: 0 },
    risk_metrics: { concentration_risk: 0, diversification_score: 0, max_drawdown: 0 },
    portfolio_summary: { current_holdings: 0, virtual_balance: 100000, total_invested: 0 },
    analysis_timestamp: new Date().toISOString(),
    data_source: 'local_analyzer',
  };
}

/**
 * Calculate profit metrics from trades
 */
function calculateProfitMetrics(trades) {
  const completedTrades = matchBuySellPairs(trades);
  
  if (completedTrades.length === 0) {
    return { winRate: 0, avgProfit: 0, profitableTrades: 0, lossTrades: 0, totalProfit: 0 };
  }

  let profitableTrades = 0;
  let lossTrades = 0;
  let totalProfitPercent = 0;
  let totalProfit = 0;

  completedTrades.forEach(trade => {
    const profitPercent = ((trade.sellPrice - trade.buyPrice) / trade.buyPrice) * 100;
    const profit = (trade.sellPrice - trade.buyPrice) * trade.qty;
    
    totalProfitPercent += profitPercent;
    totalProfit += profit;
    
    if (profit > 0) {
      profitableTrades++;
    } else {
      lossTrades++;
    }
  });

  const winRate = completedTrades.length > 0 ? profitableTrades / completedTrades.length : 0;
  const avgProfit = completedTrades.length > 0 ? totalProfitPercent / completedTrades.length : 0;

  return { winRate, avgProfit, profitableTrades, lossTrades, totalProfit };
}

/**
 * Match buy and sell trades to calculate completed trades
 */
function matchBuySellPairs(trades) {
  const buyOrders = {};
  const completedTrades = [];

  trades.forEach(trade => {
    const symbol = trade.symbol;
    
    if (trade.side === 'BUY') {
      if (!buyOrders[symbol]) {
        buyOrders[symbol] = [];
      }
      buyOrders[symbol].push({
        qty: trade.qty,
        price: trade.price,
        ts: trade.ts,
      });
    } else if (trade.side === 'SELL' && buyOrders[symbol]?.length > 0) {
      // FIFO matching
      let remainingQty = trade.qty;
      
      while (remainingQty > 0 && buyOrders[symbol].length > 0) {
        const buyOrder = buyOrders[symbol][0];
        const matchQty = Math.min(remainingQty, buyOrder.qty);
        
        completedTrades.push({
          symbol,
          qty: matchQty,
          buyPrice: buyOrder.price,
          sellPrice: trade.price,
          buyTs: buyOrder.ts,
          sellTs: trade.ts,
          holdingTime: (new Date(trade.ts) - new Date(buyOrder.ts)) / (1000 * 60 * 60 * 24),
        });

        remainingQty -= matchQty;
        buyOrder.qty -= matchQty;
        
        if (buyOrder.qty <= 0) {
          buyOrders[symbol].shift();
        }
      }
    }
  });

  return completedTrades;
}

/**
 * Calculate average holding time in days
 */
function calculateAverageHoldingTime(trades) {
  const completedTrades = matchBuySellPairs(trades);
  
  if (completedTrades.length === 0) return 0;
  
  const totalHoldingTime = completedTrades.reduce((sum, t) => sum + t.holdingTime, 0);
  return totalHoldingTime / completedTrades.length;
}

/**
 * Calculate trading frequency
 */
function calculateTradingFrequency(trades) {
  if (trades.length < 2) {
    return { trades_per_day: 0, trades_per_week: 0, trades_per_month: 0 };
  }

  const firstTrade = new Date(trades[0].ts);
  const lastTrade = new Date(trades[trades.length - 1].ts);
  const daysDiff = Math.max(1, (lastTrade - firstTrade) / (1000 * 60 * 60 * 24));
  
  return {
    trades_per_day: trades.length / daysDiff,
    trades_per_week: (trades.length / daysDiff) * 7,
    trades_per_month: (trades.length / daysDiff) * 30,
  };
}

/**
 * Get most traded stocks with counts
 */
function getMostTradedStocks(trades) {
  const stockCounts = {};
  
  trades.forEach(trade => {
    stockCounts[trade.symbol] = (stockCounts[trade.symbol] || 0) + 1;
  });

  // Sort by count and return top 10
  const sorted = Object.entries(stockCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return Object.fromEntries(sorted);
}

/**
 * Calculate sector distribution
 */
function calculateSectorDistribution(holdings, trades) {
  const sectorCounts = {};
  
  // Get all unique symbols from both holdings and trades
  const holdingSymbols = holdings.map(h => h.symbol);
  const tradeSymbols = trades.map(t => t.symbol);
  const allSymbols = [...new Set([...holdingSymbols, ...tradeSymbols])];
  
  // Always calculate sector from symbol (don't rely on stored sector)
  allSymbols.forEach(symbol => {
    if (symbol) {
      const sector = inferSectorFromSymbol(symbol);
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    }
  });

  return sectorCounts;
}

/**
 * Infer sector from stock symbol (comprehensive mapping)
 */
function inferSectorFromSymbol(symbol) {
  const upperSymbol = symbol?.toUpperCase()?.trim();
  if (!upperSymbol) return 'Other';

  const sectorMap = {
    // Banking & Finance
    'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking',
    'AXISBANK': 'Banking', 'INDUSINDBK': 'Banking', 'BANKBARODA': 'Banking', 'PNB': 'Banking',
    'BANDHANBNK': 'Banking', 'FEDERALBNK': 'Banking', 'IDFCFIRSTB': 'Banking', 'RBLBANK': 'Banking',
    'CANBK': 'Banking', 'UNIONBANK': 'Banking', 'IOB': 'Banking', 'CENTRALBK': 'Banking',
    'BAJFINANCE': 'Finance', 'BAJAJFINSV': 'Finance', 'HDFC': 'Finance', 'SBILIFE': 'Finance',
    'HDFCLIFE': 'Finance', 'ICICIPRULI': 'Finance', 'ICICIGI': 'Finance', 'SBICARD': 'Finance',
    'CHOLAFIN': 'Finance', 'MUTHOOTFIN': 'Finance', 'MANAPPURAM': 'Finance', 'SHRIRAMFIN': 'Finance',
    'LIC': 'Finance', 'POONAWALLA': 'Finance',
    
    // IT & Technology
    'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT', 'TECHM': 'IT', 
    'LTIM': 'IT', 'LTI': 'IT', 'MPHASIS': 'IT', 'COFORGE': 'IT', 'PERSISTENT': 'IT',
    'MINDTREE': 'IT', 'LTTS': 'IT', 'CYIENT': 'IT', 'TATAELXSI': 'IT', 'ROUTE': 'IT',
    'NAUKRI': 'IT', 'ZOMATO': 'IT', 'PAYTM': 'IT', 'POLICYBZR': 'IT', 'DELHIVERY': 'IT',
    
    // Pharma & Healthcare
    'SUNPHARMA': 'Pharma', 'DRREDDY': 'Pharma', 'CIPLA': 'Pharma', 'DIVISLAB': 'Pharma',
    'BIOCON': 'Pharma', 'LUPIN': 'Pharma', 'AUROPHARMA': 'Pharma', 'TORNTPHARM': 'Pharma',
    'ALKEM': 'Pharma', 'IPCALAB': 'Pharma', 'GLENMARK': 'Pharma', 'ZYDUSLIFE': 'Pharma',
    'APOLLOHOSP': 'Healthcare', 'FORTIS': 'Healthcare', 'MAXHEALTH': 'Healthcare',
    'METROPOLIS': 'Healthcare', 'LALPATHLAB': 'Healthcare', 'DRREDDYS': 'Pharma',
    
    // Auto & Auto Ancillary
    'TATAMOTORS': 'Auto', 'MARUTI': 'Auto', 'M&M': 'Auto', 'BAJAJ-AUTO': 'Auto', 
    'HEROMOTOCO': 'Auto', 'EICHERMOT': 'Auto', 'ASHOKLEY': 'Auto', 'TVSMOTORS': 'Auto',
    'TVSMOTOR': 'Auto', 'MOTHERSON': 'Auto', 'BOSCH': 'Auto', 'MRF': 'Auto',
    'BALKRISIND': 'Auto', 'APOLLOTYRE': 'Auto', 'BHARATFORG': 'Auto', 'EXIDEIND': 'Auto',
    'AMARAJABAT': 'Auto', 'TATAMOTOR': 'Auto',
    
    // Energy & Power
    'RELIANCE': 'Energy', 'ONGC': 'Energy', 'BPCL': 'Energy', 'IOC': 'Energy', 
    'NTPC': 'Energy', 'POWERGRID': 'Energy', 'GAIL': 'Energy', 'PETRONET': 'Energy',
    'ADANIGREEN': 'Energy', 'ADANIPOWER': 'Energy', 'TATAPOWER': 'Energy', 'TORNTPOWER': 'Energy',
    'NHPC': 'Energy', 'SJVN': 'Energy', 'HINDPETRO': 'Energy', 'MRPL': 'Energy',
    'ADANIENT': 'Energy', 'ADANITRANS': 'Energy', 'ADANIPORTS': 'Logistics',
    'OIL': 'Energy', 'GUJGASLTD': 'Energy', 'IGL': 'Energy', 'MGL': 'Energy',
    
    // FMCG & Consumer
    'HINDUNILVR': 'FMCG', 'ITC': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG',
    'DABUR': 'FMCG', 'MARICO': 'FMCG', 'GODREJCP': 'FMCG', 'COLPAL': 'FMCG',
    'TATACONSUM': 'FMCG', 'VBL': 'FMCG', 'UBL': 'FMCG', 'MCDOWELL-N': 'FMCG',
    'PGHH': 'FMCG', 'EMAMILTD': 'FMCG', 'RADICO': 'FMCG', 'BATAINDIA': 'Retail',
    'TITAN': 'Retail', 'TRENT': 'Retail', 'DMART': 'Retail', 'PAGEIND': 'Retail',
    
    // Metals & Mining
    'TATASTEEL': 'Metals', 'JSWSTEEL': 'Metals', 'HINDALCO': 'Metals', 'COALINDIA': 'Metals',
    'VEDL': 'Metals', 'NMDC': 'Metals', 'SAIL': 'Metals', 'JINDALSTEL': 'Metals',
    'NATIONALUM': 'Metals', 'HINDZINC': 'Metals', 'MOIL': 'Metals', 'APLAPOLLO': 'Metals',
    
    // Telecom & Media
    'BHARTIARTL': 'Telecom', 'IDEA': 'Telecom', 'VIL': 'Telecom', 'TATACOMM': 'Telecom',
    'INDUSTOWER': 'Telecom', 'HATHWAY': 'Telecom', 'DEN': 'Telecom',
    'ZEEL': 'Media', 'SUNTV': 'Media', 'PVR': 'Media', 'INOXLEISUR': 'Media',
    
    // Real Estate & Construction
    'DLF': 'Realty', 'GODREJPROP': 'Realty', 'OBEROIRLTY': 'Realty', 'PRESTIGE': 'Realty',
    'LODHA': 'Realty', 'BRIGADE': 'Realty', 'SOBHA': 'Realty', 'PHOENIXLTD': 'Realty',
    'LTIM': 'Infra', 'LT': 'Infra', 'LARSENTOUB': 'Infra', 'ULTRACEMCO': 'Cement',
    'SHREECEM': 'Cement', 'AMBUJACEM': 'Cement', 'ACC': 'Cement', 'RAMCOCEM': 'Cement',
    'DALMIARATA': 'Cement', 'JKCEMENT': 'Cement', 'GRASIM': 'Cement',
    
    // Infrastructure & Engineering
    'SIEMENS': 'Engineering', 'ABB': 'Engineering', 'HAVELLS': 'Engineering',
    'POLYCAB': 'Engineering', 'KEI': 'Engineering', 'VOLTAMP': 'Engineering',
    'BEL': 'Defence', 'HAL': 'Defence', 'BHEL': 'Engineering', 'THERMAX': 'Engineering',
    
    // Chemicals
    'PIDILITIND': 'Chemicals', 'SRF': 'Chemicals', 'ATUL': 'Chemicals', 'DEEPAKNI': 'Chemicals',
    'NAVINFLUOR': 'Chemicals', 'TATACHEM': 'Chemicals', 'UPL': 'Chemicals',
    
    // Textiles & Apparel
    'RAYMOND': 'Textiles', 'ARVIND': 'Textiles', 'TRIDENT': 'Textiles', 'WELSPUNIND': 'Textiles',
    
    // Others
    'ASIANPAINT': 'Paints', 'BERGER': 'Paints', 'KANSAINER': 'Paints', 'INDIGO': 'Aviation',
    'SPICEJET': 'Aviation', 'IRCTC': 'Travel', 'EASEMYTRIP': 'Travel', 'IXIGO': 'Travel',
  };
  
  // Try exact match first
  if (sectorMap[upperSymbol]) {
    return sectorMap[upperSymbol];
  }
  
  // Try partial match for common patterns
  if (upperSymbol.includes('BANK')) return 'Banking';
  if (upperSymbol.includes('PHARMA')) return 'Pharma';
  if (upperSymbol.includes('POWER')) return 'Energy';
  if (upperSymbol.includes('INFRA')) return 'Infra';
  if (upperSymbol.includes('CEMENT')) return 'Cement';
  if (upperSymbol.includes('STEEL')) return 'Metals';
  if (upperSymbol.includes('FIN')) return 'Finance';
  if (upperSymbol.includes('TECH')) return 'IT';
  
  return 'Other';
}

/**
 * Calculate volatility metrics
 */
function calculateVolatilityMetrics(trades) {
  if (trades.length === 0) {
    return { avg_price_range: 0, volatility_preference: 'unknown' };
  }

  // Calculate price variance per stock
  const stockPrices = {};
  trades.forEach(t => {
    if (!stockPrices[t.symbol]) stockPrices[t.symbol] = [];
    stockPrices[t.symbol].push(t.price);
  });

  let totalVariance = 0;
  let stockCount = 0;

  Object.values(stockPrices).forEach(prices => {
    if (prices.length > 1) {
      const mean = prices.reduce((a, b) => a + b) / prices.length;
      const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
      const cv = (Math.sqrt(variance) / mean) * 100; // Coefficient of variation
      totalVariance += cv;
      stockCount++;
    }
  });

  const avgVariance = stockCount > 0 ? totalVariance / stockCount : 0;
  
  let volatilityPreference = 'moderate';
  if (avgVariance < 5) volatilityPreference = 'low';
  else if (avgVariance > 15) volatilityPreference = 'high';

  return {
    avg_price_range: avgVariance,
    volatility_preference: volatilityPreference,
  };
}

/**
 * Analyze position sizing patterns
 */
function analyzePositionSizing(trades, virtualBalance) {
  if (trades.length === 0) {
    return { avg_position_size: 0, max_position_size: 0, min_position_size: 0, position_consistency: 0 };
  }

  const positionSizes = trades
    .filter(t => t.side === 'BUY')
    .map(t => (t.qty * t.price));

  if (positionSizes.length === 0) {
    return { avg_position_size: 0, max_position_size: 0, min_position_size: 0, position_consistency: 0 };
  }

  const avg = positionSizes.reduce((a, b) => a + b, 0) / positionSizes.length;
  const max = Math.max(...positionSizes);
  const min = Math.min(...positionSizes);
  
  // Calculate consistency (lower std dev = more consistent)
  const variance = positionSizes.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / positionSizes.length;
  const stdDev = Math.sqrt(variance);
  const consistency = avg > 0 ? Math.max(0, 1 - (stdDev / avg)) : 0;

  return {
    avg_position_size: avg,
    max_position_size: max,
    min_position_size: min,
    avg_position_percent: (avg / virtualBalance) * 100,
    position_consistency: consistency,
  };
}

/**
 * Analyze time-based trading patterns
 */
function analyzeTimePatterns(trades) {
  if (trades.length === 0) {
    return { preferred_hours: [], preferred_days: [], most_active_period: 'unknown' };
  }

  const hourCounts = {};
  const dayCounts = {};

  trades.forEach(t => {
    const date = new Date(t.ts);
    const hour = date.getHours();
    const day = date.getDay();

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const sortedHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Determine most active period
  const morningTrades = Object.entries(hourCounts)
    .filter(([h]) => h >= 9 && h < 12)
    .reduce((sum, [, c]) => sum + c, 0);
  const afternoonTrades = Object.entries(hourCounts)
    .filter(([h]) => h >= 12 && h < 15)
    .reduce((sum, [, c]) => sum + c, 0);
  const eveningTrades = Object.entries(hourCounts)
    .filter(([h]) => h >= 15 && h <= 16)
    .reduce((sum, [, c]) => sum + c, 0);

  let mostActivePeriod = 'morning';
  if (afternoonTrades > morningTrades && afternoonTrades > eveningTrades) {
    mostActivePeriod = 'afternoon';
  } else if (eveningTrades > morningTrades) {
    mostActivePeriod = 'closing';
  }

  return {
    preferred_hours: sortedHours.slice(0, 3).map(([h, c]) => ({ hour: parseInt(h), count: c })),
    preferred_days: sortedDays.slice(0, 3).map(([d, c]) => ({ day: dayNames[d], count: c })),
    most_active_period: mostActivePeriod,
    hour_distribution: hourCounts,
    day_distribution: Object.fromEntries(
      Object.entries(dayCounts).map(([d, c]) => [dayNames[d], c])
    ),
  };
}

/**
 * Calculate win/loss streaks
 */
function calculateStreaks(trades) {
  const completedTrades = matchBuySellPairs(trades);
  
  if (completedTrades.length === 0) {
    return { current_streak: 0, max_win_streak: 0, max_loss_streak: 0, streak_type: 'none' };
  }

  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  completedTrades.forEach(trade => {
    const isWin = trade.sellPrice > trade.buyPrice;
    
    if (isWin) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    }
  });

  // Determine current streak
  const lastTrade = completedTrades[completedTrades.length - 1];
  const lastIsWin = lastTrade && lastTrade.sellPrice > lastTrade.buyPrice;
  currentStreak = lastIsWin ? currentWinStreak : -currentLossStreak;

  return {
    current_streak: currentStreak,
    max_win_streak: maxWinStreak,
    max_loss_streak: maxLossStreak,
    streak_type: currentStreak > 0 ? 'winning' : currentStreak < 0 ? 'losing' : 'neutral',
  };
}

/**
 * Calculate risk metrics
 */
function calculateRiskMetrics(trades, holdings, virtualBalance) {
  // Concentration risk - how much is in single stock
  const totalInvested = holdings.reduce((sum, h) => sum + (h.qty * h.avgCost), 0);
  const maxPosition = holdings.length > 0 
    ? Math.max(...holdings.map(h => h.qty * h.avgCost))
    : 0;
  const concentrationRisk = totalInvested > 0 ? maxPosition / totalInvested : 0;

  // Diversification score (more unique stocks = better)
  const uniqueStocks = new Set(trades.map(t => t.symbol)).size;
  const diversificationScore = Math.min(1, uniqueStocks / 10); // Cap at 10 stocks for max score

  // Calculate max drawdown from trade history
  const completedTrades = matchBuySellPairs(trades);
  let runningPnL = 0;
  let peak = 0;
  let maxDrawdown = 0;

  completedTrades.forEach(trade => {
    const pnl = (trade.sellPrice - trade.buyPrice) * trade.qty;
    runningPnL += pnl;
    peak = Math.max(peak, runningPnL);
    const drawdown = peak > 0 ? (peak - runningPnL) / peak : 0;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  // Portfolio exposure
  const portfolioExposure = totalInvested / (virtualBalance + totalInvested);

  return {
    concentration_risk: concentrationRisk,
    diversification_score: diversificationScore,
    max_drawdown: maxDrawdown,
    portfolio_exposure: portfolioExposure,
    unique_stocks_traded: uniqueStocks,
    risk_level: calculateRiskLevel(concentrationRisk, maxDrawdown, portfolioExposure),
  };
}

/**
 * Calculate overall risk level
 */
function calculateRiskLevel(concentration, drawdown, exposure) {
  const riskScore = (concentration * 0.3) + (drawdown * 0.4) + (exposure * 0.3);
  
  if (riskScore < 0.3) return 'conservative';
  if (riskScore < 0.6) return 'moderate';
  return 'aggressive';
}

/**
 * Extract features for ML models
 * Returns normalized feature vector
 */
export function extractMLFeatures(analysis) {
  const { user_summary, volatility_metrics, position_sizing, time_patterns, risk_metrics } = analysis;
  
  return {
    // Trading activity features
    total_trades: user_summary.total_trades,
    win_rate: user_summary.win_rate,
    avg_profit: user_summary.avg_profit,
    avg_holding_time: user_summary.avg_holding_time,
    trades_per_day: user_summary.trading_frequency?.trades_per_day || 0,
    
    // Position features
    avg_position_percent: position_sizing?.avg_position_percent || 0,
    position_consistency: position_sizing?.position_consistency || 0,
    
    // Risk features
    concentration_risk: risk_metrics?.concentration_risk || 0,
    diversification_score: risk_metrics?.diversification_score || 0,
    max_drawdown: risk_metrics?.max_drawdown || 0,
    portfolio_exposure: risk_metrics?.portfolio_exposure || 0,
    
    // Volatility features
    volatility_preference_numeric: 
      volatility_metrics?.volatility_preference === 'high' ? 1 : 
      volatility_metrics?.volatility_preference === 'low' ? 0 : 0.5,
    
    // Unique stocks
    unique_stocks: risk_metrics?.unique_stocks_traded || 0,
  };
}

export default { analyzeTrading, extractMLFeatures };

