import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

/**
 * GET - Check ML model status
 */
export async function GET(req) {
  try {
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    
    const models = [
      'trader-classifier',
      'risk-assessment', 
      'performance-predictor',
      'sector-classifier'
    ];

    const status = {};
    let allReady = true;

    for (const model of models) {
      const modelPath = path.join(modelsDir, model);
      const paramsPath = path.join(modelsDir, `${model}-params.json`);
      
      const modelExists = fs.existsSync(path.join(modelPath, 'model.json'));
      const paramsExist = fs.existsSync(paramsPath);
      
      status[model] = {
        ready: modelExists && paramsExist,
        modelPath: modelExists ? `/models/${model}/model.json` : null,
        paramsPath: paramsExist ? `/models/${model}-params.json` : null,
      };

      if (!status[model].ready) {
        allReady = false;
      }
    }

    return NextResponse.json({
      ready: allReady,
      models: status,
      message: allReady 
        ? 'All ML models are trained and ready' 
        : 'Some models need training. Run: npm run train-models',
    });
  } catch (error) {
    console.error('Error checking ML status:', error);
    return NextResponse.json({ 
      error: error.message,
      ready: false,
    }, { status: 500 });
  }
}

/**
 * POST - Get predictions for trading analysis
 */
export async function POST(req) {
  try {
    const { analysis } = await req.json();

    if (!analysis) {
      return NextResponse.json({ 
        error: "Analysis data required" 
      }, { status: 400 });
    }

    // For server-side, use heuristic predictions
    // TensorFlow.js models run in browser for better performance
    const predictions = getHeuristicPredictions(analysis);

    return NextResponse.json({
      predictions,
      method: 'heuristic',
      note: 'Using rule-based predictions. For ML predictions, use client-side TensorFlow.js',
    });
  } catch (error) {
    console.error('Error in ML predictions:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * Heuristic predictions for server-side use
 */
function getHeuristicPredictions(analysis) {
  const { user_summary, position_sizing, risk_metrics, volatility_metrics } = analysis;
  
  // Trader type heuristic
  const avgHoldingTime = user_summary?.avg_holding_time || 0;
  const tradesPerDay = user_summary?.trading_frequency?.trades_per_day || 0;
  
  let traderType = 'SWING_TRADER';
  let traderConfidence = 0.7;
  
  if (avgHoldingTime < 0.1 && tradesPerDay > 10) {
    traderType = 'SCALPER';
    traderConfidence = 0.85;
  } else if (avgHoldingTime <= 1 && tradesPerDay >= 2) {
    traderType = 'DAY_TRADER';
    traderConfidence = 0.8;
  } else if (avgHoldingTime > 14) {
    traderType = 'POSITION_TRADER';
    traderConfidence = 0.75;
  }

  // Risk level heuristic
  const concentration = risk_metrics?.concentration_risk || 0;
  const exposure = risk_metrics?.portfolio_exposure || 0;
  const drawdown = risk_metrics?.max_drawdown || 0;
  const riskScore = (concentration * 0.3) + (drawdown * 0.4) + (exposure * 0.3);
  
  let riskLevel = 'MODERATE';
  let riskConfidence = 0.7;
  
  if (riskScore < 0.25) {
    riskLevel = 'CONSERVATIVE';
    riskConfidence = 0.8;
  } else if (riskScore > 0.55) {
    riskLevel = 'AGGRESSIVE';
    riskConfidence = 0.8;
  }

  // Performance score heuristic
  let score = 50;
  const winRate = user_summary?.win_rate || 0;
  const avgProfit = user_summary?.avg_profit || 0;
  const consistency = position_sizing?.position_consistency || 0;
  const diversification = risk_metrics?.diversification_score || 0;
  
  score += (winRate - 0.5) * 50;
  score += Math.min(15, Math.max(-15, avgProfit * 2));
  score += consistency * 10;
  score += diversification * 10;
  score -= drawdown * 50;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const getGrade = (s) => {
    if (s >= 90) return 'A+';
    if (s >= 80) return 'A';
    if (s >= 70) return 'B+';
    if (s >= 60) return 'B';
    if (s >= 50) return 'C';
    if (s >= 40) return 'D';
    return 'F';
  };

  return {
    traderType: {
      type: traderType,
      confidence: traderConfidence,
      probabilities: {
        SCALPER: traderType === 'SCALPER' ? traderConfidence : 0.1,
        DAY_TRADER: traderType === 'DAY_TRADER' ? traderConfidence : 0.1,
        SWING_TRADER: traderType === 'SWING_TRADER' ? traderConfidence : 0.1,
        POSITION_TRADER: traderType === 'POSITION_TRADER' ? traderConfidence : 0.1,
      },
    },
    riskLevel: {
      level: riskLevel,
      confidence: riskConfidence,
      probabilities: {
        CONSERVATIVE: riskLevel === 'CONSERVATIVE' ? riskConfidence : 0.15,
        MODERATE: riskLevel === 'MODERATE' ? riskConfidence : 0.15,
        AGGRESSIVE: riskLevel === 'AGGRESSIVE' ? riskConfidence : 0.15,
      },
    },
    performance: {
      score,
      grade: getGrade(score),
    },
    analysis_summary: {
      total_trades: user_summary?.total_trades || 0,
      win_rate: winRate,
      avg_profit: avgProfit,
      risk_score: riskScore,
    },
  };
}

