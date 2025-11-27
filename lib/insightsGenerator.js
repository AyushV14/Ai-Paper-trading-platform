/**
 * Local Insights Generator
 * Generates personalized trading insights using rule-based logic
 * Replaces Google Gemini AI API
 */

/**
 * Generate comprehensive trading insights from analysis data and ML predictions
 * @param {Object} analysis - Trading analysis from tradingAnalyzer
 * @param {Object} mlPredictions - Predictions from ML models
 * @returns {Object} Generated insights
 */
export function generateInsights(analysis, mlPredictions = null) {
  const { user_summary, volatility_metrics, position_sizing, time_patterns, streaks, risk_metrics, portfolio_summary } = analysis;

  // Use ML predictions if available, otherwise infer from data
  const traderType = mlPredictions?.traderType?.type || inferTraderType(analysis);
  const riskLevel = mlPredictions?.riskLevel?.level || risk_metrics?.risk_level || 'moderate';
  const performanceScore = mlPredictions?.performance?.score || calculatePerformanceScore(analysis);

  return {
    tradingStyle: generateTradingStyleDescription(traderType, analysis),
    strengths: generateStrengths(analysis, traderType),
    improvements: generateImprovements(analysis, riskLevel),
    recommendations: generateRecommendations(analysis, traderType, riskLevel),
    riskAssessment: generateRiskAssessment(analysis, riskLevel),
    psychologicalProfile: generatePsychologicalProfile(analysis, traderType),
    nextMilestone: generateNextMilestone(analysis),
    tradingScore: performanceScore,
    topOpportunity: generateTopOpportunity(analysis),
    celebrationMoment: generateCelebrationMoment(analysis),
    traderPrediction: {
      predicted_type: traderType,
      confidence: mlPredictions?.traderType?.confidence || 0.75,
    },
  };
}

/**
 * Infer trader type from analysis data
 */
function inferTraderType(analysis) {
  const { user_summary } = analysis;
  const avgHoldingTime = user_summary.avg_holding_time || 0;
  const tradesPerDay = user_summary.trading_frequency?.trades_per_day || 0;

  if (avgHoldingTime < 0.1 && tradesPerDay > 10) return 'SCALPER';
  if (avgHoldingTime <= 1 && tradesPerDay >= 2) return 'DAY_TRADER';
  if (avgHoldingTime <= 14 && tradesPerDay >= 0.1) return 'SWING_TRADER';
  return 'POSITION_TRADER';
}

/**
 * Calculate performance score from analysis
 */
