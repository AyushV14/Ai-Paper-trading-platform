/**
 * Training Script for ML Models
 * Run with: npm run train-models
 * 
 * This script trains all ML models and saves them to the file system
 * for use in the application.
 */

import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import {
  generateTraderClassificationData,
  generateRiskAssessmentData,
  generatePerformancePredictionData,
  generateSectorClassificationData,
  splitData,
  normalizeFeatures,
  TRADER_TYPES,
  RISK_LEVELS,
  SECTOR_NAMES,
} from '../lib/ml/trainingDataGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom model saver for Node.js
 */
async function saveModel(model, modelDir, paramsPath, normParams) {
  // Create directory
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  // Get model topology and weights
  const modelJSON = model.toJSON();
  
  // Save weights as binary
  const weightData = [];
  const weightSpecs = [];
  
  for (const layer of model.layers) {
    const weights = layer.getWeights();
    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i];
      const spec = {
        name: `${layer.name}/${i}`,
        shape: weight.shape,
        dtype: weight.dtype,
      };
      weightSpecs.push(spec);
      
      const data = await weight.data();
      weightData.push(new Float32Array(data));
    }
  }

  // Save model.json
  const modelArtifact = {
    modelTopology: modelJSON,
    weightsManifest: [{
      paths: ['weights.bin'],
      weights: weightSpecs,
    }],
    format: 'layers-model',
    generatedBy: 'TensorFlow.js training script',
    convertedBy: null,
  };
  
  fs.writeFileSync(
    path.join(modelDir, 'model.json'),
    JSON.stringify(modelArtifact, null, 2)
  );

  // Save weights as binary
  const totalLength = weightData.reduce((sum, arr) => sum + arr.length, 0);
  const allWeights = new Float32Array(totalLength);
  let offset = 0;
  for (const arr of weightData) {
    allWeights.set(arr, offset);
    offset += arr.length;
  }
  
  fs.writeFileSync(
    path.join(modelDir, 'weights.bin'),
    Buffer.from(allWeights.buffer)
  );

  // Save normalization params
  fs.writeFileSync(paramsPath, JSON.stringify(normParams, null, 2));
  
  console.log(`   ✅ Saved to ${modelDir}`);
}

