"use client"

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart, Activity, MoreHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';
import { CardBalance } from '../../../../components/homepage/CardBalance';
import { usePortfolioData } from '../../../../hooks/usePortfolioData';
import { useStockPrices } from '../../../../hooks/useStockPrices';
import { 
  calculatePortfolioMetrics, 
  getEnrichedHoldings, 
  formatCurrency, 
  formatPercentage, 
  getColorClass 
} from '../../../../utils/portfolioUtils';

const Portfolio = () => {
  const params = useParams();
  const id = params?.id; 
  
  
  const { userData, loading: userLoading, error: userError } = usePortfolioData();
  const { stockPrices, lastUpdateTime, loading: pricesLoading, error: pricesError } = useStockPrices(userData?.holdings);
  
  // Calculate metrics using utility functions
  const metrics = calculatePortfolioMetrics(userData?.holdings, stockPrices);
  const enrichedHoldings = getEnrichedHoldings(userData?.holdings, stockPrices);
  
  
  const isLoading = userLoading || (pricesLoading && !userData);
  const error = userError || pricesError;

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // No user data state
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">User not found.</p>
          <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
            <p className="text-gray-600">Track your investment performance and holdings</p>
          </div>
          <CardBalance />
        </div>

        {/* Portfolio Overview Container */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border w-auto md:w-[1200px]">
          {/* Current Value - Main Display */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Current value</p>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                {formatCurrency(metrics.totalCurrentValue)}
              </h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <BarChart3 className="w-4 h-4" />
                  Analyse
                </button>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bottom Row - Three Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Invested Value */}
            <div>
              <p className="text-gray-600 text-sm mb-2">Invested value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(metrics.totalInvested)}
              </p>
            </div>

            {/* 1D Returns */}
            <div>
              <p className="text-gray-600 text-sm mb-2">1D returns</p>
              <p className={`text-xl font-semibold ${getColorClass(metrics.totalDayChange)}`}>
                {formatCurrency(metrics.totalDayChange, { showSign: true })} ({formatPercentage(metrics.dayChangePerc, { showSign: true })})
              </p>
            </div>

            {/* Total Returns */}
            <div>
              <p className="text-gray-600 text-sm mb-2">Total returns</p>
              <p className={`text-xl font-semibold ${getColorClass(metrics.totalReturns)}`}>
                {formatCurrency(metrics.totalReturns, { showSign: true })} ({formatPercentage(metrics.totalReturnsPerc, { showSign: true })})
              </p>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Holdings ({userData?.holdings?.length || 0})
              </h2>
            </div>
          </div>

          {enrichedHoldings.length === 0 ? (
            <div className="p-8 text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">You don't have any stocks yet.</p>
              <p className="text-gray-400 text-sm mt-1">Start investing to see your holdings here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Price (1D%)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Returns (%)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current (Invested)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrichedHoldings.map((holding) => (
                    <tr key={holding.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {holding.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                            <div className="text-sm text-gray-500">
                              {holding.qty} shares • Avg. ₹{holding.avgCost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{holding.currentPrice.toFixed(2)}
                        </div>
                        <div className={`text-sm flex items-center justify-end gap-1 ${getColorClass(holding.dayChangePerc)}`}>
                          {holding.dayChangePerc >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {formatPercentage(holding.dayChangePerc, { showSign: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`text-sm font-medium ${getColorClass(holding.returnsPerc)}`}>
                          {formatCurrency(holding.returns, { showSign: true })}
                        </div>
                        <div className={`text-sm ${getColorClass(holding.returnsPerc)}`}>
                          {formatPercentage(holding.returnsPerc, { showSign: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(holding.current)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(holding.invested)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Virtual Balance: {formatCurrency(userData?.virtualBalance || 0, { maximumFractionDigits: 2 })}
          </p>
          {lastUpdateTime && (
            <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdateTime}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;