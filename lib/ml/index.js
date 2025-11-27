/**
 * ML Service - Main entry point for all ML operations
 * Provides a unified interface for training and predictions
 */

import * as tf from '@tensorflow/tfjs';
import {
  trainTraderClassifier,
  trainRiskAssessment,
  trainPerformancePredictor,
  trainSectorClassifier,
  trainAllModels,
  predictTraderType,
  predictRiskLevel,
  predictPerformance,
  predictSector,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
} from './models.js';
import { convertRealDataToTraining } from './trainingDataGenerator.js';

// Store trained models in memory
let trainedModels = {
  traderClassifier: null,
  riskAssessment: null,
  performancePredictor: null,
  sectorClassifier: null,
};

let modelsReady = false;
let trainingInProgress = false;

/**
 * Initialize ML service - train models if not available
 */
export async function initializeML(options = {}) {
  if (modelsReady) {
    console.log('ML models already initialized');
    return true;
  }

  if (trainingInProgress) {
    console.log('Training already in progress...');
    return false;
  }

  try {
    trainingInProgress = true;
    console.log('Initializing ML models...');
    
    // Check if TensorFlow.js is ready
    await tf.ready();
    console.log(`TensorFlow.js backend: ${tf.getBackend()}`);

    // Try to load existing models first
    const loaded = await loadModelsFromStorage();
    
    if (loaded) {
      console.log('Loaded pre-trained models from storage');
      modelsReady = true;
      return true;
    }

    // Train new models
    console.log('Training new models...');
    const results = await trainAllModels(options);

    trainedModels = {
      traderClassifier: results.traderClassifier,
      riskAssessment: results.riskAssessment,
      performancePredictor: results.performancePredictor,
      sectorClassifier: results.sectorClassifier,
    };

    // Save to storage for future use
    await saveModelsToStorage();
    
    modelsReady = true;
    console.log('ML models ready!');
    return true;
  } catch (error) {
    console.error('Failed to initialize ML:', error);
    modelsReady = false;
    return false;
  } finally {
    trainingInProgress = false;
  }
}

/**
 * Save models to localStorage/IndexedDB
 */
async function saveModelsToStorage() {
  try {
    for (const [name, data] of Object.entries(trainedModels)) {
      if (data && data.model) {
        await data.model.save(`indexeddb://${name}`);
        // Store normalization params separately
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`ml_${name}_params`, JSON.stringify(data.normParams));
        }
      }
    }
    console.log('Models saved to storage');
    return true;
  } catch (error) {
    console.error('Failed to save models:', error);
    return false;
  }
}

/**
 * Load models from localStorage/IndexedDB
 */
async function loadModelsFromStorage() {
  try {
    let allLoaded = true;

    for (const name of Object.keys(trainedModels)) {
      try {
        const model = await tf.loadLayersModel(`indexeddb://${name}`);
        let normParams = null;
        
        if (typeof localStorage !== 'undefined') {
          const paramsStr = localStorage.getItem(`ml_${name}_params`);
          if (paramsStr) {
            normParams = JSON.parse(paramsStr);
          }
        }

        if (model && normParams) {
          trainedModels[name] = { model, normParams };
        } else {
          allLoaded = false;
        }
      } catch (e) {
        console.log(`Model ${name} not found in storage`);
        allLoaded = false;
      }
    }

    return allLoaded;
  } catch (error) {
    console.error('Failed to load models:', error);
    return false;
  }
}

/**
 * Run all predictions on trading analysis
 * @param {Object} analysis - Output from tradingAnalyzer
 * @returns {Object} All predictions
 */
export async function runPredictions(analysis) {
  // Ensure models are ready
  if (!modelsReady) {
    console.log('Models not ready, initializing...');
    await initializeML();
  }

  const { user_summary, position_sizing, risk_metrics, volatility_metrics } = analysis;

  // Extract features for trader classification
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

  // Extract features for risk assessment
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

  // Extract features for performance prediction
  const performanceFeatures = [
    user_summary.win_rate || 0,
    user_summary.avg_profit || 0,
    user_summary.trading_frequency?.trades_per_day || 0,
    user_summary.avg_holding_time || 0,
    position_sizing?.position_consistency || 0,
    risk_metrics?.diversification_score || 0,
    risk_metrics?.max_drawdown || 0,
    risk_metrics?.portfolio_exposure || 0,
  ];

  const predictions = {
    traderType: null,
    riskLevel: null,
    performance: null,
  };

  try {
    // Trader Type Prediction
    if (trainedModels.traderClassifier?.model) {
      predictions.traderType = predictTraderType(
        trainedModels.traderClassifier.model,
        traderFeatures,
        trainedModels.traderClassifier.normParams
      );
    }

    // Risk Level Prediction
    if (trainedModels.riskAssessment?.model) {
      predictions.riskLevel = predictRiskLevel(
        trainedModels.riskAssessment.model,
        riskFeatures,
        trainedModels.riskAssessment.normParams
      );
    }

    // Performance Prediction
    if (trainedModels.performancePredictor?.model) {
      predictions.performance = predictPerformance(
        trainedModels.performancePredictor.model,
        performanceFeatures,
        trainedModels.performancePredictor.normParams
      );
    }
  } catch (error) {
    console.error('Prediction error:', error);
  }

  return predictions;
}

