"use client";
import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Brain, Shield, TrendingUp, PieChart as PieIcon, Activity, Info, X } from 'lucide-react';

/**
 * Info tooltip component
 */
function InfoTooltip({ title, description, details }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="More info"
      >
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-8 z-50 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            {details && (
              <div className="text-xs text-gray-500 space-y-1 border-t pt-2">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Trader Classification Chart
 * Shows probability distribution across trader types
 */
export function TraderClassifierChart({ prediction }) {
  const traderTypes = ['DAY_TRADER', 'SWING_TRADER', 'POSITION_TRADER', 'SCALPER'];
  
  // Format type for display (DAY_TRADER -> Day Trader)
  const formatType = (type) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  
  const data = traderTypes.map(type => ({
    type: formatType(type),
    probability: (prediction?.probabilities?.[type] || 0) * 100,
    fullMark: 100,
  }));

  const COLORS = {
    'DAY TRADER': '#3B82F6',
    'SWING TRADER': '#10B981',
    'POSITION TRADER': '#8B5CF6',
    'SCALPER': '#F59E0B',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Trader Classification</h3>
            <p className="text-sm text-gray-500">ML Model Prediction</p>
          </div>
        </div>
        <InfoTooltip
          title="Trader Classification"
          description="Our ML model analyzes your trading patterns to classify your trading style."
          details={[
            "Day Trader: Holds positions for hours, multiple trades daily",
            "Swing Trader: Holds for days to weeks, catches market swings",
            "Position Trader: Holds for weeks to months, follows trends",
            "Scalper: Ultra-short trades, profits from small price changes"
          ]}
        />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="type" 
              tick={{ fill: '#6B7280', fontSize: 11 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Radar
              name="Probability"
              dataKey="probability"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.5}
            />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, 'Probability']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-sm text-gray-600">Predicted Type:</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
          {prediction?.type
            ? prediction.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
            : 'Unknown'}
        </span>
        <span className="text-sm text-gray-500">
          ({((prediction?.confidence || 0) * 100).toFixed(0)}% confidence)
        </span>
      </div>
    </div>
  );
}

/**
 * Risk Assessment Chart
 * Shows risk level distribution with a gauge-style visualization
 */
export function RiskAssessmentChart({ prediction }) {
  const riskLevels = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'];
  
  const data = riskLevels.map(level => ({
    name: level,
    value: (prediction?.probabilities?.[level] || 0) * 100,
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  
  const riskColors = {
    CONSERVATIVE: '#10B981',
    MODERATE: '#F59E0B', 
    AGGRESSIVE: '#EF4444',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
            <p className="text-sm text-gray-500">Portfolio Risk Profile</p>
          </div>
        </div>
        <InfoTooltip
          title="Risk Assessment"
          description="Evaluates your risk tolerance based on position sizing, diversification, and drawdowns."
          details={[
            "Conservative: Small positions, diversified, low drawdowns",
            "Moderate: Balanced approach, medium position sizes",
            "Aggressive: Large positions, concentrated bets, higher risk"
          ]}
        />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, 'Probability']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-sm text-gray-600">Risk Level:</span>
        <span 
          className="px-3 py-1 rounded-full font-medium text-sm text-white"
          style={{ backgroundColor: riskColors[prediction?.level] || '#6B7280' }}
        >
          {prediction?.level || 'Unknown'}
        </span>
        <span className="text-sm text-gray-500">
          ({((prediction?.confidence || 0) * 100).toFixed(0)}% confidence)
        </span>
      </div>
    </div>
  );
}

/**
 * Performance Predictor Chart
 * Shows performance score with a gauge visualization
 */
export function PerformancePredictorChart({ prediction }) {
  const score = prediction?.score || 0;
  const grade = prediction?.grade || 'N/A';
  
  // Create gauge data
  const gaugeData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Bar chart data for score breakdown
  const breakdownData = [
    { name: 'Win Rate', value: Math.min(100, score * 0.4 + 20), fill: '#3B82F6' },
    { name: 'Consistency', value: Math.min(100, score * 0.3 + 30), fill: '#10B981' },
    { name: 'Risk Management', value: Math.min(100, score * 0.35 + 25), fill: '#8B5CF6' },
    { name: 'Discipline', value: Math.min(100, score * 0.25 + 35), fill: '#F59E0B' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Performance Prediction</h3>
            <p className="text-sm text-gray-500">ML-based Score Analysis</p>
          </div>
        </div>
        <InfoTooltip
          title="Performance Score"
          description="A composite score (0-100) predicting your trading success based on multiple factors."
          details={[
            "Win Rate: % of profitable trades (major factor)",
            "Consistency: How stable your position sizes are",
            "Risk Management: Drawdown control and diversification",
            "Discipline: Adherence to trading patterns"
          ]}
        />
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={getScoreColor(score)}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 440} 440`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
              {score.toFixed(0)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(grade)}`}>
              Grade {grade}
            </span>
          </div>
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdownData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(0)}%`, 'Score']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Sector Classification Chart
 * Shows sector distribution from trading history as a pie chart
 */
export function SectorClassifierChart({ sectorData }) {
  // Convert sector data to chart format
  const data = Object.entries(sectorData || {}).map(([name, count]) => ({
    name,
    value: count,
  })).sort((a, b) => b.value - a.value).slice(0, 8);

  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const totalTrades = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sector Distribution</h3>
              <p className="text-sm text-gray-500">Trading by Sector</p>
            </div>
          </div>
          <InfoTooltip
            title="Sector Distribution"
            description="Shows which market sectors you trade most frequently."
            details={[
              "Start trading to see your sector breakdown",
              "Diversification across sectors reduces risk"
            ]}
          />
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No sector data available yet</p>
        </div>
      </div>
    );
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <PieIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sector Distribution</h3>
            <p className="text-sm text-gray-500">Your Trading by Sector</p>
          </div>
        </div>
        <InfoTooltip
          title="Sector Distribution"
          description="Shows which market sectors you trade most frequently."
          details={[
            "Banking: HDFC, ICICI, SBI, Axis Bank, etc.",
            "IT: TCS, Infosys, Wipro, HCL Tech, etc.",
            "Energy: Reliance, ONGC, NTPC, Power Grid, etc.",
            "Pharma: Sun Pharma, Dr. Reddy's, Cipla, etc.",
            "Diversification across sectors reduces risk"
          ]}
        />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${value} trade${value > 1 ? 's' : ''} (${((value / totalTrades) * 100).toFixed(0)}%)`, 
                name
              ]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {data.map((sector, idx) => (
          <span 
            key={sector.name}
            className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
          >
            <span className="w-2 h-2 rounded-full bg-white/30"></span>
            {sector.name}: {sector.value}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Combined ML Analytics Dashboard
 */
export function MLAnalyticsDashboard({ report }) {
  const aiInsights = report?.aiInsights || {};
  const traderPrediction = aiInsights?.traderPrediction || report?.trader_prediction || {};
  const userSummary = report?.user_summary || {};
  const riskMetrics = report?.risk_metrics || {};

  // Create prediction objects for charts
  const traderClassification = {
    type: traderPrediction?.predicted_type || 'SWING_TRADER',
    confidence: traderPrediction?.confidence || 0.7,
    probabilities: {
      DAY_TRADER: traderPrediction?.predicted_type === 'DAY_TRADER' ? 0.7 : 0.1,
      SWING_TRADER: traderPrediction?.predicted_type === 'SWING_TRADER' ? 0.7 : 0.15,
      POSITION_TRADER: traderPrediction?.predicted_type === 'POSITION_TRADER' ? 0.7 : 0.1,
      SCALPER: traderPrediction?.predicted_type === 'SCALPER' ? 0.7 : 0.05,
    },
  };

  // Boost the predicted type probability
  if (traderPrediction?.predicted_type) {
    traderClassification.probabilities[traderPrediction.predicted_type] = 
      traderPrediction.confidence || 0.75;
  }

  const riskLevel = riskMetrics?.risk_level?.toUpperCase() || 'MODERATE';
  const riskAssessment = {
    level: riskLevel,
    confidence: 0.8,
    probabilities: {
      CONSERVATIVE: riskLevel === 'CONSERVATIVE' ? 0.75 : 0.15,
      MODERATE: riskLevel === 'MODERATE' ? 0.75 : 0.20,
      AGGRESSIVE: riskLevel === 'AGGRESSIVE' ? 0.75 : 0.10,
    },
  };

  const performancePrediction = {
    score: aiInsights?.tradingScore || 50,
    grade: getGrade(aiInsights?.tradingScore || 50),
  };

  function getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Activity className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">ML Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">AI-powered trading analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TraderClassifierChart prediction={traderClassification} />
        <RiskAssessmentChart prediction={riskAssessment} />
        <PerformancePredictorChart prediction={performancePrediction} />
        <SectorClassifierChart sectorData={userSummary?.sector_distribution} />
      </div>
    </div>
  );
}

export default MLAnalyticsDashboard;

