/**
 * TensorFlow.js ML Models for Trading Analysis
 * 
 * Models:
 * 1. Trader Classification (Day Trader, Swing Trader, Position Trader, Scalper)
 * 2. Risk Assessment (Conservative, Moderate, Aggressive)
 * 3. Performance Prediction (Score 0-100)
 * 4. Sector Classification
 */

import * as tf from '@tensorflow/tfjs';
import {
  generateTraderClassificationData,
  generateRiskAssessmentData,
  generatePerformancePredictionData,
  generateSectorClassificationData,
  splitData,
  normalizeFeatures,
  applyNormalization,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
} from './trainingDataGenerator.js';

// Model storage paths
const MODEL_PATHS = {
  traderClassifier: '/models/trader-classifier',
  riskAssessment: '/models/risk-assessment',
  performancePredictor: '/models/performance-predictor',
  sectorClassifier: '/models/sector-classifier',
};

// Store normalization parameters
let normalizationParams = {
  traderClassifier: null,
  riskAssessment: null,
  performancePredictor: null,
  sectorClassifier: null,
};

/**
 * Create a classification neural network
 */
function createClassificationModel(inputSize, numClasses, hiddenLayers = [64, 32]) {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.dense({
    units: hiddenLayers[0],
    activation: 'relu',
    inputShape: [inputSize],
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
  }));
  model.add(tf.layers.dropout({ rate: 0.3 }));

  // Hidden layers
  for (let i = 1; i < hiddenLayers.length; i++) {
    model.add(tf.layers.dense({
      units: hiddenLayers[i],
      activation: 'relu',
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
  }

  // Output layer
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax',
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

/**
 * Create a regression neural network for performance prediction
 */
function createRegressionModel(inputSize, hiddenLayers = [64, 32, 16]) {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.dense({
    units: hiddenLayers[0],
    activation: 'relu',
    inputShape: [inputSize],
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.3 }));

  // Hidden layers
  for (let i = 1; i < hiddenLayers.length; i++) {
    model.add(tf.layers.dense({
      units: hiddenLayers[i],
      activation: 'relu',
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
  }

  // Output layer (single value 0-100)
  model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid', // Output 0-1, multiply by 100 for score
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mae'],
  });

  return model;
}

/**
 * Train the Trader Classification model
 */
export async function trainTraderClassifier(options = {}) {
  const {
    samplesPerClass = 500,
    epochs = 50,
    batchSize = 32,
    validationSplit = 0.2,
    onProgress = null,
  } = options;

  console.log('Generating training data for Trader Classifier...');
  const rawData = generateTraderClassificationData(samplesPerClass);
  const { normalized, mins, maxs } = normalizeFeatures(rawData);
  const { train, validation } = splitData(normalized, 1 - validationSplit);

  // Store normalization params
  normalizationParams.traderClassifier = { mins, maxs };

  // Prepare tensors
  const xTrain = tf.tensor2d(train.map(d => d.features));
  const yTrain = tf.oneHot(tf.tensor1d(train.map(d => d.label), 'int32'), TRADER_TYPES.length);
  const xVal = tf.tensor2d(validation.map(d => d.features));
  const yVal = tf.oneHot(tf.tensor1d(validation.map(d => d.label), 'int32'), TRADER_TYPES.length);

  // Create and train model
  const model = createClassificationModel(train[0].features.length, TRADER_TYPES.length, [128, 64, 32]);

  console.log('Training Trader Classifier...');
  const history = await model.fit(xTrain, yTrain, {
    epochs,
    batchSize,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress) {
          onProgress({
            model: 'traderClassifier',
            epoch: epoch + 1,
            totalEpochs: epochs,
            loss: logs.loss,
            accuracy: logs.acc,
            valLoss: logs.val_loss,
            valAccuracy: logs.val_acc,
          });
        }
        if ((epoch + 1) % 10 === 0) {
          console.log(`Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}`);
        }
      },
    },
  });

  // Cleanup tensors
  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();

  return { model, history, normParams: { mins, maxs } };
}

/**
 * Train the Risk Assessment model
 */