/**
 * Quick prediction without full model initialization
 * Uses heuristic rules for faster response
 */
export function quickPredict(analysis) {
  const { user_summary, position_sizing, risk_metrics, volatility_metrics } = analysis;
  
  // Trader type heuristic
  const avgHoldingTime = user_summary.avg_holding_time || 0;
  const tradesPerDay = user_summary.trading_frequency?.trades_per_day || 0;
  
  let traderType = 'SWING_TRADER';
  if (avgHoldingTime < 0.1 && tradesPerDay > 10) traderType = 'SCALPER';
  else if (avgHoldingTime <= 1 && tradesPerDay >= 2) traderType = 'DAY_TRADER';
  else if (avgHoldingTime > 14) traderType = 'POSITION_TRADER';

  // Risk level heuristic
  const concentration = risk_metrics?.concentration_risk || 0;
  const exposure = risk_metrics?.portfolio_exposure || 0;
  const drawdown = risk_metrics?.max_drawdown || 0;
  const riskScore = (concentration * 0.3) + (drawdown * 0.4) + (exposure * 0.3);
  
  let riskLevel = 'MODERATE';
  if (riskScore < 0.3) riskLevel = 'CONSERVATIVE';
  else if (riskScore > 0.6) riskLevel = 'AGGRESSIVE';

  // Performance score heuristic
  let score = 50;
  score += ((user_summary.win_rate || 0) - 0.5) * 50;
  score += Math.min(15, Math.max(-15, (user_summary.avg_profit || 0) * 2));
  score += (position_sizing?.position_consistency || 0) * 10;
  score += (risk_metrics?.diversification_score || 0) * 10;
  score -= (risk_metrics?.max_drawdown || 0) * 50;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    traderType: { type: traderType, confidence: 0.7, method: 'heuristic' },
    riskLevel: { level: riskLevel, confidence: 0.7, method: 'heuristic' },
    performance: { score, grade: getGrade(score), method: 'heuristic' },
  };
}

function getGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Check if models are ready
 */
export function areModelsReady() {
  return modelsReady;
}

/**
 * Get model status
 */
export function getModelStatus() {
  return {
    ready: modelsReady,
    training: trainingInProgress,
    models: {
      traderClassifier: !!trainedModels.traderClassifier,
      riskAssessment: !!trainedModels.riskAssessment,
      performancePredictor: !!trainedModels.performancePredictor,
      sectorClassifier: !!trainedModels.sectorClassifier,
    },
  };
}

/**
 * Retrain a specific model with new data
 */
export async function retrainModel(modelName, options = {}) {
  const trainers = {
    traderClassifier: trainTraderClassifier,
    riskAssessment: trainRiskAssessment,
    performancePredictor: trainPerformancePredictor,
    sectorClassifier: trainSectorClassifier,
  };

  if (!trainers[modelName]) {
    throw new Error(`Unknown model: ${modelName}`);
  }

  const result = await trainers[modelName](options);
  trainedModels[modelName] = result;
  await saveModelsToStorage();
  
  return result;
}

/**
 * Add real trading data to training set (for future training)
 */
export function addTrainingData(analysis, labels = {}) {
  const trainingData = convertRealDataToTraining(
    analysis,
    labels.traderType,
    labels.riskLevel
  );
  
  // Store for future batch training
  if (typeof localStorage !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('ml_training_queue') || '[]');
    existing.push({
      data: trainingData,
      timestamp: new Date().toISOString(),
    });
    // Keep last 1000 samples
    const trimmed = existing.slice(-1000);
    localStorage.setItem('ml_training_queue', JSON.stringify(trimmed));
  }
  
  return trainingData;
}

export {
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
};

export default {
  initializeML,
  runPredictions,
  quickPredict,
  areModelsReady,
  getModelStatus,
  retrainModel,
  addTrainingData,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
};

