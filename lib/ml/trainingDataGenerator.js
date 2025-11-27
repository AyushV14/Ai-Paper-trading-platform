/**
 * Training Data Generator
 * Generates synthetic trading data for ML model training
 * Also supports loading real historical data
 */

/**
 * Trader type profiles for synthetic data generation
 */
const TRADER_PROFILES = {
  DAY_TRADER: {
    avgHoldingTime: { min: 0.01, max: 1 }, // Hours to 1 day
    tradesPerDay: { min: 3, max: 15 },
    winRate: { min: 0.45, max: 0.65 },
    avgProfit: { min: -2, max: 3 },
    positionSize: { min: 0.05, max: 0.15 },
    volatilityPref: 'high',
    diversification: { min: 3, max: 8 },
  },
  SWING_TRADER: {
    avgHoldingTime: { min: 2, max: 14 }, // 2-14 days
    tradesPerDay: { min: 0.1, max: 1 },
    winRate: { min: 0.50, max: 0.70 },
    avgProfit: { min: 1, max: 8 },
    positionSize: { min: 0.10, max: 0.25 },
    volatilityPref: 'moderate',
    diversification: { min: 5, max: 12 },
  },
  POSITION_TRADER: {
    avgHoldingTime: { min: 30, max: 180 }, // 1-6 months
    tradesPerDay: { min: 0.01, max: 0.1 },
    winRate: { min: 0.55, max: 0.75 },
    avgProfit: { min: 5, max: 25 },
    positionSize: { min: 0.15, max: 0.35 },
    volatilityPref: 'low',
    diversification: { min: 8, max: 20 },
  },
  SCALPER: {
    avgHoldingTime: { min: 0.001, max: 0.1 }, // Minutes to hours
    tradesPerDay: { min: 10, max: 50 },
    winRate: { min: 0.55, max: 0.70 },
    avgProfit: { min: 0.1, max: 1 },
    positionSize: { min: 0.02, max: 0.08 },
    volatilityPref: 'high',
    diversification: { min: 2, max: 5 },
  },
};

/**
 * Risk profile definitions
 */
const RISK_PROFILES = {
  CONSERVATIVE: {
    positionSize: { min: 0.02, max: 0.08 },
    concentration: { min: 0.05, max: 0.15 },
    portfolioExposure: { min: 0.20, max: 0.50 },
    maxDrawdown: { min: 0.02, max: 0.10 },
    diversification: { min: 10, max: 25 },
  },
  MODERATE: {
    positionSize: { min: 0.08, max: 0.18 },
    concentration: { min: 0.15, max: 0.30 },
    portfolioExposure: { min: 0.40, max: 0.70 },
    maxDrawdown: { min: 0.08, max: 0.20 },
    diversification: { min: 5, max: 12 },
  },
  AGGRESSIVE: {
    positionSize: { min: 0.15, max: 0.40 },
    concentration: { min: 0.25, max: 0.60 },
    portfolioExposure: { min: 0.60, max: 0.95 },
    maxDrawdown: { min: 0.15, max: 0.40 },
    diversification: { min: 2, max: 6 },
  },
};

/**
 * Sector definitions with typical characteristics
 */
const SECTORS = {
  BANKING: { volatility: 0.6, symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'] },
  IT: { volatility: 0.7, symbols: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'] },
  PHARMA: { volatility: 0.65, symbols: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'BIOCON'] },
  AUTO: { volatility: 0.75, symbols: ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'HEROMOTOCO'] },
  ENERGY: { volatility: 0.5, symbols: ['RELIANCE', 'ONGC', 'BPCL', 'IOC', 'NTPC'] },
  FMCG: { volatility: 0.4, symbols: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR'] },
  METALS: { volatility: 0.8, symbols: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'COALINDIA'] },
  TELECOM: { volatility: 0.55, symbols: ['BHARTIARTL', 'IDEA', 'TATACOMM'] },
  REALTY: { volatility: 0.85, symbols: ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'PRESTIGE'] },
  FINANCE: { volatility: 0.65, symbols: ['BAJFINANCE', 'BAJAJFINSV', 'HDFC', 'SBILIFE'] },
};

/**
 * Generate random number within range
 */
function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Generate random integer within range
 */