export async function trainRiskAssessment(options = {}) {
  const {
    samplesPerClass = 500,
    epochs = 50,
    batchSize = 32,
    validationSplit = 0.2,
    onProgress = null,
  } = options;

  console.log('Generating training data for Risk Assessment...');
  const rawData = generateRiskAssessmentData(samplesPerClass);
  const { normalized, mins, maxs } = normalizeFeatures(rawData);
  const { train, validation } = splitData(normalized, 1 - validationSplit);

  normalizationParams.riskAssessment = { mins, maxs };

  const xTrain = tf.tensor2d(train.map(d => d.features));
  const yTrain = tf.oneHot(tf.tensor1d(train.map(d => d.label), 'int32'), RISK_LEVELS.length);
  const xVal = tf.tensor2d(validation.map(d => d.features));
  const yVal = tf.oneHot(tf.tensor1d(validation.map(d => d.label), 'int32'), RISK_LEVELS.length);

  const model = createClassificationModel(train[0].features.length, RISK_LEVELS.length, [64, 32]);

  console.log('Training Risk Assessment model...');
  const history = await model.fit(xTrain, yTrain, {
    epochs,
    batchSize,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress) {
          onProgress({
            model: 'riskAssessment',
            epoch: epoch + 1,
            totalEpochs: epochs,
            loss: logs.loss,
            accuracy: logs.acc,
            valLoss: logs.val_loss,
            valAccuracy: logs.val_acc,
          });
        }
      },
    },
  });

  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();

  return { model, history, normParams: { mins, maxs } };
}

/**
 * Train the Performance Prediction model
 */
export async function trainPerformancePredictor(options = {}) {
  const {
    samples = 2000,
    epochs = 100,
    batchSize = 32,
    validationSplit = 0.2,
    onProgress = null,
  } = options;

  console.log('Generating training data for Performance Predictor...');
  const rawData = generatePerformancePredictionData(samples);
  const { normalized, mins, maxs } = normalizeFeatures(rawData);
  const { train, validation } = splitData(normalized, 1 - validationSplit);

  normalizationParams.performancePredictor = { mins, maxs };

  const xTrain = tf.tensor2d(train.map(d => d.features));
  const yTrain = tf.tensor2d(train.map(d => [d.target / 100])); // Normalize to 0-1
  const xVal = tf.tensor2d(validation.map(d => d.features));
  const yVal = tf.tensor2d(validation.map(d => [d.target / 100]));

  const model = createRegressionModel(train[0].features.length, [64, 32, 16]);

  console.log('Training Performance Predictor...');
  const history = await model.fit(xTrain, yTrain, {
    epochs,
    batchSize,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress) {
          onProgress({
            model: 'performancePredictor',
            epoch: epoch + 1,
            totalEpochs: epochs,
            loss: logs.loss,
            mae: logs.mae,
            valLoss: logs.val_loss,
            valMae: logs.val_mae,
          });
        }
      },
    },
  });

  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();

  return { model, history, normParams: { mins, maxs } };
}

/**
 * Train the Sector Classification model
 */
export async function trainSectorClassifier(options = {}) {
  const {
    samplesPerSector = 300,
    epochs = 50,
    batchSize = 32,
    validationSplit = 0.2,
    onProgress = null,
  } = options;

  console.log('Generating training data for Sector Classifier...');
  const rawData = generateSectorClassificationData(samplesPerSector);
  const { normalized, mins, maxs } = normalizeFeatures(rawData);
  const { train, validation } = splitData(normalized, 1 - validationSplit);

  normalizationParams.sectorClassifier = { mins, maxs };

  const xTrain = tf.tensor2d(train.map(d => d.features));
  const yTrain = tf.oneHot(tf.tensor1d(train.map(d => d.label), 'int32'), SECTOR_NAMES.length);
  const xVal = tf.tensor2d(validation.map(d => d.features));
  const yVal = tf.oneHot(tf.tensor1d(validation.map(d => d.label), 'int32'), SECTOR_NAMES.length);

  const model = createClassificationModel(train[0].features.length, SECTOR_NAMES.length, [128, 64, 32]);

  console.log('Training Sector Classifier...');
  const history = await model.fit(xTrain, yTrain, {
    epochs,
    batchSize,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress) {
          onProgress({
            model: 'sectorClassifier',
            epoch: epoch + 1,
            totalEpochs: epochs,
            loss: logs.loss,
            accuracy: logs.acc,
            valLoss: logs.val_loss,
            valAccuracy: logs.val_acc,
          });
        }
      },
    },
  });

  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();

  return { model, history, normParams: { mins, maxs } };
}

/**
 * Train all models
 */
export async function trainAllModels(options = {}) {
  const { onProgress = null } = options;

  console.log('Starting training for all models...\n');

  const results = {};

  // Train Trader Classifier
  console.log('=== Training Trader Classifier ===');
  results.traderClassifier = await trainTraderClassifier({ ...options, onProgress });

  // Train Risk Assessment
  console.log('\n=== Training Risk Assessment ===');
  results.riskAssessment = await trainRiskAssessment({ ...options, onProgress });

  // Train Performance Predictor
  console.log('\n=== Training Performance Predictor ===');
  results.performancePredictor = await trainPerformancePredictor({ ...options, onProgress });

  // Train Sector Classifier
  console.log('\n=== Training Sector Classifier ===');
  results.sectorClassifier = await trainSectorClassifier({ ...options, onProgress });

  console.log('\n✅ All models trained successfully!');

  return results;
}