function calculatePerformanceScore(analysis) {
  const { user_summary, position_sizing, risk_metrics } = analysis;
  
  let score = 50; // Base score
  
  // Win rate contribution (+/- 25 points)
  const winRate = user_summary.win_rate || 0;
  score += (winRate - 0.5) * 50;
  
  // Average profit contribution (+/- 15 points)
  const avgProfit = user_summary.avg_profit || 0;
  score += Math.min(15, Math.max(-15, avgProfit * 2));
  
  // Consistency bonus (up to +10 points)
  const consistency = position_sizing?.position_consistency || 0;
  score += consistency * 10;
  
  // Diversification bonus (up to +10 points)
  const diversification = risk_metrics?.diversification_score || 0;
  score += diversification * 10;
  
  // Drawdown penalty (up to -20 points)
  const maxDrawdown = risk_metrics?.max_drawdown || 0;
  score -= maxDrawdown * 50;
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Generate trading style description
 */
function generateTradingStyleDescription(traderType, analysis) {
  const { user_summary, time_patterns } = analysis;
  const winRate = (user_summary.win_rate * 100).toFixed(1);
  const avgHolding = user_summary.avg_holding_time?.toFixed(1) || '0';
  const activePeriod = time_patterns?.most_active_period || 'market hours';

  const descriptions = {
    SCALPER: `You're a precision-focused scalper, executing rapid-fire trades like a seasoned market sniper. With ${user_summary.total_trades} trades and a ${winRate}% success rate, you thrive on capturing small price movements. Your average holding time of ${avgHolding} days shows your lightning-quick decision-making ability. You're most active during ${activePeriod}, maximizing opportunities in high-volatility windows.`,
    
    DAY_TRADER: `You embody the classic day trader mentality—methodical, alert, and decisive. Your ${user_summary.total_trades} trades with a ${winRate}% win rate demonstrate disciplined intraday execution. Averaging ${avgHolding} days per position, you rarely carry overnight risk. Like a chess player thinking several moves ahead, you prefer calculated entries during ${activePeriod} when market patterns are clearest.`,
    
    SWING_TRADER: `You're a patient swing trader who rides market waves rather than fighting them. With ${user_summary.total_trades} trades at a ${winRate}% success rate, you've mastered the art of capturing medium-term trends. Your ${avgHolding}-day average holding period shows you let winners run while cutting losses short. You trade with the rhythm of the market, not against it.`,
    
    POSITION_TRADER: `You're a strategic position trader with a long-term vision. Your ${user_summary.total_trades} carefully selected trades and ${winRate}% win rate reflect quality over quantity. With an average holding time of ${avgHolding} days, you think like an investor while trading like a tactician. You focus on fundamental setups and ignore short-term noise.`,
  };

  return descriptions[traderType] || descriptions.SWING_TRADER;
}

/**
 * Generate strengths based on analysis
 */
function generateStrengths(analysis, traderType) {
  const { user_summary, position_sizing, risk_metrics, streaks, time_patterns } = analysis;
  const strengths = [];

  // Win rate strength
  if (user_summary.win_rate >= 0.55) {
    strengths.push(`Maintaining a strong ${(user_summary.win_rate * 100).toFixed(1)}% win rate, outperforming the typical 45-50% average trader—this consistency shows solid stock selection skills.`);
  } else if (user_summary.win_rate >= 0.45) {
    strengths.push(`Your ${(user_summary.win_rate * 100).toFixed(1)}% win rate is within healthy trading parameters, suggesting balanced risk-reward execution.`);
  }

  // Profit strength
  if (user_summary.avg_profit > 0) {
    strengths.push(`Averaging ${user_summary.avg_profit.toFixed(2)}% profit per trade demonstrates effective profit-taking discipline and letting winners run.`);
  }

  // Position sizing strength
  if (position_sizing?.position_consistency > 0.6) {
    strengths.push(`Highly consistent position sizing (${(position_sizing.position_consistency * 100).toFixed(0)}% consistency) shows disciplined risk management—a hallmark of professional traders.`);
  }

  // Diversification strength
  if (risk_metrics?.diversification_score > 0.5) {
    strengths.push(`Well-diversified across ${risk_metrics.unique_stocks_traded} different stocks, reducing single-stock risk and building a balanced portfolio approach.`);
  }

  // Streak strength
  if (streaks?.max_win_streak >= 5) {
    strengths.push(`Achieved an impressive ${streaks.max_win_streak}-trade winning streak, demonstrating the ability to capitalize on favorable market conditions.`);
  }

  // Time pattern strength
  if (time_patterns?.most_active_period) {
    strengths.push(`Strategic timing with peak activity during ${time_patterns.most_active_period} hours, aligning trades with optimal market liquidity.`);
  }

  // Trading frequency strength for active traders
  if (user_summary.trading_frequency?.trades_per_day > 1) {
    strengths.push(`Active trading style with ${user_summary.trading_frequency.trades_per_day.toFixed(1)} trades/day shows market engagement and opportunity capture.`);
  }

  // Ensure minimum strengths
  if (strengths.length < 3) {
    strengths.push(`Completed ${user_summary.total_trades} trades, building valuable experience and market intuition.`);
    strengths.push(`Established a consistent trading routine, which is the foundation of long-term trading success.`);
  }

  return strengths.slice(0, 5);
}

/**
 * Generate improvement areas
 */
function generateImprovements(analysis, riskLevel) {
  const { user_summary, position_sizing, risk_metrics, streaks } = analysis;
  const improvements = [];

  // Win rate improvement
  if (user_summary.win_rate < 0.50) {
    improvements.push(`Consider refining entry criteria—your ${(user_summary.win_rate * 100).toFixed(1)}% win rate has room for improvement. Focus on higher-probability setups with clear technical confirmation.`);
  }

  // Profit improvement
  if (user_summary.avg_profit <= 0) {
    improvements.push(`Average trade showing ${user_summary.avg_profit.toFixed(2)}% return. Consider widening profit targets and tightening stop-losses to improve risk-reward ratio.`);
  }

  // Diversification improvement
  if (risk_metrics?.diversification_score < 0.4) {
    improvements.push(`Portfolio concentration is high with only ${risk_metrics.unique_stocks_traded} stocks traded. Expanding to 8-12 quality stocks can reduce unsystematic risk.`);
  }

  // Position sizing improvement
  if (position_sizing?.position_consistency < 0.5) {
    improvements.push(`Position sizing varies significantly (${(position_sizing.position_consistency * 100).toFixed(0)}% consistency). Standardizing to 2-5% per trade can stabilize returns.`);
  }

  // Drawdown improvement
  if (risk_metrics?.max_drawdown > 0.15) {
    improvements.push(`Maximum drawdown of ${(risk_metrics.max_drawdown * 100).toFixed(1)}% exceeds recommended 10-15%. Consider implementing stricter stop-loss rules.`);
  }

  // Loss streak improvement
  if (streaks?.max_loss_streak >= 4) {
    improvements.push(`${streaks.max_loss_streak}-trade losing streak detected. Consider implementing a "cooling off" period after 3 consecutive losses.`);
  }

  // Aggressive risk improvement
  if (riskLevel === 'aggressive' || riskLevel === 'AGGRESSIVE') {
    improvements.push(`Aggressive positioning detected. While this can amplify gains, consider reducing position sizes during high-volatility periods.`);
  }

  // Trading frequency for overtrading
  if (user_summary.trading_frequency?.trades_per_day > 10 && user_summary.win_rate < 0.5) {
    improvements.push(`High trade frequency (${user_summary.trading_frequency.trades_per_day.toFixed(1)}/day) with below-average win rate suggests possible overtrading. Quality over quantity may improve results.`);
  }

  return improvements.slice(0, 5);
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(analysis, traderType, riskLevel) {
  const { user_summary, position_sizing, risk_metrics, time_patterns } = analysis;
  const recommendations = [];

  // Entry/Exit recommendations based on trader type
  if (traderType === 'DAY_TRADER' || traderType === 'SCALPER') {
    recommendations.push(`📊 Set up price alerts at key support/resistance levels to catch breakout opportunities without constant screen watching.`);
    recommendations.push(`⏰ Focus your trading during your peak performance hours (${time_patterns?.most_active_period || 'market open'}) when your win rate is historically highest.`);
  } else {
    recommendations.push(`📈 Use weekly chart analysis to identify macro trends before drilling into daily setups—this can improve swing trade success by 15-20%.`);
    recommendations.push(`🎯 Set take-profit targets at 1.5-2x your stop-loss distance to maintain positive expectancy even with 50% win rate.`);
  }

  // Risk management recommendations
  if (risk_metrics?.max_drawdown > 0.10) {
    recommendations.push(`🛡️ Implement a daily loss limit of 2-3% of portfolio. If hit, stop trading for the day to prevent emotional decisions.`);
  }

  // Position sizing recommendations
  if (position_sizing?.avg_position_percent > 15) {
    recommendations.push(`📏 Reduce average position size from ${position_sizing.avg_position_percent.toFixed(1)}% to 5-10% of portfolio to survive inevitable losing streaks.`);
  } else {
    recommendations.push(`💰 Your position sizing is conservative. Consider scaling into winners with an additional 25-50% position when trade moves in your favor.`);
  }

  // Diversification recommendations
  if (risk_metrics?.diversification_score < 0.5) {
    recommendations.push(`🔄 Add 2-3 stocks from different sectors to your watchlist. Sector rotation can provide opportunities when your main picks are consolidating.`);
  }

  // Win rate specific recommendations
  if (user_summary.win_rate < 0.50) {
    recommendations.push(`📝 Start a trading journal documenting entry reasons, emotions, and outcomes. Review weekly to identify patterns in losing trades.`);
  } else if (user_summary.win_rate > 0.60) {
    recommendations.push(`🚀 Your high win rate suggests you may be taking profits too early. Experiment with trailing stops to let winners run longer.`);
  }

  // General best practices
  recommendations.push(`📱 Review your trades every weekend: identify your best setups and eliminate strategies that consistently underperform.`);
  
  if (user_summary.total_trades < 50) {
    recommendations.push(`🎓 With ${user_summary.total_trades} trades, you're still building experience. Focus on consistency over profitability—the profits will follow.`);
  }

  return recommendations.slice(0, 6);
}

/**
 * Generate risk assessment
 */
function generateRiskAssessment(analysis, riskLevel) {
  const { risk_metrics, position_sizing } = analysis;
  
  const riskDescriptions = {
    conservative: `Your trading approach is conservative with well-controlled risk exposure. Portfolio concentration of ${((risk_metrics?.concentration_risk || 0) * 100).toFixed(1)}% and diversification across ${risk_metrics?.unique_stocks_traded || 0} stocks suggests prudent risk management. Consider that being too conservative may limit upside potential—a small allocation to higher-conviction trades could boost returns.`,
    
    CONSERVATIVE: `Your trading approach is conservative with well-controlled risk exposure. Portfolio concentration of ${((risk_metrics?.concentration_risk || 0) * 100).toFixed(1)}% and diversification across ${risk_metrics?.unique_stocks_traded || 0} stocks suggests prudent risk management. Consider that being too conservative may limit upside potential—a small allocation to higher-conviction trades could boost returns.`,
    
    moderate: `You maintain a balanced risk profile with ${((risk_metrics?.portfolio_exposure || 0) * 100).toFixed(1)}% portfolio exposure and ${((risk_metrics?.max_drawdown || 0) * 100).toFixed(1)}% maximum drawdown. This middle-ground approach provides growth potential while managing downside. To optimize further, consider using sector ETFs for broader exposure during uncertain markets.`,
    
    MODERATE: `You maintain a balanced risk profile with ${((risk_metrics?.portfolio_exposure || 0) * 100).toFixed(1)}% portfolio exposure and ${((risk_metrics?.max_drawdown || 0) * 100).toFixed(1)}% maximum drawdown. This middle-ground approach provides growth potential while managing downside. To optimize further, consider using sector ETFs for broader exposure during uncertain markets.`,
    
    aggressive: `Your aggressive trading style shows high conviction with ${((risk_metrics?.concentration_risk || 0) * 100).toFixed(1)}% concentration and ${((risk_metrics?.max_drawdown || 0) * 100).toFixed(1)}% historical drawdown. While this can generate outsized returns, it also exposes you to significant losses. Consider reducing position sizes by 25% during high-volatility periods or after losing streaks.`,
    
    AGGRESSIVE: `Your aggressive trading style shows high conviction with ${((risk_metrics?.concentration_risk || 0) * 100).toFixed(1)}% concentration and ${((risk_metrics?.max_drawdown || 0) * 100).toFixed(1)}% historical drawdown. While this can generate outsized returns, it also exposes you to significant losses. Consider reducing position sizes by 25% during high-volatility periods or after losing streaks.`,
  };

  return riskDescriptions[riskLevel] || riskDescriptions.moderate;
}

/**
 * Generate psychological profile
 */
function generatePsychologicalProfile(analysis, traderType) {
  const { user_summary, streaks, position_sizing, time_patterns } = analysis;
  
  let profile = '';
  
  // Decision-making style based on trade frequency
  if (traderType === 'SCALPER' || traderType === 'DAY_TRADER') {
    profile += `You display quick, decisive thinking typical of active traders—comfortable making rapid decisions under pressure. `;
  } else {
    profile += `Your patient, methodical approach suggests strong emotional discipline—you don't chase trades or panic sell. `;
  }
  
  // Emotional discipline based on streaks
  if (streaks?.max_loss_streak <= 3 && user_summary.win_rate > 0.5) {
    profile += `Your limited losing streaks indicate good emotional control and the ability to cut losses without hesitation. `;
  } else if (streaks?.max_loss_streak > 5) {
    profile += `Extended losing streaks may indicate difficulty stepping back when strategies aren't working—consider implementing mandatory breaks after consecutive losses. `;
  }
  
  // Position consistency psychology
  if (position_sizing?.position_consistency > 0.7) {
    profile += `The "systematic trader" mindset: rules-based, disciplined, and less prone to impulsive decisions.`;
  } else {
    profile += `Variable position sizing may reflect confidence-based trading—larger bets on "sure things." Consider if this aligns with your risk tolerance.`;
  }
  
  return profile;
}

/**
 * Generate next milestone
 */
function generateNextMilestone(analysis) {
  const { user_summary, risk_metrics } = analysis;
  
  // Based on current performance, suggest next achievable goal
  if (user_summary.total_trades < 25) {
    return `Complete 25 trades while maintaining a trading journal. Track every entry/exit reason to build pattern recognition. Target: 4-6 weeks.`;
  }
  
  if (user_summary.win_rate < 0.50) {
    return `Achieve a 50% win rate over your next 20 trades by focusing only on A+ setups that meet all your criteria. Target: 3-4 weeks.`;
  }
  
  if (user_summary.win_rate < 0.55) {
    return `Push your win rate from ${(user_summary.win_rate * 100).toFixed(1)}% to 55% by eliminating your lowest-probability trade setups. Target: 1 month.`;
  }
  
  if (risk_metrics?.diversification_score < 0.5) {
    return `Expand your trading universe from ${risk_metrics.unique_stocks_traded} to 10 stocks across 4+ sectors while maintaining your win rate. Target: 6 weeks.`;
  }
  
  if (user_summary.avg_profit < 3) {
    return `Increase average profit per trade to 3%+ by implementing trailing stops on winning positions. Let winners run longer. Target: 1 month.`;
  }
  
  return `Maintain your current performance while increasing total trades by 25%. Focus on replicating your best setups. Target: 2 months.`;
}

/**
 * Generate top opportunity
 */
function generateTopOpportunity(analysis) {
  const { user_summary, position_sizing, risk_metrics, time_patterns } = analysis;
  
  // Identify the single biggest improvement opportunity
  if (user_summary.win_rate < 0.45) {
    return `🎯 FOCUS: Your win rate is your biggest lever. Spend 15 minutes reviewing your last 10 losing trades—identify the common entry mistake and eliminate it. This alone could add 5-10% to your win rate.`;
  }
  
  if (position_sizing?.position_consistency < 0.4) {
    return `🎯 FOCUS: Standardize your position sizing to 5% of portfolio per trade. Inconsistent sizing is causing unnecessary variance in your returns and making it harder to evaluate strategy performance.`;
  }
  
  if (risk_metrics?.max_drawdown > 0.20) {
    return `🎯 FOCUS: Implement a hard stop-loss at 7-8% below entry on every trade. Your drawdowns are eating into profits. Protecting capital is more important than any single trade.`;
  }
  
  if (user_summary.avg_profit < 1 && user_summary.win_rate > 0.5) {
    return `🎯 FOCUS: You're winning more than losing but profits are small. Widen your profit targets by 50%—your high win rate can absorb a slight decrease while significantly improving average gain.`;
  }
  
  if (risk_metrics?.unique_stocks_traded < 5) {
    return `🎯 FOCUS: Add 3-4 quality stocks from different sectors to your watchlist. Single-stock focus is high-risk. Diversification is your safety net when your top pick disappoints.`;
  }
  
  return `🎯 FOCUS: Your trading is fundamentally sound. The next level is mental game—develop a pre-trade checklist and stick to it religiously. Consistency in process leads to consistency in results.`;
}

/**
 * Generate celebration moment
 */
function generateCelebrationMoment(analysis) {
  const { user_summary, streaks, position_sizing, risk_metrics } = analysis;
  
  // Find something genuinely praiseworthy
  if (streaks?.max_win_streak >= 5) {
    return `🎉 Incredible ${streaks.max_win_streak}-trade winning streak! This shows you can identify and capitalize on favorable conditions. That's a skill many traders never develop.`;
  }
  
  if (user_summary.win_rate >= 0.60) {
    return `🎉 A ${(user_summary.win_rate * 100).toFixed(1)}% win rate puts you in the top tier of retail traders! Most struggle to maintain 45-50%. Your stock selection is genuinely impressive.`;
  }
  
  if (user_summary.avg_profit >= 5) {
    return `🎉 Averaging ${user_summary.avg_profit.toFixed(2)}% per trade is exceptional! You've mastered the art of letting winners run—one of the hardest psychological challenges in trading.`;
  }
  
  if (position_sizing?.position_consistency >= 0.8) {
    return `🎉 Your ${(position_sizing.position_consistency * 100).toFixed(0)}% position sizing consistency is remarkable! This discipline is the foundation of sustainable trading success.`;
  }
  
  if (risk_metrics?.max_drawdown < 0.08 && user_summary.total_trades > 20) {
    return `🎉 Maximum drawdown under 8% shows elite risk management! You're protecting capital like a pro—this is what separates long-term winners from the crowd.`;
  }
  
  if (user_summary.total_trades >= 50) {
    return `🎉 ${user_summary.total_trades} trades completed! You've pushed through the learning curve that stops most traders. Your persistence is paying off in experience and pattern recognition.`;
  }
  
  return `🎉 You're actively learning and trading—that puts you ahead of 90% of people who only talk about investing. Every trade, win or loss, is building your market intuition.`;
}

export default { generateInsights };