const runTraining = async () => {
  console.log('='.repeat(60));
  console.log('🚀 ML Model Training Script');
  console.log('='.repeat(60));
  console.log('');

  try {
    await tf.ready();
    console.log(`✅ TensorFlow.js loaded (backend: ${tf.getBackend()})`);
    console.log('');

    // Create models directory
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Training configuration
    const config = {
      samplesPerClass: 1000,
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
    };

    console.log('📊 Training Configuration:');
    console.log(`   Samples per class: ${config.samplesPerClass}`);
    console.log(`   Epochs: ${config.epochs}`);
    console.log(`   Batch size: ${config.batchSize}`);
    console.log(`   Validation split: ${config.validationSplit * 100}%`);
    console.log('');

    // ===================================
    // 1. Train Trader Classifier
    // ===================================
    console.log('─'.repeat(60));
    console.log('📈 Training Trader Classifier...');
    console.log(`   Classes: ${TRADER_TYPES.join(', ')}`);
    
    const traderData = generateTraderClassificationData(config.samplesPerClass);
    const { normalized: traderNormalized, mins: traderMins, maxs: traderMaxs } = normalizeFeatures(traderData);
    const { train: traderTrain, validation: traderVal } = splitData(traderNormalized, 1 - config.validationSplit);

    const traderModel = tf.sequential();
    traderModel.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [8] }));
    traderModel.add(tf.layers.dropout({ rate: 0.3 }));
    traderModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    traderModel.add(tf.layers.dropout({ rate: 0.2 }));
    traderModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    traderModel.add(tf.layers.dense({ units: TRADER_TYPES.length, activation: 'softmax' }));

    traderModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    const xTraderTrain = tf.tensor2d(traderTrain.map(d => d.features));
    const yTraderTrain = tf.oneHot(tf.tensor1d(traderTrain.map(d => d.label), 'int32'), TRADER_TYPES.length);
    const xTraderVal = tf.tensor2d(traderVal.map(d => d.features));
    const yTraderVal = tf.oneHot(tf.tensor1d(traderVal.map(d => d.label), 'int32'), TRADER_TYPES.length);

    await traderModel.fit(xTraderTrain, yTraderTrain, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationData: [xTraderVal, yTraderVal],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 20 === 0) {
            console.log(`   Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}`);
          }
        },
      },
    });

    await saveModel(
      traderModel,
      path.join(modelsDir, 'trader-classifier'),
      path.join(modelsDir, 'trader-classifier-params.json'),
      { mins: traderMins, maxs: traderMaxs, labels: TRADER_TYPES }
    );

    // Cleanup
    xTraderTrain.dispose(); yTraderTrain.dispose();
    xTraderVal.dispose(); yTraderVal.dispose();
    traderModel.dispose();

    // ===================================
    // 2. Train Risk Assessment Model
    // ===================================
    console.log('');
    console.log('─'.repeat(60));
    console.log('🛡️ Training Risk Assessment Model...');
    console.log(`   Classes: ${RISK_LEVELS.join(', ')}`);

    const riskData = generateRiskAssessmentData(config.samplesPerClass);
    const { normalized: riskNormalized, mins: riskMins, maxs: riskMaxs } = normalizeFeatures(riskData);
    const { train: riskTrain, validation: riskVal } = splitData(riskNormalized, 1 - config.validationSplit);

    const riskModel = tf.sequential();
    riskModel.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [8] }));
    riskModel.add(tf.layers.dropout({ rate: 0.3 }));
    riskModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    riskModel.add(tf.layers.dense({ units: RISK_LEVELS.length, activation: 'softmax' }));

    riskModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    const xRiskTrain = tf.tensor2d(riskTrain.map(d => d.features));
    const yRiskTrain = tf.oneHot(tf.tensor1d(riskTrain.map(d => d.label), 'int32'), RISK_LEVELS.length);
    const xRiskVal = tf.tensor2d(riskVal.map(d => d.features));
    const yRiskVal = tf.oneHot(tf.tensor1d(riskVal.map(d => d.label), 'int32'), RISK_LEVELS.length);

    await riskModel.fit(xRiskTrain, yRiskTrain, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationData: [xRiskVal, yRiskVal],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 20 === 0) {
            console.log(`   Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}`);
          }
        },
      },
    });

    await saveModel(
      riskModel,
      path.join(modelsDir, 'risk-assessment'),
      path.join(modelsDir, 'risk-assessment-params.json'),
      { mins: riskMins, maxs: riskMaxs, labels: RISK_LEVELS }
    );

    xRiskTrain.dispose(); yRiskTrain.dispose();
    xRiskVal.dispose(); yRiskVal.dispose();
    riskModel.dispose();

    // ===================================
    // 3. Train Performance Predictor
    // ===================================
    console.log('');
    console.log('─'.repeat(60));
    console.log('📊 Training Performance Predictor...');
    console.log('   Output: Score 0-100');

    const perfData = generatePerformancePredictionData(config.samplesPerClass * 4);
    const { normalized: perfNormalized, mins: perfMins, maxs: perfMaxs } = normalizeFeatures(perfData);
    const { train: perfTrain, validation: perfVal } = splitData(perfNormalized, 1 - config.validationSplit);

    const perfModel = tf.sequential();
    perfModel.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [8] }));
    perfModel.add(tf.layers.batchNormalization());
    perfModel.add(tf.layers.dropout({ rate: 0.3 }));
    perfModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    perfModel.add(tf.layers.dropout({ rate: 0.2 }));
    perfModel.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    perfModel.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    perfModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });

    const xPerfTrain = tf.tensor2d(perfTrain.map(d => d.features));
    const yPerfTrain = tf.tensor2d(perfTrain.map(d => [d.target / 100]));
    const xPerfVal = tf.tensor2d(perfVal.map(d => d.features));
    const yPerfVal = tf.tensor2d(perfVal.map(d => [d.target / 100]));

    await perfModel.fit(xPerfTrain, yPerfTrain, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationData: [xPerfVal, yPerfVal],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 20 === 0) {
            console.log(`   Epoch ${epoch + 1}: loss=${logs.loss.toFixed(6)}, mae=${logs.mae.toFixed(4)}, val_mae=${logs.val_mae.toFixed(4)}`);
          }
        },
      },
    });

    await saveModel(
      perfModel,
      path.join(modelsDir, 'performance-predictor'),
      path.join(modelsDir, 'performance-predictor-params.json'),
      { mins: perfMins, maxs: perfMaxs }
    );

    xPerfTrain.dispose(); yPerfTrain.dispose();
    xPerfVal.dispose(); yPerfVal.dispose();
    perfModel.dispose();

    // ===================================
    // 4. Train Sector Classifier
    // ===================================
    console.log('');
    console.log('─'.repeat(60));
    console.log('🏭 Training Sector Classifier...');
    console.log(`   Classes: ${SECTOR_NAMES.join(', ')}`);

    const sectorData = generateSectorClassificationData(config.samplesPerClass);
    const { normalized: sectorNormalized, mins: sectorMins, maxs: sectorMaxs } = normalizeFeatures(sectorData);
    const { train: sectorTrain, validation: sectorVal } = splitData(sectorNormalized, 1 - config.validationSplit);

    const sectorModel = tf.sequential();
    sectorModel.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [8] }));
    sectorModel.add(tf.layers.dropout({ rate: 0.3 }));
    sectorModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    sectorModel.add(tf.layers.dropout({ rate: 0.2 }));
    sectorModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    sectorModel.add(tf.layers.dense({ units: SECTOR_NAMES.length, activation: 'softmax' }));

    sectorModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    const xSectorTrain = tf.tensor2d(sectorTrain.map(d => d.features));
    const ySectorTrain = tf.oneHot(tf.tensor1d(sectorTrain.map(d => d.label), 'int32'), SECTOR_NAMES.length);
    const xSectorVal = tf.tensor2d(sectorVal.map(d => d.features));
    const ySectorVal = tf.oneHot(tf.tensor1d(sectorVal.map(d => d.label), 'int32'), SECTOR_NAMES.length);

    await sectorModel.fit(xSectorTrain, ySectorTrain, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationData: [xSectorVal, ySectorVal],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 20 === 0) {
            console.log(`   Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, acc=${logs.acc.toFixed(4)}, val_acc=${logs.val_acc.toFixed(4)}`);
          }
        },
      },
    });

    await saveModel(
      sectorModel,
      path.join(modelsDir, 'sector-classifier'),
      path.join(modelsDir, 'sector-classifier-params.json'),
      { mins: sectorMins, maxs: sectorMaxs, labels: SECTOR_NAMES }
    );

    xSectorTrain.dispose(); ySectorTrain.dispose();
    xSectorVal.dispose(); ySectorVal.dispose();
    sectorModel.dispose();

    // ===================================
    // Summary
    // ===================================
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ All models trained and saved successfully!');
    console.log('');
    console.log('📁 Model files saved to: public/models/');
    console.log('   - trader-classifier/');
    console.log('   - risk-assessment/');
    console.log('   - performance-predictor/');
    console.log('   - sector-classifier/');
    console.log('');
    console.log('🚀 Models are ready to use in the application!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Training failed:', error);
    process.exit(1);
  }
};

runTraining();