/**
 * Predict trader type using trained model
 */
export function predictTraderType(model, features, normParams) {
  const normalizedFeatures = applyNormalization(features, normParams.mins, normParams.maxs);
  const inputTensor = tf.tensor2d([normalizedFeatures]);
  
  const prediction = model.predict(inputTensor);
  const probabilities = prediction.dataSync();
  const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
  
  inputTensor.dispose();
  prediction.dispose();

  return {
    type: TRADER_TYPES[predictedIndex],
    confidence: probabilities[predictedIndex],
    probabilities: TRADER_TYPES.reduce((acc, type, i) => {
      acc[type] = probabilities[i];
      return acc;
    }, {}),
  };
}

/**
 * Predict risk level using trained model
 */
export function predictRiskLevel(model, features, normParams) {
  const normalizedFeatures = applyNormalization(features, normParams.mins, normParams.maxs);
  const inputTensor = tf.tensor2d([normalizedFeatures]);
  
  const prediction = model.predict(inputTensor);
  const probabilities = prediction.dataSync();
  const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
  
  inputTensor.dispose();
  prediction.dispose();

  return {
    level: RISK_LEVELS[predictedIndex],
    confidence: probabilities[predictedIndex],
    probabilities: RISK_LEVELS.reduce((acc, level, i) => {
      acc[level] = probabilities[i];
      return acc;
    }, {}),
  };
}

/**
 * Predict performance score using trained model
 */
export function predictPerformance(model, features, normParams) {
  const normalizedFeatures = applyNormalization(features, normParams.mins, normParams.maxs);
  const inputTensor = tf.tensor2d([normalizedFeatures]);
  
  const prediction = model.predict(inputTensor);
  const score = prediction.dataSync()[0] * 100; // Scale back to 0-100
  
  inputTensor.dispose();
  prediction.dispose();

  return {
    score: Math.round(score * 10) / 10,
    grade: getPerformanceGrade(score),
  };
}

/**
 * Predict sector using trained model
 */
export function predictSector(model, features, normParams) {
  const normalizedFeatures = applyNormalization(features, normParams.mins, normParams.maxs);
  const inputTensor = tf.tensor2d([normalizedFeatures]);
  
  const prediction = model.predict(inputTensor);
  const probabilities = prediction.dataSync();
  const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
  
  inputTensor.dispose();
  prediction.dispose();

  // Get top 3 sectors
  const sortedSectors = SECTOR_NAMES
    .map((name, i) => ({ name, probability: probabilities[i] }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  return {
    sector: SECTOR_NAMES[predictedIndex],
    confidence: probabilities[predictedIndex],
    topSectors: sortedSectors,
  };
}

/**
 * Get performance grade from score
 */
function getPerformanceGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Save trained models to storage
 */
export async function saveModels(models) {
  const saved = {};
  
  for (const [name, { model, normParams }] of Object.entries(models)) {
    try {
      // Save model to localStorage (browser) or file system (Node.js)
      await model.save(`localstorage://${name}`);
      
      // Save normalization params
      localStorage.setItem(`${name}_normParams`, JSON.stringify(normParams));
      
      saved[name] = true;
      console.log(`✅ Saved ${name}`);
    } catch (error) {
      console.error(`❌ Failed to save ${name}:`, error);
      saved[name] = false;
    }
  }
  
  return saved;
}

/**
 * Load trained models from storage
 */
export async function loadModels() {
  const models = {};
  
  for (const name of Object.keys(MODEL_PATHS)) {
    try {
      const model = await tf.loadLayersModel(`localstorage://${name}`);
      const normParams = JSON.parse(localStorage.getItem(`${name}_normParams`));
      
      models[name] = { model, normParams };
      console.log(`✅ Loaded ${name}`);
    } catch (error) {
      console.log(`ℹ️ ${name} not found in storage, will need training`);
      models[name] = null;
    }
  }
  
  return models;
}

export {
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
  normalizationParams,
};

export default {
  trainTraderClassifier,
  trainRiskAssessment,
  trainPerformancePredictor,
  trainSectorClassifier,
  trainAllModels,
  predictTraderType,
  predictRiskLevel,
  predictPerformance,
  predictSector,
  saveModels,
  loadModels,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
};