function randomIntInRange(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

/**
 * Add Gaussian noise to a value
 */
function addNoise(value, noiseLevel = 0.1) {
  const noise = (Math.random() - 0.5) * 2 * noiseLevel * value;
  return value + noise;
}

/**
 * Generate synthetic training data for trader classification
 * @param {number} samplesPerClass - Number of samples per trader type
 * @returns {Array} Training data with features and labels
 */
export function generateTraderClassificationData(samplesPerClass = 500) {
  const data = [];
  const traderTypes = Object.keys(TRADER_PROFILES);

  traderTypes.forEach((type, labelIndex) => {
    const profile = TRADER_PROFILES[type];

    for (let i = 0; i < samplesPerClass; i++) {
      // Generate features based on profile with some noise
      const features = {
        avg_holding_time: addNoise(randomInRange(profile.avgHoldingTime.min, profile.avgHoldingTime.max), 0.2),
        trades_per_day: addNoise(randomInRange(profile.tradesPerDay.min, profile.tradesPerDay.max), 0.15),
        win_rate: Math.max(0, Math.min(1, addNoise(randomInRange(profile.winRate.min, profile.winRate.max), 0.1))),
        avg_profit: addNoise(randomInRange(profile.avgProfit.min, profile.avgProfit.max), 0.2),
        avg_position_percent: addNoise(randomInRange(profile.positionSize.min, profile.positionSize.max), 0.15),
        volatility_preference: profile.volatilityPref === 'high' ? 1 : profile.volatilityPref === 'low' ? 0 : 0.5,
        diversification_score: Math.min(1, randomInRange(profile.diversification.min, profile.diversification.max) / 20),
        position_consistency: addNoise(randomInRange(0.4, 0.9), 0.1),
      };

      data.push({
        features: Object.values(features),
        featureNames: Object.keys(features),
        label: labelIndex,
        labelName: type,
      });
    }
  });

  // Shuffle data
  return shuffleArray(data);
}

/**
 * Generate synthetic training data for risk assessment
 * @param {number} samplesPerClass - Number of samples per risk level
 * @returns {Array} Training data with features and labels
 */
export function generateRiskAssessmentData(samplesPerClass = 500) {
  const data = [];
  const riskLevels = Object.keys(RISK_PROFILES);

  riskLevels.forEach((level, labelIndex) => {
    const profile = RISK_PROFILES[level];

    for (let i = 0; i < samplesPerClass; i++) {
      const features = {
        avg_position_percent: addNoise(randomInRange(profile.positionSize.min, profile.positionSize.max), 0.15),
        concentration_risk: addNoise(randomInRange(profile.concentration.min, profile.concentration.max), 0.1),
        portfolio_exposure: addNoise(randomInRange(profile.portfolioExposure.min, profile.portfolioExposure.max), 0.1),
        max_drawdown: addNoise(randomInRange(profile.maxDrawdown.min, profile.maxDrawdown.max), 0.15),
        diversification_score: Math.min(1, randomInRange(profile.diversification.min, profile.diversification.max) / 25),
        win_rate: addNoise(randomInRange(0.4, 0.7), 0.1),
        trades_per_day: addNoise(randomInRange(0.1, 5), 0.2),
        volatility_preference: randomInRange(0, 1),
      };

      data.push({
        features: Object.values(features),
        featureNames: Object.keys(features),
        label: labelIndex,
        labelName: level,
      });
    }
  });

  return shuffleArray(data);
}

/**
 * Generate synthetic training data for performance prediction
 * @param {number} samples - Number of training samples
 * @returns {Array} Training data with features and target values
 */
export function generatePerformancePredictionData(samples = 2000) {
  const data = [];

  for (let i = 0; i < samples; i++) {
    // Generate trader characteristics
    const winRate = randomInRange(0.3, 0.8);
    const avgProfit = randomInRange(-5, 15);
    const tradesPerDay = randomInRange(0.05, 10);
    const avgHoldingTime = randomInRange(0.01, 90);
    const positionConsistency = randomInRange(0.3, 0.95);
    const diversification = randomInRange(0.1, 1);
    const maxDrawdown = randomInRange(0.02, 0.35);
    const portfolioExposure = randomInRange(0.2, 0.9);

    // Calculate expected performance score (0-100)
    // This is a simplified model - real performance depends on many factors
    let performanceScore = 50; // Base score

    // Win rate contribution (up to +25)
    performanceScore += (winRate - 0.5) * 50;

    // Average profit contribution (up to +15)
    performanceScore += Math.min(15, avgProfit * 1.5);

    // Consistency bonus (up to +10)
    performanceScore += positionConsistency * 10;

    // Diversification bonus (up to +10)
    performanceScore += diversification * 10;

    // Drawdown penalty (up to -15)
    performanceScore -= maxDrawdown * 40;

    // Add some noise
    performanceScore = addNoise(performanceScore, 0.1);

    // Clamp to 0-100
    performanceScore = Math.max(0, Math.min(100, performanceScore));

    const features = {
      win_rate: winRate,
      avg_profit: avgProfit,
      trades_per_day: tradesPerDay,
      avg_holding_time: avgHoldingTime,
      position_consistency: positionConsistency,
      diversification_score: diversification,
      max_drawdown: maxDrawdown,
      portfolio_exposure: portfolioExposure,
    };

    data.push({
      features: Object.values(features),
      featureNames: Object.keys(features),
      target: performanceScore,
    });
  }

  return shuffleArray(data);
}

/**
 * Generate synthetic training data for sector classification
 * @param {number} samplesPerSector - Number of samples per sector
 * @returns {Array} Training data with features and labels
 */
export function generateSectorClassificationData(samplesPerSector = 300) {
  const data = [];
  const sectorNames = Object.keys(SECTORS);

  sectorNames.forEach((sector, labelIndex) => {
    const sectorInfo = SECTORS[sector];

    for (let i = 0; i < samplesPerSector; i++) {
      // Generate price and volume patterns typical for this sector
      const baseVolatility = sectorInfo.volatility;
      
      const features = {
        price_volatility: addNoise(baseVolatility, 0.15),
        avg_volume_ratio: addNoise(randomInRange(0.5, 2), 0.2),
        price_momentum: addNoise(randomInRange(-0.1, 0.1), 0.5),
        sector_correlation: addNoise(randomInRange(0.3, 0.8), 0.15),
        beta: addNoise(baseVolatility + randomInRange(-0.2, 0.2), 0.1),
        market_cap_tier: randomIntInRange(1, 3), // 1=large, 2=mid, 3=small
        dividend_yield: sector === 'FMCG' || sector === 'ENERGY' 
          ? randomInRange(0.02, 0.05) 
          : randomInRange(0, 0.02),
        pe_ratio: randomInRange(10, 50),
      };

      data.push({
        features: Object.values(features),
        featureNames: Object.keys(features),
        label: labelIndex,
        labelName: sector,
      });
    }
  });

  return shuffleArray(data);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Split data into training and validation sets
 */
export function splitData(data, trainRatio = 0.8) {
  const splitIndex = Math.floor(data.length * trainRatio);
  return {
    train: data.slice(0, splitIndex),
    validation: data.slice(splitIndex),
  };
}

/**
 * Normalize features to 0-1 range
 */
export function normalizeFeatures(data) {
  if (data.length === 0) return { normalized: [], mins: [], maxs: [] };

  const numFeatures = data[0].features.length;
  const mins = new Array(numFeatures).fill(Infinity);
  const maxs = new Array(numFeatures).fill(-Infinity);

  // Find min and max for each feature
  data.forEach(sample => {
    sample.features.forEach((val, i) => {
      mins[i] = Math.min(mins[i], val);
      maxs[i] = Math.max(maxs[i], val);
    });
  });

  // Normalize
  const normalized = data.map(sample => ({
    ...sample,
    features: sample.features.map((val, i) => {
      const range = maxs[i] - mins[i];
      return range > 0 ? (val - mins[i]) / range : 0;
    }),
  }));

  return { normalized, mins, maxs };
}

/**
 * Apply normalization using pre-computed mins and maxs
 */
export function applyNormalization(features, mins, maxs) {
  return features.map((val, i) => {
    const range = maxs[i] - mins[i];
    return range > 0 ? (val - mins[i]) / range : 0;
  });
}

/**
 * Convert real user trades to training data format
 * @param {Object} analysis - Output from tradingAnalyzer
 * @param {string} traderType - Known trader type (for supervised learning)
 * @param {string} riskLevel - Known risk level
 * @returns {Object} Training sample
 */
export function convertRealDataToTraining(analysis, traderType = null, riskLevel = null) {
  const { user_summary, position_sizing, risk_metrics, volatility_metrics } = analysis;

  const traderFeatures = [
    user_summary.avg_holding_time || 0,
    user_summary.trading_frequency?.trades_per_day || 0,
    user_summary.win_rate || 0,
    user_summary.avg_profit || 0,
    position_sizing?.avg_position_percent || 0,
    volatility_metrics?.volatility_preference === 'high' ? 1 : 
      volatility_metrics?.volatility_preference === 'low' ? 0 : 0.5,
    risk_metrics?.diversification_score || 0,
    position_sizing?.position_consistency || 0,
  ];

  const riskFeatures = [
    position_sizing?.avg_position_percent || 0,
    risk_metrics?.concentration_risk || 0,
    risk_metrics?.portfolio_exposure || 0,
    risk_metrics?.max_drawdown || 0,
    risk_metrics?.diversification_score || 0,
    user_summary.win_rate || 0,
    user_summary.trading_frequency?.trades_per_day || 0,
    volatility_metrics?.volatility_preference === 'high' ? 1 : 
      volatility_metrics?.volatility_preference === 'low' ? 0 : 0.5,
  ];

  return {
    traderClassification: {
      features: traderFeatures,
      label: traderType ? Object.keys(TRADER_PROFILES).indexOf(traderType) : null,
      labelName: traderType,
    },
    riskAssessment: {
      features: riskFeatures,
      label: riskLevel ? Object.keys(RISK_PROFILES).indexOf(riskLevel) : null,
      labelName: riskLevel,
    },
  };
}

export const TRADER_TYPES = Object.keys(TRADER_PROFILES);
export const RISK_LEVELS = Object.keys(RISK_PROFILES);
export const SECTOR_NAMES = Object.keys(SECTORS);

export default {
  generateTraderClassificationData,
  generateRiskAssessmentData,
  generatePerformancePredictionData,
  generateSectorClassificationData,
  splitData,
  normalizeFeatures,
  applyNormalization,
  convertRealDataToTraining,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
};

